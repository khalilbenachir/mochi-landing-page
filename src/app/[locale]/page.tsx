import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StructuredData } from "@/components/seo/StructuredData";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PUBLIC_SITE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { LOCALE_META, localePath, routing, type AppLocale } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: AppLocale }>;
};

const socialImageUrl = `${SITE_URL}${LANDING_ASSETS.socialCard}`;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const canonical = localePath(locale);
  const languageAlternates = {
    ...Object.fromEntries(
      routing.locales.map((supportedLocale) => [supportedLocale, localePath(supportedLocale)]),
    ),
    "x-default": localePath(routing.defaultLocale),
  };

  return {
    ...(PUBLIC_SITE_URL ? { metadataBase: new URL(PUBLIC_SITE_URL) } : {}),
    title: t("title"),
    description: t("description"),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "health",
    ...(PUBLIC_SITE_URL
      ? { alternates: { canonical, languages: languageAlternates } }
      : {}),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      siteName: SITE_NAME,
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => LOCALE_META[candidate].ogLocale),
      url: canonical,
      images: [{ url: socialImageUrl, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      images: [{ url: socialImageUrl, alt: SITE_NAME }],
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <StructuredData locale={locale} />
      <LandingPage />
    </>
  );
}
