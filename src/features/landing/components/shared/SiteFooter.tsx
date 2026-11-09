import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { ClosingStoreBadge } from "./AppStoreBadges";
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
        <div className="grid h-[calc(108*var(--u))] grid-cols-[auto_1fr_auto] items-center rounded-[calc(22*var(--u))_calc(22*var(--u))_0_0] bg-white py-[calc(9*var(--u))] pl-[calc(126*var(--u))] pr-[calc(126*var(--u))] max-poster:relative max-poster:z-2 max-poster:h-[150px] max-poster:px-[20px] max-poster:py-[22px] max-poster:rounded-[24px_24px_0_0] max-phone:h-[196px] max-phone:grid-cols-1">
          <a href={`${homePath}#top`} className="col-start-1 row-start-1 flex items-center gap-[calc(20*var(--u))] text-ink-black no-underline max-poster:gap-[14px] max-phone:justify-self-center" aria-label={common("backToTop")}>
            <Image className="h-[calc(50*var(--u))] w-[calc(50*var(--u))] rounded-[calc(13*var(--u))] max-poster:h-[46px] max-poster:w-[46px] max-poster:rounded-[12px]" src={LANDING_ASSETS.appIcon} alt="" width={256} height={256} />
            <i className="h-[calc(26*var(--u))] w-[calc(1.5*var(--u))] bg-closing-brand-divider" aria-hidden="true" />
            <b className="whitespace-nowrap text-[calc(24.5*var(--u))] font-[1000] tracking-[-0.02em] max-poster:text-[20px]">{t("brand")}</b>
          </a>
          <div className="col-start-3 row-start-1 justify-self-end max-phone:hidden">
            <ClosingStoreBadge variant="footer" />
          </div>
          <div className="col-span-full row-start-2 mt-[calc(8*var(--u))] flex w-full flex-row items-center justify-between max-poster:mt-[14px] max-phone:mt-[20px] max-phone:flex-col max-phone:justify-center max-phone:text-center">
            <nav className="flex flex-wrap justify-center gap-x-[calc(18*var(--u))] gap-y-[6px] max-poster:gap-x-[18px]" aria-label={footer("navLabel")}>
              {FOOTER_LINKS.map((item) => (
                <a
                  key={item.key}
                  href={routeHref(item.slug)}
                  className="text-[calc(10.5*var(--u))] font-[850] text-ink-navy underline-offset-4 hover:text-ink-navy hover:underline max-poster:text-[12px] max-phone:text-[11px]"
                >
                  {footer(item.key)}
                </a>
              ))}
            </nav>
            <p className="text-balance m-0 mt-[calc(4*var(--u))] max-w-[calc(360*var(--u))] text-[calc(8.5*var(--u))] font-[700] leading-[1.25] text-ink-navy/70 max-poster:mt-[8px] max-poster:max-w-[520px] max-poster:text-[10px]">
              {footer("disclaimer")}
            </p>
          </div>
        </div>
      </PosterStage>
    </footer>
  );
}
