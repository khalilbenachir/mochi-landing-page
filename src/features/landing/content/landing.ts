import { resolveSiteOrigin } from "./site-url";

export const SITE_NAME = "Mochi";

/** Public origin used by metadata, JSON-LD and the sitemap. Required in production builds. */
export const PUBLIC_SITE_URL = resolveSiteOrigin({
  value: process.env.NEXT_PUBLIC_SITE_URL,
  nodeEnv: process.env.NODE_ENV,
});

export const SITE_URL = PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Replace with the real App Store link once the app is live. */
export const APP_STORE_URL = "#get";

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
