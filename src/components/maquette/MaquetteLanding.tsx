import Image from "next/image";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Account");

  return (
    <section id="account" className={`${styles.band} ${styles.accountBand}`}>
      <div className={`${styles.inner} ${styles.accountGrid}`}>
        <div className={styles.bandCopy}><p className={styles.kicker}>{t("kicker")}</p><h2>{t("title")}</h2><p>{t("body")}</p></div>
        <div className={styles.accountCard}><Icon name="shield" size={32} /><span><b>{t("backup")}</b><small>{t("synced")}</small></span><i>✓</i></div>
        <Image src="/mochi/account-mochi.webp" alt={t("imageAlt")} width={435} height={348} />
      </div>
    </section>
  );
}

/** The landing page, band by band, in the maquette's order. */
export function MaquetteLanding() {
  return (
    <main className={`${styles.posterStack} isolate bg-background text-foreground`}>
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
