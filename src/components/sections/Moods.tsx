import { MochiClip } from "@/components/ui/MochiClip";
import { MOODS } from "@/content/mochi";
import styles from "./Moods.module.css";

export function Moods() {
  return (
    <section id="moods" className={styles.section}>
      <div className="wrap">
        <div className="reveal" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ color: "var(--orange-ink)" }}>
            Tap Mochi to log how you feel
          </p>
          <h2 className="h2">Mochi feels it with you.</h2>
        </div>
        <ul className={styles.grid}>
          {MOODS.map((m) => (
            <li key={m.clip} className={`reveal-pop ${styles.card}`} style={{ background: m.tint }}>
              <div className={styles.frame}>
                <MochiClip name={m.clip} label={`${m.name} Mochi`} className={styles.clip} />
              </div>
              <p className={styles.name}>{m.name}</p>
              <p className={styles.line}>&ldquo;{m.line}&rdquo;</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
