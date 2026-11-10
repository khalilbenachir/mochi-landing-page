const ACTION_ENV = "NEXT_PUBLIC_NEWSLETTER_FORM_ACTION";

/** Owner-supplied inbox that receives the default, visitor-sent subscription email. */
export const NEWSLETTER_RECIPIENT = "hello@mochiii.app";

/**
 * Resolve the optional third-party form endpoint. An unset value keeps the email-request
 * fallback; anything set must be an absolute HTTPS URL, so a typo or an insecure endpoint
 * fails the build instead of silently posting reader emails somewhere unexpected.
 */
export function resolveNewsletterAction(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`${ACTION_ENV} is invalid: expected an absolute HTTPS URL (received "${trimmed}").`);
  }
  if (url.protocol !== "https:") throw new Error(`${ACTION_ENV} must use HTTPS (received "${trimmed}").`);
  return url.href;
}

export const NEWSLETTER_FORM_ACTION = resolveNewsletterAction(process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ACTION);
