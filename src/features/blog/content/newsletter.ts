const ACTION_ENV = "NEXT_PUBLIC_NEWSLETTER_FORM_ACTION";

/** Owner-supplied inbox that receives the default, visitor-sent subscription email. */
export const NEWSLETTER_RECIPIENT = "support@mochiii.app";

/**
 * Resolve the optional third-party form endpoint. An unset value keeps the email-request
 * fallback. A mistakenly configured email address also keeps that fallback, with a
 * warning. Other values must be absolute HTTPS URLs so reader emails are not posted
 * to an unexpected destination.
 */
export function resolveNewsletterAction(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  if (/^[^\s@?&#:/]+@[^\s@?&#:/]+\.[a-z]+$/i.test(trimmed)) {
    console.warn(
      `${ACTION_ENV} expects an HTTPS form endpoint, not an email address. Using the email-request fallback to ${NEWSLETTER_RECIPIENT}. Remove this setting or replace it with your newsletter provider's HTTPS form URL.`,
    );
    return undefined;
  }
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
