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
 * Adds an email to the Supabase `waitlist` table (docs/supabase/waitlist.sql). The public key may
 * only INSERT, so this is a plain insert: an upsert (`ON CONFLICT DO NOTHING`) would need a read
 * policy under row-level security. A repeated address hits the unique index (409, code 23505) and
 * counts as success, so signing up twice is harmless and reveals nothing about other signups.
 */
export async function joinWaitlist(input: unknown, env: WaitlistEnv, fetcher: typeof fetch = fetch): Promise<WaitlistResult> {
  if (!env.url || !env.key) return { status: 503, body: { error: "unavailable" } };
  const { email, locale, company } = (input ?? {}) as Record<string, unknown>;
  // Honeypot: the hidden "company" field is only ever filled by bots. Pretend it worked.
  if (typeof company === "string" && company.trim()) return { status: 200, body: { ok: true } };
  const address = normalizeEmail(email);
  if (!address) return { status: 400, body: { error: "invalid" } };
  const language = routing.locales.includes(locale as AppLocale) ? (locale as AppLocale) : null;

  const response = await fetcher(`${env.url.replace(/\/$/, "")}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      apikey: env.key,
      // Legacy anon keys are JWTs and also go in Authorization; new `sb_publishable_…` keys must not.
      ...(env.key.startsWith("eyJ") ? { Authorization: `Bearer ${env.key}` } : {}),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email: address, locale: language, source: "website" }),
  });
  const alreadyJoined = response.status === 409 && (await response.json().catch(() => null))?.code === "23505";
  return response.ok || alreadyJoined ? { status: 200, body: { ok: true } } : { status: 502, body: { error: "failed" } };
}
