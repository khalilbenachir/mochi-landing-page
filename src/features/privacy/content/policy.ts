/** Stable anchors are shared by the summary cards, reading panel and deep links. */
export const POLICY_SECTION_IDS = ["collect", "device", "analytics", "backup", "subscriptions", "rights", "children", "contact"] as const;
export type PolicySectionId = (typeof POLICY_SECTION_IDS)[number];

export const POLICY_UPDATED_AT = "2026-11-09T00:00:00Z";

export const PRIVACY_ASSETS = {
  hero: "/privacy-art/privacy-dome.webp",
  contact: "/privacy-art/contact-mochi.webp",
} as const;

export type PolicySectionCopy = {
  id: PolicySectionId;
  nav: string;
  title: string;
  body: string;
  detail: string;
};
