/** Every legal page routed under each locale home, with its message namespace; the sitemap lists exactly these. */
export const LEGAL_PAGES = { privacy: "PrivacyPolicy", terms: "TermsOfUse" } as const;
export type LegalPageSlug = keyof typeof LEGAL_PAGES;
export const LEGAL_PAGE_SLUGS = Object.keys(LEGAL_PAGES) as LegalPageSlug[];
