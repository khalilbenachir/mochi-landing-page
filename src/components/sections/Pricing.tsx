import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { APP_STORE_URL, asset } from "@/content/mochi";
import styles from "./Pricing.module.css";

const FREE = [
  "Cycle tracking and predictions",
  "Pad change reminder, Dynamic Island and Lock Screen",
  "Moods, streaks and flavors to earn",
  "Works offline, no account",
];

/** Mochi Plus: the starters you didn't pick, extra flavors and insights (Flavor.unlocked, paywall(.insights)). */
const PLUS = ["Everything in Free", "All three starter Mochi, plus extra flavors", "Insights into your cycle"];

/** Set to the real RevenueCat prices once they're decided. */
const PLUS_PRICE = "[YOUR PRICE]";

export function Pricing() {
  return (
    <section id="get" className={styles.section}>
      <div className={`blob ${styles.blobA}`} aria-hidden="true" />
      <div className={`blob ${styles.blobB}`} aria-hidden="true" />

      <div className={`wrap ${styles.grid}`}>
        <div className={`reveal-pop ${styles.mochi}`}>
          <div className={`shadow-squish ${styles.shadow}`} aria-hidden="true" />
          <Image src={asset.face.happy} alt="Happy Mochi saying hi" width={360} height={288} className={`jelly ${styles.mochiImg}`} />
        </div>

        <div className={styles.copy}>
          <h2 className={`h2 reveal ${styles.title}`}>Say hi to Mochi.</h2>
          <p className={`reveal ${styles.lead}`}>Free to download. Mochi Plus unlocks extra flavors and insights.</p>

          <div className={styles.plans}>
            <div className={`reveal ${styles.plan} ${styles.free}`}>
              <p className={styles.kicker} style={{ color: "var(--pink-ink)" }}>
                Mochi
              </p>
              <p className={styles.price}>Free</p>
              <p className={styles.note}>Everything you need, forever</p>
              <ul>
                {FREE.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={20} strokeWidth={3} style={{ color: "var(--pink-ink)" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href={APP_STORE_URL} block>
                <Icon name="download" />
                Download free
              </ButtonLink>
            </div>

            <div className={`reveal ${styles.plan} ${styles.plus}`}>
              <Image src={asset.flavor("hojicha")} alt="" width={92} height={74} className={`bob ${styles.peekA}`} />
              <Image src={asset.flavor("chocolate")} alt="" width={66} height={53} className={`bob ${styles.peekB}`} />
              <p className={styles.kicker} style={{ color: "#ffd58a" }}>
                Mochi Plus
              </p>
              <p className={styles.price}>{PLUS_PRICE}</p>
              <p className={styles.note}>Monthly or yearly</p>
              <ul>
                {PLUS.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={20} strokeWidth={3} style={{ color: "#ffd58a" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <ButtonLink href={APP_STORE_URL} variant="light" block>
                Try Mochi Plus
              </ButtonLink>
            </div>
          </div>
          <p className={styles.meta}>iPhone · iOS 17+ · Cancel Plus anytime in Settings.</p>
        </div>
      </div>
    </section>
  );
}
