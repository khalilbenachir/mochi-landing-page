import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { CALCULATOR_SLUG } from "@/features/calculator/content/calculate";
import { localeRoutePath, type AppLocale } from "@/i18n/routing";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { CYCLE_PHASE_CLASS, CYCLE_PHASE_IDS } from "@/features/landing/content/visual-variants";
import { Rays, Sparkle } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
/** June 2025 starts on a Sunday. One 28-day cycle: period Jun 2–6, fertile Jun 11–15, ovulation Jun 16, next period Jun 30. */
const MONTH_DAYS = 30;
const TODAY = 18;
type DayKind = "period" | "fertile" | "ovulation" | "predicted" | "today" | "plain";

function dayKind(day: number): DayKind {
  if (day >= 2 && day <= 6) return "period";
  if (day >= 11 && day <= 15) return "fertile";
  if (day === 16) return "ovulation";
  if (day === 30) return "predicted";
  if (day === TODAY) return "today";
  return "plain";
}

/** The app's CalendarDayCell: filled period, tinted fertile days, ringed ovulation, dashed prediction. */
const DAY_CLASS: Record<DayKind, string> = {
  period: "bg-cycle-period text-white",
  fertile: "bg-cycle-fertile-tint text-cycle-fertile-ink",
  ovulation: "bg-cycle-ovulation-tint text-cycle-ovulation border-[length:calc(1*var(--spacing))] border-cycle-ovulation",
  predicted: "text-cycle-period-ink border-[length:calc(1*var(--spacing))] border-dashed border-cycle-period",
  today: "border-[length:calc(0.8*var(--spacing))] border-cycle-today-ring",
  plain: "",
};

const MUTED = "text-prediction-calendar-label";
const LEGEND_SWATCH = "size-6 shrink-0 rounded-full";

const TILE = "rounded-u-18 [box-shadow:0_calc(4*var(--spacing))_calc(14*var(--spacing))_var(--color-prediction-card-shadow)]";
/** Cycle day 17 of 28 sits at 16.5 × 360/28 ≈ 212° on the wheel. */
const CYCLE_DAY = 17;

/** Tile 1: the app's Calendar screen for June, without the phone frame so it reads at full size. */
function CalendarTile() {
  const t = useTranslations("Predictions");

  return (
    <div className={cn(TILE, "row-span-2 flex flex-col bg-white p-14 text-ink-navy max-poster:row-span-1 max-poster:col-span-2 max-phone:col-span-1")} role="img" aria-label={t("phoneLabel")}>
      <div aria-hidden="true" className="flex flex-1 flex-col">
        <div className="flex items-baseline justify-between">
          <b className="text-u-14 font-max">{t("calendar")}</b>
          <span className="text-u-[8] font-black text-cycle-period-ink">{t("today")}</span>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <span className="grid size-16 place-items-center rounded-full bg-cycle-tile text-u-11 font-black leading-none">‹</span>
          <b className="text-u-[10.4] font-max">{t("month")}</b>
          <span className="grid size-16 place-items-center rounded-full bg-cycle-tile text-u-11 font-black leading-none">›</span>
        </div>
        <div className="mt-8 grid grid-cols-7 gap-y-3 text-center">
          {WEEKDAYS.map((day) => (
            <i key={day} className={cn(MUTED, "text-u-[6.6] not-italic font-extrabold")}>{t(`weekdays.${day}`)}</i>
          ))}
          {Array.from({ length: MONTH_DAYS }, (_, i) => i + 1).map((day) => {
            const kind = dayKind(day);
            return (
              <span key={day} className="grid h-28 place-items-center">
                <span className={cn("grid size-23 place-items-center rounded-full text-u-[9.2] font-black", day === TODAY && "font-max", DAY_CLASS[kind])}>{day}</span>
              </span>
            );
          })}
        </div>
        <div className="mt-auto flex flex-wrap justify-center gap-x-9 gap-y-3 border-t-[length:calc(1*var(--spacing))] border-cycle-tile pt-9 text-u-[7] font-extrabold">
          <span className="flex items-center gap-3"><i className={cn(LEGEND_SWATCH, "bg-cycle-period")} />{t("period")}</span>
          <span className="flex items-center gap-3"><i className={cn(LEGEND_SWATCH, "border-[length:calc(0.8*var(--spacing))] border-dashed border-cycle-period")} />{t("predicted")}</span>
          <span className="flex items-center gap-3"><i className={cn(LEGEND_SWATCH, "bg-cycle-fertile-tint")} />{t("fertile")}</span>
          <span className="flex items-center gap-3"><i className={cn(LEGEND_SWATCH, "border-[length:calc(0.8*var(--spacing))] border-cycle-ovulation")} />{t("ovulation")}</span>
        </div>
      </div>
    </div>
  );
}

/** Tile 2: where you are in the cycle, as a small wheel next to the phase key. */
function CycleTile() {
  const t = useTranslations("Predictions");

  return (
    <div className={cn(TILE, "flex items-center gap-12 bg-white p-14 text-ink-navy")} role="img" aria-label={t("cardLabel")}>
      <div aria-hidden="true" className="relative size-104 flex-none rounded-full">
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(var(--color-cycle-period)_0deg_64.3deg,var(--color-cycle-follicular)_64.3deg_115.7deg,var(--color-cycle-fertile)_115.7deg_180deg,var(--color-cycle-ovulation)_180deg_192.9deg,var(--color-cycle-luteal)_192.9deg_360deg)]" />
        <div className="absolute inset-0 rounded-full bg-[repeating-conic-gradient(transparent_0deg_11deg,var(--color-cycle-wheel-gap)_11deg_12.857deg)]" />
        <div className="absolute inset-16 grid place-content-center rounded-full bg-white text-center leading-none">
          <b className="text-u-[22] font-max">{CYCLE_DAY}</b>
          <small className={cn(MUTED, "mt-1 text-u-[6.6] font-black")}>/ 28</small>
        </div>
        <div className="absolute inset-0 rotate-[212deg]">
          <span className="absolute -top-3 left-1/2 size-13 -translate-x-1/2 rounded-full bg-ink-navy ring-[length:calc(2.5*var(--spacing))] ring-white" />
        </div>
      </div>
      <div aria-hidden="true" className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <b className="text-u-12 font-max">{t("yourCycle")}</b>
          <span className="rounded-full bg-cycle-luteal px-6 py-2 text-u-[6.6] font-black">{t("luteal")}</span>
        </div>
        <p className={cn(MUTED, "mt-1 text-u-[7.4] font-bold")}>{t("cycleDayValue")}</p>
        <ul className="mt-6 grid gap-3 text-u-[7.2] font-extrabold">
          {CYCLE_PHASE_IDS.map((phase) => (
            <li key={phase} className="flex items-center gap-4"><i className={cn(LEGEND_SWATCH, CYCLE_PHASE_CLASS[phase])} />{t(phase)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Tile 3: a night sky where stargazing Mochi has spotted the next period. */
function ForecastTile() {
  const t = useTranslations("Predictions");

  return (
    <div className={cn(TILE, "relative min-h-150 overflow-hidden bg-island-band p-14 text-white")}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Sparkle className="absolute left-[46%] top-12 w-8 animate-twinkle text-sun" />
        <Sparkle className="absolute left-[62%] top-34 w-5 animate-twinkle text-white [animation-delay:-1.2s]" />
        <Sparkle className="absolute left-12 bottom-16 w-6 animate-twinkle text-white [animation-delay:-2s]" />
        <i className="absolute left-[36%] top-24 size-2 rounded-full bg-white/70" />
        <i className="absolute left-[54%] bottom-30 size-2 rounded-full bg-white/50" />
      </div>
      <p className="relative text-u-[7.4] font-black uppercase tracking-[0.1em] text-white/75">{t("nextPeriod")}</p>
      <p className="relative mt-2 text-u-[26] font-max leading-none">{t("nextPeriodDate")}</p>
      <p className="relative mt-8 inline-flex items-center gap-4 rounded-full bg-white/15 px-7 py-3 text-u-[7.4] font-extrabold">
        <b className="font-max">{t("cycleLengthValue")}</b> · {t("avgCycle")}
      </p>
      <Image
        className="absolute -right-6 -bottom-4 h-auto w-150 animate-float"
        src={LANDING_ASSETS.predictionMochi}
        alt={t("mascotAlt")}
        width={900}
        height={635}
        sizes="(max-width: 760px) 60vw, (max-width: 1099px) 30vw, 16vw"
      />
    </div>
  );
}

/** Section 5: cycle predictions as a bento: the calendar, where you are, and Mochi's forecast. */
export function PredictionSection() {
  const t = useTranslations("Predictions");
  const locale = useLocale() as AppLocale;

  return (
    <section id="predictions" className="relative overflow-hidden bg-prediction-band text-ink-navy">
      <PosterStage className="grid grid-cols-[380fr_580fr] items-center gap-x-28 px-51 max-poster:grid-cols-1 max-poster:gap-y-[32px] max-poster:px-[clamp(16px,4vw,40px)]">
        <div className="relative z-2 max-poster:mx-auto max-poster:max-w-[640px] max-poster:text-center">
          <Rays shape="prediction" className="absolute -left-2 -top-34 w-36 -scale-x-100 text-sun max-poster:hidden" />
          <h2 className="poster:text-balance text-ink-navy text-u-29.5 font-max leading-[0.96] tracking-[-0.015em] max-poster:text-[clamp(34px,6vw,50px)] max-phone:text-[31px]">
            <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span> <span className="block max-poster:inline">{t("title3")}</span>
          </h2>
          <p className="poster:text-balance mt-8 text-prediction-body-text text-u-[12.6] font-demibold leading-[1.3] max-poster:mx-auto max-poster:mt-[14px] max-poster:max-w-[480px] max-poster:text-[17px] max-phone:text-[15px]">
            {t("body1")} {t("body2")}
          </p>
          <a
            href={localeRoutePath(locale, CALCULATOR_SLUG)}
            className="group/calc mt-12 inline-flex items-center gap-6 rounded-full bg-ink-navy px-16 py-7 text-u-[11.6] font-heavy text-white [box-shadow:0_calc(3*var(--spacing))_0_var(--color-prediction-phone-shadow)] transition-transform hover:-translate-y-[2px] max-poster:mt-[20px] max-poster:gap-[8px] max-poster:px-[20px] max-poster:py-[12px] max-poster:text-[15px]"
          >
            {t("calculatorLink")}
            <span aria-hidden="true" className="transition-transform group-hover/calc:translate-x-[3px]">→</span>
          </a>
          <small className="mt-10 block max-w-360 border-l-[length:calc(2*var(--spacing))] border-prediction-body-text/25 pl-8 text-prediction-note-text text-u-[10.4] italic font-semibold leading-[1.35] max-poster:mx-auto max-poster:mt-[18px] max-poster:max-w-[460px] max-poster:border-l-0 max-poster:pl-0 max-poster:text-[14px]">
            {t("disclaimer")}
          </small>
        </div>

        {/* Bento. Below the poster breakpoint it rescales its own units so the tiles keep their proportions. */}
        <div className="grid grid-cols-[290fr_276fr] grid-rows-[auto_1fr] gap-12 max-poster:mx-auto max-poster:w-full max-poster:max-w-[680px] max-poster:[--spacing:calc(min(100vw-40px,680px)/580)] max-phone:grid-cols-1 max-phone:[--spacing:calc((100vw-32px)/300)]">
          <CalendarTile />
          <CycleTile />
          <ForecastTile />
        </div>
      </PosterStage>
    </section>
  );
}
