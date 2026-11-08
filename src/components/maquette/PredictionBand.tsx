import Image from "next/image";
import { useTranslations } from "next-intl";
import { StatusIcons } from "./IslandBand";
import styles from "./PredictionBand.module.css";

const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
/** March 2025 starts on a Saturday. */
const WEEKS: readonly (readonly (number | null)[])[] = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
];
const PERIOD = new Set([3, 4, 5, 6, 7]);

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
    <div className={styles.phone} role="img" aria-label={t("phoneLabel")}>
      <div className={styles.screen} aria-hidden="true">
        <div className={styles.status}><b>9:41</b><StatusIcons className={styles.statusIcons} /></div>
        <p className={styles.screenTitle}>{t("cycle")}</p>
        <div className={styles.month}><span>‹</span><b>{t("month")}</b><span>›</span></div>
        <div className={styles.calendar}>
          {WEEKDAYS.map((day) => <i key={day}>{t(`weekdays.${day}`)}</i>)}
          {WEEKS.map((week, w) => week.map((day, i) => {
            if (day === null) return <span key={`${w}-${i}`} />;
            const inPeriod = PERIOD.has(day);
            const cls = inPeriod ? `${styles.period} ${day === 3 ? styles.periodStart : ""} ${day === 7 ? styles.periodEnd : ""}` : "";
            return <span key={`${w}-${i}`} className={cls}>{day}</span>;
          }))}
        </div>
        <div className={styles.legend}>
          <span><i style={{ background: "#ef4a7a" }} />{t("period")}</span>
          <span><i style={{ background: "#fbc6dc" }} />{t("fertileWindow")}</span>
          <span><i style={{ background: "#9b6be6" }} />{t("ovulation")}</span>
        </div>
      </div>
    </div>
  );
}

function NextPeriodCard() {
  const t = useTranslations("Predictions");

  return (
    <div className={styles.card}>
      <div className={styles.ring}>
        <div className={styles.ringHole}>
          <small>{t("nextPeriodIn")}</small>
          <b>{t("nextPeriodValue")}</b>
        </div>
      </div>
      <dl className={styles.facts}>
        <div><dt><i style={{ background: "#9b7bea" }} />{t("cycleLength")}</dt><dd>{t("cycleLengthValue")}</dd></div>
        <div><dt><i style={{ background: "#f2558a" }} />{t("nextPeriod")}</dt><dd>{t("nextPeriodDate")}</dd></div>
      </dl>
    </div>
  );
}

/** Section 5: cycle predictions, with the honest "not birth control" line from the app. */
export function PredictionBand() {
  const t = useTranslations("Predictions");

  return (
    <section id="predictions" className={styles.band}>
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h2><span>{t("title1")}</span> <span>{t("title2")}</span> <span>{t("title3")}</span></h2>
          <p><span>{t("body1")}</span> <span>{t("body2")}</span></p>
          <small>{t("disclaimer")}</small>
        </div>
        <Rays className={styles.rays} />
        <CyclePhone />
        <NextPeriodCard />
        <div className={styles.mascot}>
          <Heart className={`${styles.heart} ${styles.heartA}`} />
          <Heart className={`${styles.heart} ${styles.heartB}`} />
          <Image src="/mochi/predict-mochi.webp" alt={t("mascotAlt")} width={368} height={264} sizes="(max-width: 1099px) 40vw, 15vw" />
        </div>
      </div>
    </section>
  );
}
