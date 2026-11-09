import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PUBLIC_SITE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { LOCALE_META, localeRoutePath, routing, type AppLocale } from "@/i18n/routing";
import { LEGAL_PAGES, type LegalPageSlug } from "./pages";

/** Shared localized metadata: canonical, hreflang cluster, Open Graph and Twitter cards. */
export async function legalPageMetadata(locale: AppLocale, slug: LegalPageSlug): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: LEGAL_PAGES[slug] });
  const title = t("metadataTitle");
  const description = t("metadataDescription");
  const pathFor = (candidate: AppLocale) => localeRoutePath(candidate, slug);
  const image = `${SITE_URL}${LANDING_ASSETS.socialCard}`;
  return {
    ...(PUBLIC_SITE_URL ? { metadataBase: new URL(PUBLIC_SITE_URL) } : {}),
    title,
    description,
    applicationName: SITE_NAME,
    ...(PUBLIC_SITE_URL ? {
      alternates: {
        canonical: pathFor(locale),
        languages: {
          ...Object.fromEntries(routing.locales.map((candidate) => [candidate, pathFor(candidate)])),
          "x-default": pathFor(routing.defaultLocale),
        },
      },
    } : {}),
    robots: { index: true, follow: true },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: { title, description, siteName: SITE_NAME, type: "website", locale: LOCALE_META[locale].ogLocale, url: pathFor(locale), images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
