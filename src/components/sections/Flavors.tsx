import Image from "next/image";
import { FLAVORS, asset, type UnlockKind } from "@/content/mochi";
import styles from "./Flavors.module.css";

const UNLOCK_COLOR: Record<UnlockKind, string> = {
  starter: "var(--mint-ink)",
  streak: "var(--orange-ink)",
  petals: "var(--pink-ink)",
  challenge: "var(--indigo)",
};

export function Flavors() {
  return (
    <section id="flavors" className={styles.section}>
      <div className="wrap">
        <div className={`reveal ${styles.head}`}>
          <div>
            <p className="eyebrow" style={{ color: "var(--orange-ink)" }}>
              Streaks and rewards
            </p>
            <h2 className="h2">Fill Mochi, keep your streak, collect all 12 flavors.</h2>
          </div>
          <p className={styles.aside}>
            Log a little every day and new Mochi join your collection. Some come from streaks, some from petals, some
            from gentle challenges.
          </p>
        </div>
        <ul className={styles.grid}>
          {FLAVORS.map((f) => (
            <li key={f.id} className={`reveal-pop ${styles.flavor}`}>
              <Image src={asset.flavor(f.id)} alt={`${f.name} Mochi`} width={120} height={96} />
              <b>{f.name}</b>
              <span style={{ color: UNLOCK_COLOR[f.kind] }}>{f.unlock}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
