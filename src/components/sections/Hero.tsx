import { ButtonLink } from "@/components/ui/Button";
import { Icon, Sparkle } from "@/components/ui/Icon";
import { Phone } from "@/components/ui/Phone";
import { APP_STORE_URL } from "@/content/mochi";
import { TodayScreen } from "./TodayScreen";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={`blob ${styles.blobA}`} aria-hidden="true" />
      <div className={`blob ${styles.blobB}`} aria-hidden="true" />

      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.badge}>
            <Icon name="sparkle" size={16} />
            Free for iPhone · No account required
          </p>
          <h1 className={styles.title}>
            Private period tracking
            <br />
            with a <span className={styles.shine}>little friend.</span>
          </h1>
          <p className={styles.lead}>
            Mochi is a free period tracker for iPhone that predicts your next period, reminds you when to change your pad,
            and turns daily check-ins into streaks and collectible flavors. Private by design. Works fully offline.
          </p>
          <div className={styles.actions}>
            <ButtonLink href={APP_STORE_URL}>
              <Icon name="download" />
              Download free
            </ButtonLink>
            <ButtonLink href="#island" variant="ghost">
              See it in action
            </ButtonLink>
          </div>
          <p className={styles.meta}>iPhone · iOS 17+ · Optional Mochi Plus · English, Español, Deutsch, Français</p>
        </div>

        <div className={styles.device}>
          <Phone className="bob">
            <TodayScreen />
          </Phone>
          <Sparkle className={styles.tw} style={{ left: "18%", top: "4%" }} size={26} color="var(--orange)" />
          <Sparkle className={styles.tw} style={{ right: "22%", top: "2%", animationDelay: "-.8s" }} size={18} color="var(--teal)" />
          <Sparkle className={styles.tw} style={{ left: "8%", bottom: "30%", animationDelay: "-1.6s" }} size={20} color="var(--pink)" />
        </div>
      </div>

      <svg className={styles.wave} aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0 40 C 240 90 480 0 720 40 S 1200 90 1440 30 V80 H0Z" fill="#fff" />
      </svg>
    </section>
  );
}
