import { routing, type AppLocale } from "@/i18n/routing";

/** Practical check, not full RFC 5322: one @, no spaces, a dot in the domain, at most 254 characters. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Lowercased, trimmed address, or undefined when it can't be an email. */
export function normalizeEmail(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : undefined;
}

export type WaitlistResult = { status: 200 | 400 | 502 | 503; body: { ok: true } | { error: "invalid" | "unavailable" | "failed" } };
export type WaitlistEnv = { url?: string; key?: string };

/**
 * Adds an email to the Supabase `waitlist` table (docs/supabase/waitlist.sql). The table only
 * accepts inserts, and a repeated address is silently ignored, so a visitor can sign up twice
 * without an error and nothing about other signups is ever revealed.
 */
export async function joinWaitlist(input: unknown, env: WaitlistEnv, fetcher: typeof fetch = fetch): Promise<WaitlistResult> {
  if (!env.url || !env.key) return { status: 503, body: { error: "unavailable" } };
  const { email, locale, company } = (input ?? {}) as Record<string, unknown>;
  // Honeypot: the hidden "company" field is only ever filled by bots. Pretend it worked.
  if (typeof company === "string" && company.trim()) return { status: 200, body: { ok: true } };
  const address = normalizeEmail(email);
  if (!address) return { status: 400, body: { error: "invalid" } };
  const language = routing.locales.includes(locale as AppLocale) ? (locale as AppLocale) : null;

  const response = await fetcher(`${env.url.replace(/\/$/, "")}/rest/v1/waitlist?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: env.key,
      // Legacy anon keys are JWTs and also go in Authorization; new `sb_publishable_…` keys must not.
      ...(env.key.startsWith("eyJ") ? { Authorization: `Bearer ${env.key}` } : {}),
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({ email: address, locale: language, source: "website" }),
  });
  return response.ok ? { status: 200, body: { ok: true } } : { status: 502, body: { error: "failed" } };
}
