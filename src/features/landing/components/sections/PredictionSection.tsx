import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { CYCLE_FACT_CLASS, CYCLE_LEGEND_CLASS } from "@/features/landing/content/visual-variants";
import { Heart, Rays, StatusIcons } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
/** March 2025 starts on a Saturday. */
const WEEKS: readonly (readonly (number | null)[])[] = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
];
const PERIOD = new Set([3, 4, 5, 6, 7]);

const CALENDAR_DAY = "grid h-13 place-items-center text-u-[8.6] font-black";
const LEGEND_DOT = "size-6.5 rounded-full";
const FACT_ROW = "flex items-center justify-between h-16 text-u-[8.6] font-black not-first:border-t-[length:calc(1*var(--spacing))] not-first:border-t-prediction-fact-divider";
const FACT_DOT = "size-8 rounded-full";

function CyclePhone() {
  const t = useTranslations("Predictions");

  return (
    <div
      className="relative z-1 -mb-(--section-space) self-end h-220 w-190 p-5 border-[length:calc(2*var(--spacing))] border-prediction-phone-border rounded-t-[calc(28*var(--spacing))] bg-prediction-phone-bg [box-shadow:0_calc(6*var(--spacing))_calc(16*var(--spacing))_var(--color-prediction-phone-shadow)] max-poster:[--spacing:calc(min(44vw,300px)/190)] max-poster:mb-0 max-poster:mt-[28px] max-poster:h-168 max-poster:self-end max-phone:[--spacing:calc((100vw-42px)*0.52/190)]"
      role="img"
      aria-label={t("phoneLabel")}
    >
      <div className="h-full px-12 pt-8 rounded-t-[calc(22*var(--spacing))] bg-white text-ink-navy" aria-hidden="true">
        <div className="flex items-center justify-between px-4"><b className="text-u-7.5 font-black">9:41</b><StatusIcons className="h-auto w-26 text-ink-navy" /></div>
        <p className="mt-3 text-u-11.5 font-max text-center">{t("cycle")}</p>
        <div className="mt-5 flex items-center justify-between px-2"><span className="text-u-14 font-bold leading-none">‹</span><b className="text-u-10 font-max">{t("month")}</b><span className="text-u-14 font-bold leading-none">›</span></div>
        <div className="mt-5 grid grid-cols-7 gap-y-3 text-center">
          {WEEKDAYS.map((day) => <i key={day} className="text-prediction-calendar-label text-u-[5.4] not-italic font-extrabold">{t(`weekdays.${day}`)}</i>)}
          {WEEKS.map((week, w) => week.map((day, i) => {
            if (day === null) return <span key={`${w}-${i}`} className={CALENDAR_DAY} />;
            const inPeriod = PERIOD.has(day);
            return (
              <span
                key={`${w}-${i}`}
                className={cn(
                  CALENDAR_DAY,
                  inPeriod && "bg-cycle-period text-white",
                  inPeriod && day === 3 && "rounded-l-full",
                  inPeriod && day === 7 && "rounded-r-full",
                )}
              >
                {day}
              </span>
            );
          }))}
        </div>
        <div className="mt-9 flex justify-between text-u-6 font-extrabold">
          <span className="flex items-center gap-2.5"><i className={cn(LEGEND_DOT, CYCLE_LEGEND_CLASS.period)} />{t("period")}</span>
          <span className="flex items-center gap-2.5"><i className={cn(LEGEND_DOT, CYCLE_LEGEND_CLASS.fertileWindow)} />{t("fertileWindow")}</span>
          <span className="flex items-center gap-2.5"><i className={cn(LEGEND_DOT, CYCLE_LEGEND_CLASS.ovulation)} />{t("ovulation")}</span>
        </div>
      </div>
    </div>
  );
}

function NextPeriodCard() {
  const t = useTranslations("Predictions");

  return (
    <div className="relative ml-33 h-141 w-177 px-12 pt-8 rounded-u-16 bg-white [box-shadow:0_calc(4*var(--spacing))_calc(14*var(--spacing))_var(--color-prediction-card-shadow)] max-poster:[--spacing:calc(min(44vw,300px)/177)] max-poster:ml-0 max-poster:mt-[28px] max-poster:self-center max-phone:[--spacing:calc((100vw-42px)*0.48/177)]">
      <div className="mx-auto grid size-98 place-items-center rounded-full bg-[conic-gradient(from_-8deg,var(--color-prediction-ring-1)_0deg,var(--color-prediction-ring-2)_60deg,var(--color-prediction-ring-3)_120deg,var(--color-prediction-ring-4)_170deg,var(--color-prediction-ring-5)_215deg,var(--color-prediction-ring-6)_225deg,var(--color-prediction-ring-7)_345deg,var(--color-prediction-ring-8)_360deg)]">
        <div className="grid size-81 place-content-center rounded-full bg-white text-center leading-[1.05]">
          <small className="text-u-[9.6] font-black">{t("nextPeriodIn")}</small>
          <b className="text-u-17.5 font-max">{t("nextPeriodValue")}</b>
        </div>
      </div>
      <dl className="mt-3">
        <div className={FACT_ROW}><dt className="flex items-center gap-4"><i className={cn(FACT_DOT, CYCLE_FACT_CLASS.cycleLength)} />{t("cycleLength")}</dt><dd className="">{t("cycleLengthValue")}</dd></div>
        <div className={FACT_ROW}><dt className="flex items-center gap-4"><i className={cn(FACT_DOT, CYCLE_FACT_CLASS.nextPeriod)} />{t("nextPeriod")}</dt><dd className="">{t("nextPeriodDate")}</dd></div>
      </dl>
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
        <NextPeriodCard />
        <div className="relative ml-14 mb-6 self-center w-150 after:absolute after:left-[-6%] after:right-[-6%] after:-bottom-6 after:h-14 after:rounded-[50%] after:bg-prediction-mascot-bg after:opacity-85 max-poster:hidden">
          <Heart className="absolute z-2 text-cycle-next-period -right-4 -top-28 w-26 -rotate-12" />
          <Heart className="absolute z-2 text-cycle-next-period -right-24 -top-2 w-20 rotate-14" />
          <Image className="relative z-1 h-auto w-full" src={LANDING_ASSETS.predictionMochi} alt={t("mascotAlt")} width={368} height={264} sizes="(max-width: 1099px) 40vw, 15vw" />
        </div>
      </PosterStage>
    </section>
  );
}
