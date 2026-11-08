import styles from "./Cycle.module.css";

/** The four logo colors map to the four cycle phases (Palette.swift). */
const PHASES = [
  { name: "Period", text: "Log flow, symptoms and mood in a tap.", tint: "var(--pink-tint)", dot: "var(--pink)", ink: "var(--pink-deep)" },
  { name: "Fertile", text: "Your likely fertile days, at a glance.", tint: "var(--teal-tint)", dot: "var(--teal)", ink: "var(--teal-text)" },
  { name: "Ovulation", text: "The estimated peak of your cycle.", tint: "var(--indigo-tint)", dot: "var(--indigo)", ink: "var(--indigo)" },
  { name: "Luteal", text: "The calm before the next period.", tint: "var(--orange-tint)", dot: "var(--orange)", ink: "var(--orange-ink)" },
];

export function Cycle() {
  return (
    <section id="cycle" className={styles.section}>
      <div className={`wrap ${styles.grid}`}>
        <div className={`reveal ${styles.copy}`}>
          <p className="eyebrow" style={{ color: "var(--teal-ink)" }}>
            Your cycle
          </p>
          <h2 className="h2">
            Four colors.
            <br />
            One rhythm.
          </h2>
          <p className="lead">
            Mochi reads your past cycles to show what&apos;s coming: your next period, your fertile window and each phase
            in between.
          </p>
          {/* Medical honesty: predictions are never presented as birth control. */}
          <p className={styles.note}>Predictions are estimates, not birth control.</p>
        </div>
        <ul className={`reveal ${styles.cards}`}>
          {PHASES.map((p, i) => (
            <li key={p.name} className={styles.card} style={{ background: p.tint }}>
              <span className={`bob ${styles.dot}`} style={{ background: p.dot, animationDelay: `${-i * 0.7}s` }} />
              <p className={styles.name} style={{ color: p.ink }}>
                {p.name}
              </p>
              <p className={styles.text}>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
