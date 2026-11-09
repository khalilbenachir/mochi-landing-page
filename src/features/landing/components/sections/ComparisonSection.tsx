import Image from "next/image";
import { useTranslations } from "next-intl";
import { FLAVOR_CARD_ASSETS } from "@/features/landing/content/assets";
import { COMPARISON_ROW_IDS } from "@/features/landing/content/landing";
import { Rays } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

type RowIconName = "user" | "wifi" | "bell" | "chart" | "gift";

const ROW_ICONS = {
  account: "user",
  offline: "wifi",
  reminder: "bell",
  analytics: "chart",
  rewards: "gift",
} as const satisfies Record<(typeof COMPARISON_ROW_IDS)[number], RowIconName>;

function RowIcon({ name }: { name: RowIconName }) {
  return (
    <svg className="size-14 flex-none max-tablet:size-[15px]" viewBox="0 0 24 24" aria-hidden="true">
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
const CELL = "h-[calc(23.4*var(--spacing))] text-center max-tablet:h-auto";
const CELL_PAD = "max-tablet:px-[6px] max-tablet:py-[10px]";
const HEAD = "h-26 text-u-[12.6] font-max rounded-t-[calc(9*var(--spacing))] max-tablet:h-[40px] max-tablet:p-[6px] max-tablet:text-[13px] max-tablet:leading-[1.15] max-tablet:rounded-t-[10px]";
const ROW_HEAD = "flex items-center gap-10 pl-15 border-l-[length:calc(1*var(--spacing))] border-l-comparison-row-header-border font-extrabold text-left whitespace-nowrap max-tablet:gap-[8px] max-tablet:pl-[10px] max-tablet:pr-[6px] max-tablet:py-[10px] max-tablet:whitespace-normal max-tablet:leading-[1.2]";
const ROW_DIVIDER = "[box-shadow:inset_0_calc(-1*var(--spacing))_0_var(--color-comparison-row-divider)]";
const BODY_CELL = "text-u-11 max-tablet:text-[13px] max-tablet:leading-[1.2]";

/** "Why Mochi?": Mochi against a typical period app. */
export function ComparisonSection() {
  const t = useTranslations("Comparison");

  return (
    <section id="why" className="relative overflow-hidden bg-white text-ink-navy">
      <PosterStage grid="800" className="grid grid-cols-[calc(270*var(--spacing))_calc(504*var(--spacing))] max-poster:block max-poster:px-[clamp(16px,4vw,40px)]">
        <Rays shape="burst" className={cn(RAYS, "left-40 top-43 w-36")} />
        <h2 className="relative z-2 ml-88 self-center text-u-35 font-max leading-[1.12] tracking-[-0.02em] max-poster:ml-0 max-poster:text-center max-poster:text-[clamp(36px,6.4vw,50px)] max-phone:text-[34px]">
          <span className="relative block w-fit max-poster:inline max-poster:whitespace-normal">
            {t("title1")}
            {/* Sits 41u past "Why"; longer words (Pourquoi) push it along, keeping a 12u gap. */}
            <Rays shape="burst" className={cn(RAYS, "left-[max(calc(100%+12*var(--spacing)),calc(116*var(--spacing)))] top-[calc(20.71*var(--spacing))] w-28")} flip />
          </span> <span className="ml-17 block max-poster:ml-0 max-poster:inline max-poster:whitespace-normal">{t("title2")}</span>
        </h2>
        <div className="absolute z-1 left-12 top-112 w-100 after:absolute after:left-[-12%] after:right-[-14%] after:-bottom-5 after:h-12 after:rounded-[50%] after:bg-comparison-matcha-bg max-poster:hidden" aria-hidden="true">
          <Image className="relative z-1 h-auto w-full" src={FLAVOR_CARD_ASSETS.matcha} alt="" width={380} height={262} sizes="12vw" />
        </div>

        <table className="relative w-504 border-separate border-spacing-0 text-u-[10.6] max-poster:[--spacing:calc(min(100vw-32px,720px)/504)] max-poster:mx-auto max-poster:mb-0 max-poster:mt-[22px] max-tablet:[--spacing:1px] max-tablet:w-full max-tablet:text-[13px]">
          <caption className="sr-only">{t("caption")}</caption>
          <thead>
            <tr>
              <td className={cn(CELL, CELL_PAD)} />
              <th scope="col" className={cn(CELL, HEAD, "w-123 bg-comparison-mochi-head-bg text-white max-tablet:w-[26%]")}>{t("mochi")}</th>
              <th scope="col" className={cn(CELL, HEAD, "w-147 bg-comparison-typical-head-bg text-ink-navy max-tablet:w-[28%]")}>{t("typical")}</th>
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
                      first && "border-t-[length:calc(1*var(--spacing))] border-t-comparison-row-header-border rounded-tl-[calc(8*var(--spacing))] max-tablet:rounded-tl-[10px]",
                      last && "border-b-[length:calc(1*var(--spacing))] border-b-comparison-row-header-border rounded-bl-[calc(8*var(--spacing))] max-tablet:rounded-bl-[10px]",
                      !last && ROW_DIVIDER,
                    )}
                  >
                    <RowIcon name={ROW_ICONS[id]} />{t(`rows.${id}.feature`)}
                  </th>
                  <td
                    className={cn(
                      CELL,
                      CELL_PAD,
                      BODY_CELL,
                      "bg-comparison-mochi-cell-bg font-black",
                      last && "border-b-[length:calc(1*var(--spacing))] border-b-comparison-mochi-cell-border",
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
                      "border-r-[length:calc(1*var(--spacing))] border-r-comparison-row-header-border bg-comparison-typical-cell-bg font-demibold",
                      last && "border-b-[length:calc(1*var(--spacing))] border-b-comparison-row-header-border rounded-br-[calc(8*var(--spacing))] max-tablet:rounded-br-[10px]",
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
