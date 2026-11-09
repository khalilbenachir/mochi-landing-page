const ENV_NAME = "NEXT_PUBLIC_CONTACT_EMAIL";
/** One plain address: nothing that could add `mailto:` headers (`?`, `&`, `#`) or extra recipients. */
const EMAIL = /^[^\s@<>()[\]"',;:?&#]+@[^\s@<>()[\]"',;:?&#]+\.[^\s@<>()[\]"',;:?&#]+$/;

/**
 * Resolve the public privacy contact address. Returns null only outside production, so a
 * launch build can never ship the `[YOUR EMAIL]` placeholder; never invent a support address.
 */
export function resolveContactEmail({ value, nodeEnv }: { value: string | undefined; nodeEnv: string | undefined }) {
  const trimmed = value?.trim();
  if (!trimmed) {
    if (nodeEnv === "production") {
      throw new Error(`${ENV_NAME} is required for production builds: set it to the real privacy contact address.`);
    }
    return null;
  }
  if (!EMAIL.test(trimmed)) throw new Error(`${ENV_NAME} is invalid: expected an email address (received "${trimmed}").`);
  return trimmed;
}

export const PRIVACY_CONTACT_EMAIL = resolveContactEmail({
  value: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  nodeEnv: process.env.NODE_ENV,
});
