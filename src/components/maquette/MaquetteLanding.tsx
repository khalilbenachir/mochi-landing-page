import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import styles from "./MaquetteLanding.module.css";
import { HeroBand } from "./HeroBand";
import { IslandBand } from "./IslandBand";
import { MoodBand } from "./MoodBand";
import { FlavorsBand } from "./FlavorsBand";
import { PredictionBand } from "./PredictionBand";
import { PrivacyBand } from "./PrivacyBand";
import { PlansBand, WhyBand } from "./WhyBand";
import { FaqBand } from "./FaqBand";
import { ClosingBand } from "./ClosingBand";

function AccountBand() {
  return (
    <section id="account" className={`${styles.band} ${styles.accountBand}`}>
      <div className={`${styles.inner} ${styles.accountGrid}`}>
        <div className={styles.bandCopy}><p className={styles.kicker}>Optional account</p><h2>Use Mochi now. Back up when you want.</h2><p>Everything works without an account. Create a free account only when you want backup and sync for a new iPhone.</p></div>
        <div className={styles.accountCard}><Icon name="shield" size={32} /><span><b>Cycle backup</b><small>Synced to your account</small></span><i>✓</i></div>
        <Image src="/mochi/account-mochi.webp" alt="Mochi hugging a locked diary" width={435} height={348} />
      </div>
    </section>
  );
}

/** The landing page, band by band, in the maquette's order. */
export function MaquetteLanding() {
  return (
    <main className={styles.posterStack}>
      <HeroBand />
      <IslandBand />
      <MoodBand />
      <FlavorsBand />
      <PredictionBand />
      <PrivacyBand />
      <WhyBand />
      <PlansBand />
      <AccountBand />
      <FaqBand />
      <ClosingBand />
    </main>
  );
}
