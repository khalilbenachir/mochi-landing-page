import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import { PLATFORM_COLORS } from "@/app/platform-colors";
import { AnalyticsConsent } from "@/components/analytics/AnalyticsConsent";
import { ClosingSection } from "@/features/landing/components/sections/ClosingSection";
import { APP_STORE_LIVE } from "@/features/landing/components/shared/AppStoreBadges";
import { SiteFooter } from "@/features/landing/components/shared/SiteFooter";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { WaitlistDialog } from "@/features/waitlist/components/WaitlistDialog.client";
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const consent = await getTranslations("Consent");
  const waitlist = await getTranslations("Waitlist");
  const homePath = localePath(locale);
  const privacyHref = homePath === "/" ? "/privacy" : `${homePath}/privacy`;

  return (
    <html lang={locale} className={nunito.variable}>
      <body className="flex min-h-dvh flex-col">
        {children}
        <ClosingSection />
        <SiteFooter homePath={homePath} />
        {APP_STORE_LIVE ? null : (
          <WaitlistDialog
            locale={locale}
            privacyHref={`${privacyHref}#waitlist`}
            image={{ src: LANDING_ASSETS.accountMochi, width: 680, height: 616 }}
            copy={{
              eyebrow: waitlist("eyebrow"),
              title: waitlist("title"),
              body: waitlist("body"),
              emailLabel: waitlist("emailLabel"),
              placeholder: waitlist("placeholder"),
              submit: waitlist("submit"),
              sending: waitlist("sending"),
              consent: waitlist("consent"),
              privacyLink: waitlist("privacyLink"),
              successTitle: waitlist("successTitle"),
              successBody: waitlist("successBody"),
              invalid: waitlist("invalid"),
              failed: waitlist("failed"),
              close: waitlist("close"),
              imageAlt: waitlist("imageAlt"),
            }}
          />
        )}
        <Analytics />
        {gtmId && (
          <AnalyticsConsent
            gtmId={gtmId}
            privacyHref={privacyHref}
            copy={{
              title: consent("title"),
              message: consent("message"),
              privacyLink: consent("privacyLink"),
              accept: consent("accept"),
              decline: consent("decline"),
            }}
          />
        )}
      </body>
    </html>
  );
}
