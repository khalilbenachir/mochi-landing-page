import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { StoreBadge } from "./AppStoreBadges";
import { PosterStage } from "./PosterStage";

const FOOTER_LINKS = [
  { key: "privacy", slug: "privacy" },
  { key: "terms", slug: "terms" },
  { key: "contact", slug: "privacy#contact" },
] as const;

/**
 * Two rows: brand + App Store badge, then the centered legal links and disclaimer. Nothing sets a fixed height
 * and the brand may wrap, so long localized names (e.g. "Mochi: calendario menstrual") never run
 * under the badge.
 */
export function SiteFooter({ homePath }: { homePath: string }) {
  const t = useTranslations("Closing");
  const footer = useTranslations("Footer");
  const common = useTranslations("Common");
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
          <div className="col-span-full mt-12 flex flex-col items-center gap-6 text-center max-poster:mt-[16px] max-poster:gap-[8px] max-phone:mt-[20px]">
            <nav className="flex flex-wrap justify-center gap-x-18 gap-y-[6px]" aria-label={footer("navLabel")}>
              {FOOTER_LINKS.map((item) => (
                <a
                  key={item.key}
                  href={routeHref(item.slug)}
                  className="whitespace-nowrap text-u-10.5 font-heavy text-ink-navy underline-offset-4 hover:underline max-poster:text-[12px] max-phone:text-[11px]"
                >
                  {footer(item.key)}
                </a>
              ))}
            </nav>
            <p className="max-w-500 text-balance text-u-8.5 font-bold leading-[1.25] text-ink-navy/70 max-poster:max-w-[520px] max-poster:text-[10px]">
              {footer("disclaimer")}
            </p>
          </div>
        </div>
      </PosterStage>
    </footer>
  );
}
