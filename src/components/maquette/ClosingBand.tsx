import Image from "next/image";
import { APP_STORE_URL, asset } from "@/content/mochi";
import { AppleLogo, FreeSticker } from "./HeroBand";
import styles from "./ClosingBand.module.css";

function Rays({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M10 4 14 15" /><path d="M25 7 21 19" /><path d="M36 21 25 26" />
      </g>
    </svg>
  );
}

function StoreBadge({ className }: { className?: string }) {
  return (
    <a href={APP_STORE_URL} className={`${styles.store} ${className ?? ""}`} aria-label="Download Mochi on the App Store">
      <AppleLogo className={styles.apple} />
      <span><small>Download on the</small><strong>App Store</strong></span>
    </a>
  );
}

/** "Say hi to Mochi" and the site footer, drawn as one poster like the maquette. */
export function ClosingBand() {
  return (
    <>
      <section id="get" className={styles.band}>
        <div className={styles.stage}>
          <div className={styles.copy}>
            <h2>Say hi to Mochi</h2>
            <p><span>Track your cycle, collect cute flavors and have</span> <span>a little friend with you through every phase.</span></p>
          </div>
          <Rays className={`${styles.rays} ${styles.titleRays}`} />
          <div className={styles.cta}>
            <StoreBadge />
            <FreeSticker className={styles.free} />
          </div>
          <Rays className={`${styles.rays} ${styles.mochiRays}`} flip />
          <Image className={styles.mochi} src="/mochi/closing-mochi.webp" alt="Mochi resting on a cushion" width={900} height={648} sizes="(max-width: 1099px) 60vw, 19vw" />
          <svg className={styles.heart} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" d="M12 20.2C5.9 16 3 12.6 3 8.9 3 6.2 5.1 4.2 7.6 4.2c1.8 0 3.3.9 4.4 2.4 1.1-1.5 2.6-2.4 4.4-2.4 2.5 0 4.6 2 4.6 4.7 0 3.7-2.9 7.1-9 11.3Z" />
          </svg>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerStage}>
          <div className={styles.panel}>
            <a href="#top" className={styles.brand} aria-label="Mochi: period tracker, back to top">
              <Image src={asset.appIcon} alt="" width={256} height={256} />
              <i aria-hidden="true" />
              <b>Mochi: period tracker</b>
            </a>
            <StoreBadge className={styles.footerStore} />
          </div>
        </div>
      </footer>
    </>
  );
}
