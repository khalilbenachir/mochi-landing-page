import type { AppLocale } from "@/i18n/routing";

/** Stable anchors for the reader, summary cards, and shareable section URLs. */
export const TERMS_SECTION_IDS = ["using", "health", "subscriptions", "content", "acceptable-use", "changes", "contact"] as const;
export type TermsSectionId = (typeof TERMS_SECTION_IDS)[number];

/** Deliberate editorial date for the draft terms, never the build timestamp. */
export const TERMS_UPDATED_AT = "2026-11-09T00:00:00Z";

export const TERMS_ASSETS = {
  hero: "/terms-art/terms-mochi-scroll.webp",
  contact: "/privacy-art/privacy-contact.webp",
} as const;

export const TERMS_HERO_SIZE = { width: 1024, height: 819 } as const;
/** Apple Support's regional editions of "If you want to cancel a subscription from Apple". */
const APPLE_SUPPORT_REGIONS = { en: "en-us", fr: "fr-fr", de: "de-de", es: "es-es", "pt-BR": "pt-br", "pt-PT": "pt-pt" } as const satisfies Record<AppLocale, string>;

export function appleSubscriptionsUrl(locale: AppLocale) {
  return `https://support.apple.com/${APPLE_SUPPORT_REGIONS[locale]}/118428`;
}

export const TERMS_SUMMARY_CARDS = [
  { key: "medical", section: "health" },
  { key: "contraception", section: "health" },
  { key: "plus", section: "subscriptions" },
  { key: "privacy", section: null },
] as const satisfies readonly { key: string; section: TermsSectionId | null }[];

export type TermsSectionCopy = {
  id: TermsSectionId;
  nav: string;
  title: string;
  body: string;
  detail: string;
};
