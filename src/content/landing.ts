export const SITE_NAME = "Mochi";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/** Public origin used by metadata, JSON-LD and the sitemap. */
export const PUBLIC_SITE_URL = configuredSiteUrl
  ? configuredSiteUrl.replace(/\/$/, "")
  : undefined;

export const SITE_URL = PUBLIC_SITE_URL ?? "http://localhost:3000";

export const COMPARISON_ROW_IDS = [
  "account",
  "offline",
  "reminder",
  "analytics",
  "rewards",
] as const;

export const FREE_FEATURE_IDS = ["tracking", "reminder", "rewards", "offline"] as const;
export const PLUS_FEATURE_IDS = ["everything", "flavors", "insights"] as const;

export const FAQ_IDS = [
  "what",
  "free",
  "private",
  "offline",
  "reminder",
  "lockScreen",
  "medical",
] as const;

export const STRUCTURED_FEATURE_IDS = [
  "predictions",
  "reminders",
  "logging",
  "offline",
  "backup",
  "rewards",
] as const;

/** Localized by the App Store in production; keep null until pricing is final. */
export const PLUS_PRICE: string | null = null;
