import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PUBLIC_SITE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { LOCALE_META, localeRoutePath, routing, type AppLocale } from "@/i18n/routing";
import { CALCULATOR_SLUG, OVULATION_CALCULATOR_SLUG } from "./content/calculate";

export type CalculatorKind = "period" | "ovulation";

/** Route segment and message namespace of each calculator page. */
export const CALCULATORS = {
  period: { slug: CALCULATOR_SLUG, namespace: "PeriodCalculator" },
  ovulation: { slug: OVULATION_CALCULATOR_SLUG, namespace: "OvulationCalculator" },
} as const satisfies Record<CalculatorKind, { slug: string; namespace: string }>;

export const calculatorPath = (locale: AppLocale, kind: CalculatorKind = "period") => localeRoutePath(locale, CALCULATORS[kind].slug);

/** Canonical, hreflang cluster and social cards for a calculator in every locale. */
export async function calculatorMetadata(locale: AppLocale, kind: CalculatorKind = "period"): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: CALCULATORS[kind].namespace });
  const title = t("metadataTitle");
  const description = t("metadataDescription");
  const image = `${SITE_URL}${LANDING_ASSETS.socialCard}`;
  const path = (target: AppLocale) => calculatorPath(target, kind);
  return {
    ...(PUBLIC_SITE_URL ? { metadataBase: new URL(PUBLIC_SITE_URL) } : {}),
    title,
    description,
    applicationName: SITE_NAME,
    ...(PUBLIC_SITE_URL
      ? {
          alternates: {
            canonical: path(locale),
            languages: {
              ...Object.fromEntries(routing.locales.map((candidate) => [candidate, path(candidate)])),
              "x-default": path(routing.defaultLocale),
            },
          },
        }
      : {}),
    robots: { index: true, follow: true },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: { title, description, siteName: SITE_NAME, type: "website", locale: LOCALE_META[locale].ogLocale, url: path(locale), images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
