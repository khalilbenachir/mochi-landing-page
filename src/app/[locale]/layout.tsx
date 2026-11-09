import type { Viewport } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import { PLATFORM_COLORS } from "@/app/platform-colors";
import { SiteFooter } from "@/features/landing/components/shared/SiteFooter";
import { localePath, routing } from "@/i18n/routing";
import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Self-hosted, preloaded, with a metric-matched fallback; exposed as `--font-nunito` for globals.css. */
const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-nunito",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: PLATFORM_COLORS.browserTheme.value,
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html lang={locale} className={nunito.variable}>
      <body className="flex min-h-dvh flex-col">
        {children}
        <SiteFooter homePath={localePath(locale)} />
      </body>
    </html>
  );
}
