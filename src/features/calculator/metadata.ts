import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PUBLIC_SITE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { LOCALE_META, localeRoutePath, routing, type AppLocale } from "@/i18n/routing";
import { CALCULATOR_SLUG } from "./content/calculate";

export const calculatorPath = (locale: AppLocale) => localeRoutePath(locale, CALCULATOR_SLUG);

/** Canonical, hreflang cluster and social cards for the calculator in every locale. */
export async function calculatorMetadata(locale: AppLocale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "PeriodCalculator" });
  const title = t("metadataTitle");
  const description = t("metadataDescription");
  const image = `${SITE_URL}${LANDING_ASSETS.socialCard}`;
  return {
    ...(PUBLIC_SITE_URL ? { metadataBase: new URL(PUBLIC_SITE_URL) } : {}),
    title,
    description,
    applicationName: SITE_NAME,
    ...(PUBLIC_SITE_URL
      ? {
          alternates: {
            canonical: calculatorPath(locale),
            languages: {
              ...Object.fromEntries(routing.locales.map((candidate) => [candidate, calculatorPath(candidate)])),
              "x-default": calculatorPath(routing.defaultLocale),
            },
          },
        }
      : {}),
    robots: { index: true, follow: true },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: { title, description, siteName: SITE_NAME, type: "website", locale: LOCALE_META[locale].ogLocale, url: calculatorPath(locale), images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
