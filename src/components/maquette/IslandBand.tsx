import Image from "next/image";
import { IslandCountdown } from "./IslandCountdown";
import styles from "./IslandBand.module.css";

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 44" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5">
        <path d="M8 4 14 16" /><path d="M20 12 28 22" /><path d="M16 34 32 31" />
      </g>
    </svg>
  );
}

export function StatusIcons({ className = styles.statusIcons }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 14" aria-hidden="true">
      <g fill="currentColor">
        <rect x="0" y="9" width="3" height="4" rx="1" /><rect x="5" y="6.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="4" width="3" height="9" rx="1" /><rect x="15" y="1.5" width="3" height="11.5" rx="1" />
        <path d="M31 13 28.2 10.1a4 4 0 0 1 5.6 0Z" />
        <path d="M24.6 6.6a9 9 0 0 1 12.8 0l-1.8 1.8a6.5 6.5 0 0 0-9.2 0Z" />
        <path d="M21.4 3.4a13.5 13.5 0 0 1 19.2 0l-1.6 1.6a11.2 11.2 0 0 0-16 0Z" />
        <rect x="47" y="2" width="19" height="10" rx="3" />
        <rect x="67.2" y="5" width="1.8" height="4" rx=".9" />
      </g>
    </svg>
  );
}

function Drop() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M12 2.5c-.3 0-.6.2-.8.5C9.6 5.4 5.5 10.9 5.5 14.8a6.5 6.5 0 0 0 13 0c0-3.9-4.1-9.4-5.7-11.8-.2-.3-.5-.5-.8-.5Z" />
    </svg>
  );
}

/** Section 2: the pad change reminder, shown live in a Dynamic Island. */
export function IslandBand() {
  return (
    <section id="features" className={styles.band}>
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h2><span>A pad change</span> <span>reminder in your</span> <span>Dynamic Island</span></h2>
          <p>
            Day pad, overnight pad or liner, 2 to 8 hours. Mochi counts down on Home, in the Dynamic Island
            and on the Lock Screen.
          </p>
        </div>

        <Rays className={`${styles.rays} ${styles.raysLeft}`} />

        <div className={styles.phone} role="img" aria-label="iPhone Dynamic Island showing Mochi and a pad change countdown of 2:17:36">
          <div className={styles.screen}>
            <span className={styles.time}>9:41</span>
            <div className={styles.island} aria-hidden="true">
              <Image className={styles.islandMochi} src="/mochi/island-mochi.webp" alt="" width={220} height={150} />
              <span className={styles.islandText}>
                <small>Pad change in</small>
                <IslandCountdown className={`${styles.timer} tnum`} />
              </span>
              <span className={styles.dropButton}><Drop /></span>
            </div>
            <StatusIcons />
            <i className={`${styles.cloud} ${styles.cloudA}`} />
            <i className={`${styles.cloud} ${styles.cloudB}`} />
          </div>
        </div>

        <Rays className={`${styles.rays} ${styles.raysRight}`} />
      </div>
    </section>
  );
}
