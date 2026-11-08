import Image from "next/image";
import { useTranslations } from "next-intl";
import { FLAVOR_CARD_ASSETS } from "@/features/landing/content/assets";
import { COMPARISON_ROW_IDS } from "@/features/landing/content/landing";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

function Rays({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={cn(className, flip && "[transform:scaleX(-1)]")} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M24 4 28 15" /><path d="M8 13 18 20" /><path d="M5 30 17 29" />
      </g>
    </svg>
  );
}

const ROW_ICONS = ["user", "wifi", "bell", "chart", "gift"] as const;

function RowIcon({ name }: { name: (typeof ROW_ICONS)[number] }) {
  return (
    <svg className="h-[calc(14*var(--u))] w-[calc(14*var(--u))] flex-none max-tablet:h-[15px] max-tablet:w-[15px]" viewBox="0 0 24 24" aria-hidden="true">
      <g className="fill-ink-deep">
        {name === "user" && <><circle cx="12" cy="7.5" r="4.5" /><path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5Z" /></>}
        {name === "wifi" && <><path d="M12 20.5 9.4 17.6a3.6 3.6 0 0 1 5.2 0Z" /><path d="M5.8 13.4a8.8 8.8 0 0 1 12.4 0l-1.9 1.9a6.1 6.1 0 0 0-8.6 0Z" /><path d="M2.2 9.8a13.9 13.9 0 0 1 19.6 0l-1.9 1.9a11.2 11.2 0 0 0-15.8 0Z" /></>}
        {name === "bell" && <><path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5v4.2L3.8 16.6h16.4l-1.7-3.4V9A6.5 6.5 0 0 0 12 2.5Z" /><path d="M9.3 18.4a2.8 2.8 0 0 0 5.4 0Z" /></>}
        {name === "chart" && <><rect x="3.5" y="13" width="4" height="8" rx="1" /><rect x="10" y="8.5" width="4" height="12.5" rx="1" /><rect x="16.5" y="4" width="4" height="17" rx="1" /></>}
        {name === "gift" && <><rect x="3" y="8.5" width="18" height="4.5" rx="1" /><rect x="4.5" y="13" width="15" height="8" rx="1" /><path d="M12 8.5c-1.2-3.4-5.2-5.3-6.2-3S9 8.5 12 8.5Zm0 0c1.2-3.4 5.2-5.3 6.2-3S15 8.5 12 8.5Z" /></>}
      </g>
      {name === "gift" && <path className="stroke-white" d="M12 8.5V21" strokeWidth="1.6" />}
    </svg>
  );
}

const RAYS = "absolute z-2 text-sun-ray max-poster:hidden";
const CELL = "h-[calc(23.4*var(--u))] p-0 text-center max-tablet:h-auto";
const CELL_PAD = "max-tablet:px-[6px] max-tablet:py-[10px]";
const HEAD = "h-[calc(26*var(--u))] text-[calc(12.6*var(--u))] font-[1000] rounded-[calc(9*var(--u))_calc(9*var(--u))_0_0] max-tablet:h-[40px] max-tablet:p-[6px] max-tablet:text-[13px] max-tablet:leading-[1.15] max-tablet:rounded-[10px_10px_0_0]";
const ROW_HEAD = "flex items-center gap-[calc(10*var(--u))] pl-[calc(15*var(--u))] [border-left:calc(1*var(--u))_solid_var(--color-comparison-row-header-border)] font-[800] text-left whitespace-nowrap max-tablet:gap-[8px] max-tablet:pb-[10px] max-tablet:pl-[10px] max-tablet:pr-[6px] max-tablet:pt-[10px] max-tablet:whitespace-normal max-tablet:leading-[1.2]";
const ROW_DIVIDER = "[box-shadow:inset_0_calc(-1*var(--u))_0_var(--color-comparison-row-divider)]";
const BODY_CELL = "text-[calc(11*var(--u))] max-tablet:text-[13px] max-tablet:leading-[1.2]";

/** "Why Mochi?": Mochi against a typical period app. */
export function ComparisonSection() {
  const t = useTranslations("Comparison");

  return (
    <section id="why" className="relative overflow-hidden bg-white text-ink-navy">
      <PosterStage grid="800" className="aspect-[800/170] max-poster:px-[clamp(16px,4vw,40px)] max-poster:pb-[40px] max-poster:pt-[36px] max-phone:pb-[32px] max-phone:pt-[30px]">
        <Rays className={cn(RAYS, "left-[calc(40*var(--u))] top-[calc(28*var(--u))] w-[calc(36*var(--u))]")} />
        <h2 className="absolute z-2 left-[calc(88*var(--u))] top-[calc(46*var(--u))] m-0 text-[calc(35*var(--u))] font-[1000] leading-[1.12] tracking-[-0.02em] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:text-center max-poster:text-[clamp(36px,6.4vw,50px)] max-phone:text-[34px]">
          <span className="block max-poster:inline max-poster:whitespace-normal">{t("title1")}</span> <span className="ml-[calc(17*var(--u))] block max-poster:ml-0 max-poster:inline max-poster:whitespace-normal">{t("title2")}</span>
        </h2>
        <Rays className={cn(RAYS, "left-[calc(204*var(--u))] top-[calc(64*var(--u))] w-[calc(28*var(--u))]")} flip />
        <div className="absolute z-1 left-[calc(12*var(--u))] top-[calc(97*var(--u))] w-[calc(100*var(--u))] after:absolute after:left-[-12%] after:right-[-14%] after:bottom-[calc(-5*var(--u))] after:h-[calc(12*var(--u))] after:rounded-[50%] after:bg-comparison-matcha-bg after:content-[''] max-poster:hidden" aria-hidden="true">
          <Image className="relative z-1 h-auto w-full" src={FLAVOR_CARD_ASSETS.matcha} alt="" width={380} height={262} sizes="12vw" />
        </div>

        <table className="absolute left-[calc(270*var(--u))] top-[calc(11*var(--u))] w-[calc(504*var(--u))] border-separate border-spacing-0 text-[calc(10.6*var(--u))] max-poster:[--u:calc(min(100vw-32px,720px)/504)] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:mx-auto max-poster:mb-0 max-poster:mt-[22px] max-tablet:[--u:1px] max-tablet:w-full max-tablet:text-[13px]">
          <caption className="sr-only">{t("caption")}</caption>
          <thead>
            <tr>
              <td className={cn(CELL, CELL_PAD)} />
              <th scope="col" className={cn(CELL, HEAD, "w-[calc(123*var(--u))] bg-comparison-mochi-head-bg text-white max-tablet:w-[26%]")}>{t("mochi")}</th>
              <th scope="col" className={cn(CELL, HEAD, "w-[calc(147*var(--u))] bg-comparison-typical-head-bg text-ink-navy max-tablet:w-[28%]")}>{t("typical")}</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROW_IDS.map((id, i) => {
              const first = i === 0;
              const last = i === COMPARISON_ROW_IDS.length - 1;
              return (
                <tr key={id}>
                  <th
                    scope="row"
                    className={cn(
                      CELL,
                      ROW_HEAD,
                      first && "[border-top:calc(1*var(--u))_solid_var(--color-comparison-row-header-border)] rounded-tl-[calc(8*var(--u))] max-tablet:rounded-tl-[10px]",
                      last && "[border-bottom:calc(1*var(--u))_solid_var(--color-comparison-row-header-border)] rounded-bl-[calc(8*var(--u))] max-tablet:rounded-bl-[10px]",
                      !last && ROW_DIVIDER,
                    )}
                  >
                    <RowIcon name={ROW_ICONS[i] ?? "gift"} />{t(`rows.${id}.feature`)}
                  </th>
                  <td
                    className={cn(
                      CELL,
                      CELL_PAD,
                      BODY_CELL,
                      "bg-comparison-mochi-cell-bg font-[900]",
                      last && "[border-bottom:calc(1*var(--u))_solid_var(--color-comparison-mochi-cell-border)]",
                      !last && ROW_DIVIDER,
                    )}
                  >
                    {t(`rows.${id}.mochi`)}
                  </td>
                  <td
                    className={cn(
                      CELL,
                      CELL_PAD,
                      BODY_CELL,
                      "[border-right:calc(1*var(--u))_solid_var(--color-comparison-row-header-border)] bg-comparison-typical-cell-bg font-[650]",
                      last && "[border-bottom:calc(1*var(--u))_solid_var(--color-comparison-row-header-border)] rounded-br-[calc(8*var(--u))] max-tablet:rounded-br-[10px]",
                      !last && ROW_DIVIDER,
                    )}
                  >
                    {t(`rows.${id}.typical`)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </PosterStage>
    </section>
  );
}
