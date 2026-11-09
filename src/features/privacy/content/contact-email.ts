const ENV_NAME = "NEXT_PUBLIC_CONTACT_EMAIL";
/** Development and test fallback only: production builds must configure the real address. */
export const DEFAULT_CONTACT_EMAIL = "test@mochi.app";
/** One plain address: nothing that could add `mailto:` headers (`?`, `&`, `#`) or extra recipients. */
const EMAIL = /^[^\s@<>()[\]"',;:?&#]+@[^\s@<>()[\]"',;:?&#]+\.[^\s@<>()[\]"',;:?&#]+$/;

/**
 * Resolve the public contact address. Outside production a missing value falls back to
 * `DEFAULT_CONTACT_EMAIL`; a production build without one fails, so a launch can never ship
 * the development address.
 */
export function resolveContactEmail({ value, nodeEnv }: { value: string | undefined; nodeEnv: string | undefined }): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    if (nodeEnv === "production") {
      throw new Error(`${ENV_NAME} is required for production builds: set it to the real contact address.`);
    }
    return DEFAULT_CONTACT_EMAIL;
  }
  if (!EMAIL.test(trimmed)) throw new Error(`${ENV_NAME} is invalid: expected an email address (received "${trimmed}").`);
  return trimmed;
}

export const PRIVACY_CONTACT_EMAIL = resolveContactEmail({
  value: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  nodeEnv: process.env.NODE_ENV,
});
