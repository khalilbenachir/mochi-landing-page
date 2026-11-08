import Image from "next/image";
import { COMPARISON_ROWS, FREE_FEATURES, PLUS_FEATURES, PLUS_PRICE } from "@/content/landing";
import styles from "./WhyBand.module.css";

function Rays({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M24 4 28 15" /><path d="M8 13 18 20" /><path d="M5 30 17 29" />
      </g>
    </svg>
  );
}

const ROW_ICONS = ["user", "wifi", "bell", "chart", "gift"] as const;

function RowIcon({ name }: { name: (typeof ROW_ICONS)[number] }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="#1d2b4a">
        {name === "user" && <><circle cx="12" cy="7.5" r="4.5" /><path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5Z" /></>}
        {name === "wifi" && <><path d="M12 20.5 9.4 17.6a3.6 3.6 0 0 1 5.2 0Z" /><path d="M5.8 13.4a8.8 8.8 0 0 1 12.4 0l-1.9 1.9a6.1 6.1 0 0 0-8.6 0Z" /><path d="M2.2 9.8a13.9 13.9 0 0 1 19.6 0l-1.9 1.9a11.2 11.2 0 0 0-15.8 0Z" /></>}
        {name === "bell" && <><path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5v4.2L3.8 16.6h16.4l-1.7-3.4V9A6.5 6.5 0 0 0 12 2.5Z" /><path d="M9.3 18.4a2.8 2.8 0 0 0 5.4 0Z" /></>}
        {name === "chart" && <><rect x="3.5" y="13" width="4" height="8" rx="1" /><rect x="10" y="8.5" width="4" height="12.5" rx="1" /><rect x="16.5" y="4" width="4" height="17" rx="1" /></>}
        {name === "gift" && <><rect x="3" y="8.5" width="18" height="4.5" rx="1" /><rect x="4.5" y="13" width="15" height="8" rx="1" /><path d="M12 8.5c-1.2-3.4-5.2-5.3-6.2-3S9 8.5 12 8.5Zm0 0c1.2-3.4 5.2-5.3 6.2-3S15 8.5 12 8.5Z" /></>}
      </g>
      {name === "gift" && <path d="M12 8.5V21" stroke="#fff" strokeWidth="1.6" />}
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#ef4a7a" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="#ef4a7a" strokeWidth="2.6" strokeLinejoin="round" d="M12 20.2C5.9 16 3 12.6 3 8.9 3 6.2 5.1 4.2 7.6 4.2c1.8 0 3.3.9 4.4 2.4 1.1-1.5 2.6-2.4 4.4-2.4 2.5 0 4.6 2 4.6 4.7 0 3.7-2.9 7.1-9 11.3Z" />
    </svg>
  );
}

/** "Why Mochi?": Mochi against a typical period app. */
export function WhyBand() {
  return (
    <section id="why" className={`${styles.band} ${styles.why}`}>
      <div className={styles.stage}>
        <Rays className={`${styles.rays} ${styles.whyRaysA}`} />
        <h2 className={styles.whyTitle}><span>Why</span> <span>Mochi?</span></h2>
        <Rays className={`${styles.rays} ${styles.whyRaysB}`} flip />
        <div className={styles.matcha} aria-hidden="true">
          <Image src="/mochi/flavor-cards/matcha.webp" alt="" width={380} height={262} sizes="12vw" />
        </div>

        <table className={styles.table}>
          <caption className="visually-hidden">Mochi compared with a typical period app</caption>
          <thead>
            <tr><td /><th scope="col" className={styles.mochiHead}>Mochi</th><th scope="col" className={styles.typicalHead}>Typical period app</th></tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.feature}>
                <th scope="row"><RowIcon name={ROW_ICONS[i] ?? "gift"} />{row.feature}</th>
                <td className={styles.mochiCell}>{row.mochi}</td>
                <td className={styles.typicalCell}>{row.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** "Free to download. Mochi Plus is optional." with the two plan cards. */
export function PlansBand() {
  return (
    <section id="plus" className={`${styles.band} ${styles.plans}`}>
      <div className={styles.stage}>
        <h2 className={styles.plansTitle}><span>Free to download.</span> <span>Mochi Plus</span> <span>is optional.</span></h2>
        <Rays className={`${styles.rays} ${styles.plansRays}`} flip />
        <Heart className={styles.plansHeart} />
        <div className={styles.peek} aria-hidden="true">
          <Image src="/mochi/predict-mochi.webp" alt="" width={368} height={264} sizes="12vw" />
        </div>

        <div className={`${styles.plan} ${styles.free}`}>
          <h3>Mochi — <span className={styles.freePill}>Free</span></h3>
          <ul>{FREE_FEATURES.map((f) => <li key={f.label}><Check />{f.label}</li>)}</ul>
        </div>

        <div className={styles.duo} aria-hidden="true">
          <Rays className={`${styles.rays} ${styles.duoRaysA}`} />
          <Image src="/mochi/flavor-cards/chocolate.webp" alt="" width={380} height={262} sizes="8vw" />
          <Image src="/mochi/flavor-cards/hojicha.webp" alt="" width={380} height={262} sizes="8vw" />
          <Rays className={`${styles.rays} ${styles.duoRaysB}`} flip />
        </div>
        <div className={`${styles.plan} ${styles.plus}`}>
          <h3>Mochi Plus — <span className={styles.pricePill}>{PLUS_PRICE ?? "Optional"}</span></h3>
          <ul>{PLUS_FEATURES.map((f) => <li key={f.label}><Check />{f.label}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
