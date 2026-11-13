import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { CYCLE_PHASE_CLASS, CYCLE_PHASE_IDS, type CyclePhaseId } from "@/features/landing/content/visual-variants";
import { Rays, StatusIcons } from "@/features/landing/components/shared/decor";
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

/** Cycle day → phase for the 28 segments of the "Your cycle" bar (day 1 = Jun 2). */
function phaseOf(cycleDay: number): CyclePhaseId {
  if (cycleDay <= 5) return "period";
  if (cycleDay <= 9) return "follicular";
  if (cycleDay <= 14) return "fertile";
  if (cycleDay === 15) return "ovulation";
  return "luteal";
}
const CYCLE_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const CYCLE_TODAY = TODAY - 1;

const MUTED = "text-prediction-calendar-label";
const LEGEND_SWATCH = "size-6 shrink-0 rounded-full";

/** A phone showing the app's Calendar screen for June. */
function CyclePhone() {
  const t = useTranslations("Predictions");

  return (
    <div
      className="relative z-1 -mb-(--section-space) self-end h-220 w-190 p-5 border-[length:calc(2*var(--spacing))] border-prediction-phone-border rounded-t-[calc(28*var(--spacing))] bg-prediction-phone-bg [box-shadow:0_calc(6*var(--spacing))_calc(16*var(--spacing))_var(--color-prediction-phone-shadow)] max-poster:[--spacing:calc(min(44vw,300px)/190)] max-poster:mb-0 max-poster:mt-[28px] max-poster:h-200 max-poster:self-end max-phone:[--spacing:calc((100vw-42px)*0.52/190)]"
      role="img"
      aria-label={t("phoneLabel")}
    >
      <div className="h-full px-10 pt-8 rounded-t-[calc(22*var(--spacing))] bg-white text-ink-navy" aria-hidden="true">
        <div className="flex items-center justify-between px-4"><b className="text-u-7.5 font-black">9:41</b><StatusIcons className="h-auto w-26 text-ink-navy" /></div>
        <div className="mt-5 flex items-baseline justify-between px-2">
          <b className="text-u-12 font-max">{t("calendar")}</b>
          <span className="text-u-[7.4] font-black text-cycle-period-ink">{t("today")}</span>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-full bg-cycle-tile text-u-10 font-black leading-none">‹</span>
          <b className="text-u-[9.6] font-max">{t("month")}</b>
          <span className="grid size-12 place-items-center rounded-full bg-cycle-tile text-u-10 font-black leading-none">›</span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
          {WEEKDAYS.map((day) => <i key={day} className={cn(MUTED, "text-u-[5.4] not-italic font-extrabold")}>{t(`weekdays.${day}`)}</i>)}
          {Array.from({ length: MONTH_DAYS }, (_, i) => i + 1).map((day) => {
            const kind = dayKind(day);
            return (
              <span key={day} className="grid h-17 place-items-center">
                <span className={cn("grid size-14 place-items-center rounded-full text-u-[7.6] font-black", day === TODAY && "font-max", DAY_CLASS[kind])}>{day}</span>
              </span>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-u-[6] font-extrabold">
          <span className="flex items-center gap-2"><i className={cn(LEGEND_SWATCH, "bg-cycle-period")} />{t("period")}</span>
          <span className="flex items-center gap-2"><i className={cn(LEGEND_SWATCH, "border-[length:calc(0.8*var(--spacing))] border-dashed border-cycle-period")} />{t("predicted")}</span>
          <span className="flex items-center gap-2"><i className={cn(LEGEND_SWATCH, "bg-cycle-fertile-tint")} />{t("fertile")}</span>
          <span className="flex items-center gap-2"><i className={cn(LEGEND_SWATCH, "border-[length:calc(0.8*var(--spacing))] border-cycle-ovulation")} />{t("ovulation")}</span>
        </div>
      </div>
    </div>
  );
}

/** The app's "Your cycle" card: phase chip, day count, 28-day phase bar, legend and stats. */
function CycleCard() {
  const t = useTranslations("Predictions");

  return (
    <div
      className="relative ml-24 w-184 p-11 rounded-u-18 bg-white text-ink-navy [box-shadow:0_calc(4*var(--spacing))_calc(14*var(--spacing))_var(--color-prediction-card-shadow)] max-poster:[--spacing:calc(min(44vw,300px)/184)] max-poster:ml-0 max-poster:mt-[28px] max-poster:self-center max-phone:[--spacing:calc((100vw-42px)*0.48/184)]"
      role="img"
      aria-label={t("cardLabel")}
    >
      <div aria-hidden="true">
        <div className="flex items-center justify-between">
          <b className="text-u-12 font-max">{t("yourCycle")}</b>
          <span className="rounded-full bg-cycle-tile px-6 py-3 text-u-[6.6] font-black">{t("luteal")}</span>
        </div>
        <p className={cn(MUTED, "mt-1 text-u-[7.6] font-bold")}>{t("cycleDayValue")}</p>
        <div className="mt-7 flex h-19 items-center gap-[calc(1*var(--spacing))]">
          {CYCLE_DAYS.map((day) => (
            <i
              key={day}
              className={cn(
                "flex-1 rounded-[calc(1.6*var(--spacing))]",
                CYCLE_PHASE_CLASS[phaseOf(day)],
                day === CYCLE_TODAY ? "h-19 border-[length:calc(1*var(--spacing))] border-ink-navy" : "h-12",
              )}
            />
          ))}
        </div>
        <div className={cn(MUTED, "mt-3 flex justify-between text-u-[6.4] font-black")}><span>{t("cycleStartDate")}</span><span>{t("nextPeriodDate")}</span></div>
        <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-3 text-u-[6] font-extrabold">
          {CYCLE_PHASE_IDS.map((phase) => (
            <span key={phase} className="flex items-center gap-2"><i className={cn(LEGEND_SWATCH, CYCLE_PHASE_CLASS[phase])} />{t(phase)}</span>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5">
          <div className="rounded-u-11 bg-cycle-tile px-7 py-6"><b className="block text-u-[10.4] font-max leading-none">{t("nextPeriodDate")}</b><small className={cn(MUTED, "mt-2 block text-u-[6.4] font-black")}>{t("nextPeriod")}</small></div>
          <div className="rounded-u-11 bg-cycle-tile px-7 py-6"><b className="block text-u-[10.4] font-max leading-none">{t("cycleLengthValue")}</b><small className={cn(MUTED, "mt-2 block text-u-[6.4] font-black")}>{t("avgCycle")}</small></div>
        </div>
      </div>
    </div>
  );
}

/** Section 5: cycle predictions, with the honest "not birth control" line from the app. */
export function PredictionSection() {
  const t = useTranslations("Predictions");

  return (
    <section id="predictions" className="relative overflow-hidden bg-prediction-band text-ink-navy">
      <PosterStage bleed="bottom" className="grid items-center justify-start pl-51 grid-cols-[calc(363*var(--spacing))_auto_auto_auto] max-poster:grid-cols-[auto_auto] max-poster:justify-center max-poster:gap-x-[20px] max-poster:px-[clamp(16px,4vw,40px)] max-phone:gap-x-[10px]">
        <div className="relative z-2 pr-16 max-poster:pr-0 max-poster:col-span-full max-poster:max-w-[640px] max-poster:mx-auto max-poster:text-center">
          <h2 className="poster:text-balance max-w-315 text-ink-navy text-u-29.5 max-poster:max-w-none font-max leading-[0.96] tracking-[-0.015em] max-poster:text-[clamp(34px,6vw,50px)] max-phone:text-[31px]">
            <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span> <span className="block max-poster:inline">{t("title3")}</span>
          </h2>
          <p className="poster:text-balance mt-7 text-prediction-body-text text-u-[13.4] font-demibold leading-[1.22] max-poster:w-auto max-poster:max-w-[480px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">
            <span className="block max-poster:inline">{t("body1")}</span> <span className="block max-poster:inline">{t("body2")}</span>
          </p>
          <small className="mt-7 block text-prediction-note-text text-u-[11.6] italic font-semibold max-poster:text-[14px]">{t("disclaimer")}</small>
        </div>
        <Rays shape="prediction" className="absolute left-372 top-[calc(var(--section-space)-24*var(--spacing))] w-40 text-sun max-poster:hidden" />
        <CyclePhone />
        <CycleCard />
        <div className="relative ml-10 self-center w-200 max-poster:hidden">
          <Image className="h-auto w-full" src={LANDING_ASSETS.predictionMochi} alt={t("mascotAlt")} width={900} height={635} sizes="(max-width: 1099px) 40vw, 20vw" />
        </div>
      </PosterStage>
    </section>
  );
}
