import type { Metadata, Viewport } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "@fontsource-variable/nunito";
import { PLATFORM_COLORS } from "@/app/platform-colors";
import { StructuredData } from "@/components/seo/StructuredData";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PUBLIC_SITE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { LOCALE_META, localePath, routing, type AppLocale } from "@/i18n/routing";
import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const socialImageUrl = `${SITE_URL}${LANDING_ASSETS.socialCard}`;

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();

  const locale = localeParam as AppLocale;
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

export const viewport: Viewport = {
  themeColor: PLATFORM_COLORS.browserTheme.value,
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <StructuredData locale={locale} />
        {children}
      </body>
    </html>
  );
}
