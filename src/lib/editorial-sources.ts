import { localeRoutePath, type AppLocale } from "@/i18n/routing";

/** Stable source destinations; blog source names live in the messages. Site paths are locale-neutral. */
export const EDITORIAL_SOURCE_URLS = {
  menstrualCycle: "https://womenshealth.gov/menstrual-cycle/your-menstrual-cycle",
  irregularPeriods: "https://www.nhs.uk/symptoms/irregular-periods/",
  missedPeriods: "https://www.nhs.uk/symptoms/missed-or-late-periods/",
  pregnancyTests: "https://www.nhs.uk/pregnancy/trying-for-a-baby/doing-a-pregnancy-test/",
  periodProblems: "https://www.nhs.uk/conditions/periods/period-problems/",
  appPrivacy: "https://support.apple.com/en-us/102399",
  mochiPrivacy: "/privacy",
  mochiTerms: "/terms#health",
  menstrualHygiene: "https://www.cdc.gov/hygiene/about/menstrual-hygiene.html",
  firstPeriod: "https://www.acog.org/womens-health/faqs/your-first-period",
  cycleOverview: "https://womenshealth.gov/pregnancy/menstrual-cycle",
  cyclePhases: "https://my.clevelandclinic.org/health/articles/10132-menstrual-cycle",
  periodPain: "https://www.nhs.uk/symptoms/period-pain/",
  pms: "https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome",
} as const;

export type EditorialSourceId = keyof typeof EDITORIAL_SOURCE_URLS;

/** Additional sources used by localized landing FAQs, with their own translated labels. */
export const FAQ_SOURCE_URLS = {
  cycleFertility: "https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/",
  ovulation: "https://my.clevelandclinic.org/health/articles/23439-ovulation",
  ovulationDetection: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/ovulation-detection/",
  naturalFertility: "https://www.reproductivefacts.org/news-and-publications/fact-sheets-and-infographics/optimizing-natural-fertility/",
  fertilityAwareness: "https://www.nhs.uk/contraception/methods-of-contraception/natural-family-planning/",
  trackingCycle: "https://opa.hhs.gov/reproductive-health/understanding-fertility-basics",
  periodBlood: "https://health.clevelandclinic.org/what-does-the-color-of-your-period-mean",
} as const;
export type FaqSourceId = EditorialSourceId | keyof typeof FAQ_SOURCE_URLS;
const ALL_SOURCE_URLS = { ...EDITORIAL_SOURCE_URLS, ...FAQ_SOURCE_URLS };

export type SourceLink = { href: string; label: string };

/** External sources as-is; Mochi's own pages (`/privacy`, `/terms#health`) in the reader's language. */
export function sourceHref(id: FaqSourceId, locale: AppLocale) {
  const href: string = ALL_SOURCE_URLS[id];
  return href.startsWith("/") ? localeRoutePath(locale, href.slice(1)) : href;
}
