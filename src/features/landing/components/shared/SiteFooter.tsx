import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { StoreBadge } from "./AppStoreBadges";
import { PosterStage } from "./PosterStage";

const FOOTER_LINKS = [
  { key: "privacy", slug: "privacy" },
  { key: "terms", slug: "terms" },
  { key: "contact", slug: "contact" },
] as const;

export function SiteFooter({ homePath }: { homePath: string }) {
  const t = useTranslations("Closing");
  const footer = useTranslations("Footer");
  const common = useTranslations("Common");
  const routeHref = (slug: string) => (homePath === "/" ? `/${slug}` : `${homePath}/${slug}`);

  return (
    <footer className="relative bg-mochi-pink">
      <PosterStage spacing="none">
        <div className="grid h-108 grid-cols-[auto_1fr_auto] items-center rounded-t-[calc(22*var(--spacing))] bg-white py-9 px-126 max-poster:relative max-poster:z-2 max-poster:h-[150px] max-poster:px-[20px] max-poster:py-[22px] max-poster:rounded-t-[24px] max-phone:h-[196px] max-phone:grid-cols-1">
          <a href={`${homePath}#top`} className="col-start-1 row-start-1 flex items-center gap-20 text-ink-black max-poster:gap-[14px] max-phone:justify-self-center" aria-label={common("backToTop")}>
            <Image className="size-50 rounded-u-13 max-poster:size-[46px] max-poster:rounded-[12px]" src={LANDING_ASSETS.appIcon} alt="" width={256} height={256} />
            <i className="h-26 w-1.5 bg-closing-brand-divider" aria-hidden="true" />
            <b className="whitespace-nowrap text-u-24.5 font-max tracking-[-0.02em] max-poster:text-[20px]">{t("brand")}</b>
          </a>
          <div className="col-start-3 row-start-1 justify-self-end max-phone:hidden">
            <StoreBadge placement="footer" />
          </div>
          <div className="col-span-full row-start-2 mt-8 flex w-full flex-row items-center justify-between max-poster:mt-[14px] max-phone:mt-[20px] max-phone:flex-col max-phone:justify-center max-phone:text-center">
            <nav className="flex flex-wrap justify-center gap-x-18 gap-y-[6px] max-poster:gap-x-[18px]" aria-label={footer("navLabel")}>
              {FOOTER_LINKS.map((item) => (
                <a
                  key={item.key}
                  href={routeHref(item.slug)}
                  className="text-u-10.5 font-heavy text-ink-navy underline-offset-4 hover:underline max-poster:text-[12px] max-phone:text-[11px]"
                >
                  {footer(item.key)}
                </a>
              ))}
            </nav>
            <p className="text-balance mt-4 max-w-360 text-u-8.5 font-bold leading-[1.25] text-ink-navy/70 max-poster:mt-[8px] max-poster:max-w-[520px] max-poster:text-[10px]">
              {footer("disclaimer")}
            </p>
          </div>
        </div>
      </PosterStage>
    </footer>
  );
}
