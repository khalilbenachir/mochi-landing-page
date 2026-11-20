import { localeRoutePath, type AppLocale } from "@/i18n/routing";

/** Stable source destinations; blog source names live in the messages. Site paths are locale-neutral. */
export const EDITORIAL_SOURCE_URLS = {
  menstrualCycle: "https://womenshealth.gov/menstrual-cycle/your-menstrual-cycle",
  menstrualBloodLoss: "https://together.stjude.org/en-us/treatment-tests-procedures/symptoms-side-effects/heavy-menstrual-bleeding.html",
  menstrualComposition: "https://www.nj.gov/health/womenshealth/reproductive-health/periods-menstruation/periods-and-pregnancy/",
  periodOverview: "https://www.nhs.uk/conditions/periods/",
  heavyPeriods: "https://www.nhs.uk/conditions/heavy-periods/",
  heavyMenstrualBleeding: "https://www.acog.org/womens-health/faqs/heavy-menstrual-bleeding",
  abnormalUterineBleeding: "https://www.acog.org/womens-health/faqs/abnormal-uterine-bleeding",
  heavyBleedingGuidance: "https://www.nice.org.uk/guidance/ng88/chapter/Recommendations",
  heavyFlowVolume: "https://www.healthdirect.gov.au/symptoms/heavy-periods",
  periodBlood: "https://health.clevelandclinic.org/what-does-the-color-of-your-period-mean",
  fertilityCycleDay: "https://fertilitycentermi.com/wp-content/uploads/2020/09/FREQUENTLY-ASKED-QUESTIONS.pdf",
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
  mochiFeatures: "/",
  floFree: "https://help.flo.health/hc/en-us/articles/4411293934740-What-s-included-in-the-free-version",
  floAnonymous: "https://flo.health/product-tour/anonymous-mode",
  floFtc: "https://www.ftc.gov/legal-library/browse/cases-proceedings/192-3133-flo-health-inc",
  floExport: "https://help.flo.health/hc/en-us/articles/360054973811-How-do-I-get-a-copy-of-my-data",
  floDelete: "https://help.flo.health/hc/en-us/articles/360042567131-How-can-I-delete-my-account",
  eukiApp: "https://eukiapp.org/",
  eukiPrivacy: "https://eukiapp.org/privacy-faqs-resources",
  eukiFeatures: "https://eukiapp.org/app-features",
  clueAccount: "https://support.helloclue.com/hc/en-us/articles/360036966192-Why-do-I-need-a-Clue-account",
  cluePrivacy: "https://helloclue.com/privacy",
  clueFree: "https://support.helloclue.com/hc/en-us/articles/28892034251037-Using-Clue-for-free",
  dripApp: "https://dripapp.org/",
  dripIos: "https://apps.apple.com/us/app/drip-period-cycle-tracker/id1584564949",
  dripAndroid: "https://play.google.com/store/apps/details?id=com.drip",
  appleCycle: "https://support.apple.com/en-us/120356",
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
} as const;
export type FaqSourceId = EditorialSourceId | keyof typeof FAQ_SOURCE_URLS;
const ALL_SOURCE_URLS = { ...EDITORIAL_SOURCE_URLS, ...FAQ_SOURCE_URLS };

export type SourceLink = { href: string; label: string };

/** External sources as-is; Mochi's own pages (`/privacy`, `/terms#health`) in the reader's language. */
export function sourceHref(id: FaqSourceId, locale: AppLocale) {
  const href: string = ALL_SOURCE_URLS[id];
  return href.startsWith("/") ? localeRoutePath(locale, href.slice(1)) : href;
}
