import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PUBLIC_SITE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PrivacyPage } from "@/features/privacy/components/PrivacyPage";
import { LOCALE_META, localeRoutePath, routing, type AppLocale } from "@/i18n/routing";

type PrivacyPageProps = { params: Promise<{ locale: AppLocale }> };
const privacyPath = (locale: AppLocale) => localeRoutePath(locale, "privacy");

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });
  const title = t("metadataTitle");
  const description = t("metadataDescription");
  return {
    ...(PUBLIC_SITE_URL ? { metadataBase: new URL(PUBLIC_SITE_URL) } : {}),
    title,
    description,
    applicationName: SITE_NAME,
    ...(PUBLIC_SITE_URL ? {
      alternates: {
        canonical: privacyPath(locale),
        languages: {
          ...Object.fromEntries(routing.locales.map((candidate) => [candidate, privacyPath(candidate)])),
          "x-default": privacyPath(routing.defaultLocale),
        },
      },
    } : {}),
    robots: { index: true, follow: true },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: { title, description, siteName: SITE_NAME, type: "website", locale: LOCALE_META[locale].ogLocale, url: privacyPath(locale), images: [{ url: `${SITE_URL}${LANDING_ASSETS.socialCard}`, width: 1200, height: 630, alt: SITE_NAME }] },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}${LANDING_ASSETS.socialCard}`] },
  };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <PrivacyPage />;
}
