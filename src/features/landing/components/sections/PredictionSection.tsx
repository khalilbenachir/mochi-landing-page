import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { CYCLE_FACT_CLASS, CYCLE_LEGEND_CLASS } from "@/features/landing/content/visual-variants";
import { StatusIcons } from "./IslandSection";
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

const CALENDAR_DAY = "grid h-[calc(13*var(--u))] place-items-center text-[calc(8.6*var(--u))] font-[900]";
const LEGEND_DOT = "h-[calc(6.5*var(--u))] w-[calc(6.5*var(--u))] rounded-[50%]";
const FACT_ROW = "flex items-center justify-between h-[calc(16*var(--u))] text-[calc(8.6*var(--u))] font-[900] not-first:[border-top:calc(1*var(--u))_solid_var(--color-prediction-fact-divider)]";
const FACT_DOT = "h-[calc(8*var(--u))] w-[calc(8*var(--u))] rounded-[50%]";

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M26 4 23 15" /><path d="M37 13 28 20" /><path d="M5 27 19 28" />
      </g>
    </svg>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 21.2C5.4 16.6 2 13 2 8.8 2 5.7 4.4 3.4 7.3 3.4c2 0 3.6 1 4.7 2.6 1.1-1.6 2.7-2.6 4.7-2.6 2.9 0 5.3 2.3 5.3 5.4 0 4.2-3.4 7.8-10 12.4Z" />
    </svg>
  );
}

function CyclePhone() {
  const t = useTranslations("Predictions");

  return (
    <div
      className="absolute z-1 left-[calc(414*var(--u))] top-[calc(9*var(--u))] h-[calc(175*var(--u))] w-[calc(190*var(--u))] p-[calc(5*var(--u))] border-solid [border-width:calc(2*var(--u))] border-prediction-phone-border rounded-[calc(28*var(--u))_calc(28*var(--u))_0_0] bg-prediction-phone-bg [box-shadow:0_calc(6*var(--u))_calc(16*var(--u))_var(--color-prediction-phone-shadow)] max-poster:[--u:calc(min(44vw,300px)/190)] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:mt-[28px] max-poster:h-[calc(168*var(--u))] max-poster:self-end max-phone:[--u:calc((100vw-42px)*0.52/190)]"
      role="img"
      aria-label={t("phoneLabel")}
    >
      <div className="h-full px-[calc(12*var(--u))] pb-0 pt-[calc(8*var(--u))] rounded-[calc(22*var(--u))_calc(22*var(--u))_0_0] bg-white text-ink-navy" aria-hidden="true">
        <div className="flex items-center justify-between px-[calc(4*var(--u))]"><b className="text-[calc(7.5*var(--u))] font-[900]">9:41</b><StatusIcons className="h-auto w-[calc(26*var(--u))] text-ink-navy" /></div>
        <p className="mt-[calc(3*var(--u))] mb-0 mx-0 text-[calc(11.5*var(--u))] font-[1000] text-center">{t("cycle")}</p>
        <div className="mt-[calc(5*var(--u))] flex items-center justify-between px-[calc(2*var(--u))]"><span className="text-[calc(14*var(--u))] font-[700] leading-none">‹</span><b className="text-[calc(10*var(--u))] font-[1000]">{t("month")}</b><span className="text-[calc(14*var(--u))] font-[700] leading-none">›</span></div>
        <div className="mt-[calc(5*var(--u))] grid [grid-template-columns:repeat(7,1fr)] gap-y-[calc(3*var(--u))] text-center">
          {WEEKDAYS.map((day) => <i key={day} className="text-prediction-calendar-label text-[calc(5.4*var(--u))] not-italic font-[800]">{t(`weekdays.${day}`)}</i>)}
          {WEEKS.map((week, w) => week.map((day, i) => {
            if (day === null) return <span key={`${w}-${i}`} className={CALENDAR_DAY} />;
            const inPeriod = PERIOD.has(day);
            return (
              <span
                key={`${w}-${i}`}
                className={cn(
                  CALENDAR_DAY,
                  inPeriod && "bg-cycle-period text-white",
                  inPeriod && day === 3 && "rounded-[999px_0_0_999px]",
                  inPeriod && day === 7 && "rounded-[0_999px_999px_0]",
                )}
              >
                {day}
              </span>
            );
          }))}
        </div>
        <div className="mt-[calc(9*var(--u))] flex justify-between text-[calc(6*var(--u))] font-[800]">
          <span className="flex items-center gap-[calc(2.5*var(--u))]"><i className={cn(LEGEND_DOT, CYCLE_LEGEND_CLASS.period)} />{t("period")}</span>
          <span className="flex items-center gap-[calc(2.5*var(--u))]"><i className={cn(LEGEND_DOT, CYCLE_LEGEND_CLASS.fertileWindow)} />{t("fertileWindow")}</span>
          <span className="flex items-center gap-[calc(2.5*var(--u))]"><i className={cn(LEGEND_DOT, CYCLE_LEGEND_CLASS.ovulation)} />{t("ovulation")}</span>
        </div>
      </div>
    </div>
  );
}

function NextPeriodCard() {
  const t = useTranslations("Predictions");

  return (
    <div className="absolute left-[calc(637*var(--u))] top-[calc(13*var(--u))] h-[calc(141*var(--u))] w-[calc(177*var(--u))] px-[calc(12*var(--u))] pb-0 pt-[calc(8*var(--u))] rounded-[calc(16*var(--u))] bg-white [box-shadow:0_calc(4*var(--u))_calc(14*var(--u))_var(--color-prediction-card-shadow)] max-poster:[--u:calc(min(44vw,300px)/177)] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:mt-[28px] max-poster:self-center max-phone:[--u:calc((100vw-42px)*0.48/177)]">
      <div className="mx-auto my-0 grid h-[calc(98*var(--u))] w-[calc(98*var(--u))] place-items-center rounded-[50%] bg-[conic-gradient(from_-8deg,var(--color-prediction-ring-1)_0deg,var(--color-prediction-ring-2)_60deg,var(--color-prediction-ring-3)_120deg,var(--color-prediction-ring-4)_170deg,var(--color-prediction-ring-5)_215deg,var(--color-prediction-ring-6)_225deg,var(--color-prediction-ring-7)_345deg,var(--color-prediction-ring-8)_360deg)]">
        <div className="grid h-[calc(81*var(--u))] w-[calc(81*var(--u))] place-content-center rounded-[50%] bg-white text-center leading-[1.05]">
          <small className="text-[calc(9.6*var(--u))] font-[900]">{t("nextPeriodIn")}</small>
          <b className="text-[calc(17.5*var(--u))] font-[1000]">{t("nextPeriodValue")}</b>
        </div>
      </div>
      <dl className="mt-[calc(3*var(--u))] mb-0 mx-0">
        <div className={FACT_ROW}><dt className="flex items-center gap-[calc(4*var(--u))]"><i className={cn(FACT_DOT, CYCLE_FACT_CLASS.cycleLength)} />{t("cycleLength")}</dt><dd className="m-0">{t("cycleLengthValue")}</dd></div>
        <div className={FACT_ROW}><dt className="flex items-center gap-[calc(4*var(--u))]"><i className={cn(FACT_DOT, CYCLE_FACT_CLASS.nextPeriod)} />{t("nextPeriod")}</dt><dd className="m-0">{t("nextPeriodDate")}</dd></div>
      </dl>
    </div>
  );
}

/** Section 5: cycle predictions, with the honest "not birth control" line from the app. */
export function PredictionSection() {
  const t = useTranslations("Predictions");

  return (
    <section id="predictions" className="relative overflow-hidden bg-prediction-band text-ink-navy">
      <PosterStage className="aspect-[1024/168] max-poster:grid max-poster:[grid-template-columns:auto_auto] max-poster:justify-center max-poster:gap-x-[20px] max-poster:px-[clamp(16px,4vw,40px)] max-poster:pb-0 max-poster:pt-[36px] max-phone:gap-x-[10px] max-phone:pt-[30px]">
        <div className="absolute z-2 left-[calc(51*var(--u))] top-[calc(12*var(--u))] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:[grid-column:1/-1] max-poster:max-w-[640px] max-poster:mx-auto max-poster:text-center">
          <h2 className="m-0 text-ink-navy text-[calc(29.5*var(--u))] font-[1000] leading-[0.96] tracking-[-0.015em] max-poster:text-[clamp(34px,6vw,50px)] max-phone:text-[31px]">
            <span className="block whitespace-nowrap max-poster:inline max-poster:whitespace-normal">{t("title1")}</span> <span className="block whitespace-nowrap max-poster:inline max-poster:whitespace-normal">{t("title2")}</span> <span className="block whitespace-nowrap max-poster:inline max-poster:whitespace-normal">{t("title3")}</span>
          </h2>
          <p className="mt-[calc(7*var(--u))] mb-0 mx-0 text-prediction-body-text text-[calc(13.4*var(--u))] font-[650] leading-[1.22] max-poster:w-auto max-poster:max-w-[480px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">
            <span className="block whitespace-nowrap max-poster:inline max-poster:whitespace-normal">{t("body1")}</span> <span className="block whitespace-nowrap max-poster:inline max-poster:whitespace-normal">{t("body2")}</span>
          </p>
          <small className="mt-[calc(7*var(--u))] block text-prediction-note-text text-[calc(11.6*var(--u))] italic font-[600] max-poster:text-[14px]">{t("disclaimer")}</small>
        </div>
        <Rays className="absolute left-[calc(372*var(--u))] top-[calc(13*var(--u))] w-[calc(34*var(--u))] text-sun max-poster:hidden" />
        <CyclePhone />
        <NextPeriodCard />
        <div className="absolute left-[calc(836*var(--u))] top-[calc(56*var(--u))] w-[calc(130*var(--u))] after:absolute after:left-[-6%] after:right-[-6%] after:bottom-[calc(-6*var(--u))] after:h-[calc(14*var(--u))] after:rounded-[50%] after:bg-prediction-mascot-bg after:content-[''] after:opacity-85 max-poster:hidden">
          <Heart className="absolute z-2 text-cycle-next-period right-[calc(-4*var(--u))] top-[calc(-24*var(--u))] w-[calc(22*var(--u))] [transform:rotate(-12deg)]" />
          <Heart className="absolute z-2 text-cycle-next-period right-[calc(-24*var(--u))] top-[calc(-2*var(--u))] w-[calc(20*var(--u))] [transform:rotate(14deg)]" />
          <Image className="relative z-1 h-auto w-full" src={LANDING_ASSETS.predictMochi} alt={t("mascotAlt")} width={368} height={264} sizes="(max-width: 1099px) 40vw, 15vw" />
        </div>
      </PosterStage>
    </section>
  );
}
