import Image from "next/image";
import { MARQUEE_FLAVORS, asset } from "@/content/mochi";
import styles from "./FlavorMarquee.module.css";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className={styles.row} aria-hidden={hidden || undefined}>
      {MARQUEE_FLAVORS.map((f, i) => (
        <div key={f.id} className={styles.item}>
          <Image src={asset.flavor(f.id)} alt="" width={96} height={77} className="bob" style={{ animationDelay: `${-i * 0.5}s` }} />
          <span style={{ color: f.color }}>{f.name}</span>
        </div>
      ))}
    </div>
  );
}

/** An endless strip of flavors (two identical rows sliding by half their width). Pauses on hover. */
export function FlavorMarquee() {
  return (
    <section aria-label="Mochi flavors" className={styles.section}>
      <div className={styles.track}>
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
