/** Stable anchors are shared by the summary cards, reading panel and deep links. */
export const POLICY_SECTION_IDS = ["collect", "device", "analytics", "backup", "subscriptions", "providers", "deletion", "rights", "children", "contact"] as const;
export type PolicySectionId = (typeof POLICY_SECTION_IDS)[number];

export const POLICY_UPDATED_AT = "2026-11-13T00:00:00Z";

export const PRIVACY_ASSETS = {
  hero: "/privacy-art/privacy-mochi-blanket.webp",
  contact: "/privacy-art/contact-mochi.webp",
} as const;

export const PRIVACY_HERO_SIZE = { width: 934, height: 900 } as const;

/** Mochi icons (ChatGPT, from the app's Mochi) for the summary cards and the on-device callout. */
export const PRIVACY_SUMMARY_ICONS = {
  device: "/privacy-art/icon-device.webp",
  account: "/privacy-art/icon-account.webp",
  analytics: "/privacy-art/icon-analytics.webp",
  backup: "/privacy-art/icon-backup.webp",
  lock: "/privacy-art/icon-lock.webp",
} as const;
export type PrivacySummaryIconId = keyof typeof PRIVACY_SUMMARY_ICONS;

export type PolicySectionCopy = {
  id: PolicySectionId;
  nav: string;
  title: string;
  body: string;
  detail: string;
};
