const ENV_NAME = "NEXT_PUBLIC_SITE_URL";

export type ResolveSiteOriginOptions = {
  value: string | undefined;
  nodeEnv: string | undefined;
};

function invalid(reason: string, value: string): Error {
  return new Error(`${ENV_NAME} is invalid: ${reason} (received "${value}").`);
}

/**
 * Resolve the public site origin. Returns undefined only when the value is
 * absent outside production; throws for invalid values and for a missing
 * value in production.
 */
export function resolveSiteOrigin({ value, nodeEnv }: ResolveSiteOriginOptions): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    if (nodeEnv === "production") {
      throw new Error(
        `${ENV_NAME} is required for production builds: set it to an absolute origin such as https://example.com.`,
      );
    }
    return undefined;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw invalid("malformed or not an absolute URL", trimmed);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw invalid("protocol must be http or https", trimmed);
  }
  if (url.username || url.password) {
    throw invalid("credentials are not allowed", trimmed);
  }
  if (trimmed.includes("?")) {
    throw invalid("query string is not allowed", trimmed);
  }
  if (trimmed.includes("#")) {
    throw invalid("fragment is not allowed", trimmed);
  }
  if (url.pathname !== "/") {
    throw invalid("path is not allowed, use a root origin", trimmed);
  }

  return url.origin;
}
