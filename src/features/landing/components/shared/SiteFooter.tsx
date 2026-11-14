import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ConsentSettingsButton } from "@/components/analytics/ConsentSettingsButton";
import { blogPath } from "@/features/blog/locales";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { StoreBadge } from "./AppStoreBadges";
import { PosterStage } from "./PosterStage";
import { SpreadOrCenter } from "./SpreadOrCenter";

const FOOTER_LINKS = [
  { key: "privacy", slug: "privacy" },
  { key: "terms", slug: "terms" },
  { key: "contact", slug: "privacy#contact" },
] as const;

/**
 * Two rows: brand + App Store badge, then legal links + disclaimer. The second row sits at the
 * edges (links left, disclaimer right) while both fit on one line and centers once it wraps.
 * Nothing sets a fixed height and the brand may wrap, so long localized names
 * (e.g. "Mochi: calendario menstrual") never run under the badge.
 */
export function SiteFooter({ homePath }: { homePath: string }) {
  const t = useTranslations("Closing");
  const footer = useTranslations("Footer");
  const common = useTranslations("Common");
  const navigation = useTranslations("Navigation");
  const locale = useLocale();
  const consent = useTranslations("Consent");
  const routeHref = (slug: string) => (homePath === "/" ? `/${slug}` : `${homePath}/${slug}`);

  return (
    <footer className="relative bg-hero-band pt-[32px]">
      <PosterStage spacing="none">
        <div className="grid min-h-108 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-32 rounded-t-[calc(22*var(--spacing))] bg-white py-14 px-126 max-poster:relative max-poster:z-2 max-poster:gap-x-16 max-poster:px-[20px] max-poster:py-[22px] max-poster:rounded-t-[24px] max-phone:grid-cols-1">
          <a href={`${homePath}#top`} className="flex min-w-0 items-center gap-20 text-ink-black max-poster:gap-[14px] max-phone:justify-self-center" aria-label={common("backToTop")}>
            <Image className="size-50 flex-none rounded-u-13 max-poster:size-[46px] max-poster:rounded-[12px]" src={LANDING_ASSETS.appIcon} alt="" width={256} height={256} />
            <i className="h-26 w-1.5 flex-none bg-closing-brand-divider" aria-hidden="true" />
            <b className="min-w-0 text-balance text-u-24.5 font-max leading-[1.05] tracking-[-0.02em] max-poster:text-[20px]">{t("brand")}</b>
          </a>
          <div className="justify-self-end max-phone:hidden">
            <StoreBadge placement="footer" />
          </div>
          <SpreadOrCenter className="col-span-full mt-12 items-center justify-between gap-x-32 gap-y-6 data-stacked:justify-center max-poster:mt-[16px] max-poster:gap-y-[8px] max-phone:mt-[20px]">
            <nav className="flex max-w-full shrink-0 flex-wrap gap-x-18 gap-y-[6px] group-data-stacked/spread:justify-center" aria-label={footer("navLabel")}>
              <Link href={blogPath(locale)} className="whitespace-nowrap text-u-10.5 font-heavy text-ink-navy underline-offset-4 hover:underline max-poster:text-[12px] max-phone:text-[11px]">{navigation("blog")}</Link>
              {FOOTER_LINKS.map((item) => (
                <a
                  key={item.key}
                  href={routeHref(item.slug)}
                  className="whitespace-nowrap text-u-10.5 font-heavy text-ink-navy underline-offset-4 hover:underline max-poster:text-[12px] max-phone:text-[11px]"
                >
                  {footer(item.key)}
                </a>
              ))}
              {process.env.NEXT_PUBLIC_GTM_ID && (
                <ConsentSettingsButton
                  label={consent("settings")}
                  className="cursor-pointer whitespace-nowrap text-u-10.5 font-heavy text-ink-navy underline-offset-4 hover:underline max-poster:text-[12px] max-phone:text-[11px]"
                />
              )}
            </nav>
            <p className="max-w-full shrink-0 text-balance text-right text-u-8.5 font-bold leading-[1.25] text-ink-navy/70 group-data-stacked/spread:text-center max-poster:text-[10px]">
              {footer("disclaimer")}
            </p>
          </SpreadOrCenter>
        </div>
      </PosterStage>
    </footer>
  );
}
