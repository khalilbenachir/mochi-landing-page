import Image from "next/image";
import { Icon, Sparkle, type IconName } from "@/components/ui/Icon";
import { asset } from "@/content/mochi";
import styles from "./Privacy.module.css";

const CHIPS: { icon: IconName; label: string; tint: string; ink: string; className: string }[] = [
  { icon: "phone", label: "Stays on your iPhone", tint: "var(--pink-tint)", ink: "var(--pink-ink)", className: styles.chipA! },
  { icon: "wifiOff", label: "Works offline", tint: "var(--teal-tint)", ink: "var(--teal-ink)", className: styles.chipB! },
  { icon: "user", label: "No account needed", tint: "var(--indigo-tint)", ink: "var(--indigo)", className: styles.chipC! },
  { icon: "shield", label: "Backup only if you want", tint: "var(--mint)", ink: "var(--mint-ink)", className: styles.chipD! },
];

/** What never leaves the phone: the app never sends cycle data to analytics, logs or crash reports. */
const KEPT = ["Period dates and predictions", "Flow, symptoms and moods", "Sex, tests and pregnancy", "Pad change reminders, never synced"];

/** All `AnalyticsEvent` cases carry: screen names, step names and counts. */
const COUNTED = ["Which screen you opened", "Which setup step you're on", "Simple counts, like “a log was saved”"];

const FACTS = ["Every feature works signed out", "Backup is optional and locked to you", "Hosted in the EU"];

export function Privacy() {
  return (
    <section id="privacy" className={styles.section}>
      <Sparkle className={styles.tw} style={{ left: "8%", top: 120 }} size={28} color="#fff" />
      <Sparkle className={styles.tw} style={{ right: "10%", top: 200, animationDelay: "-1s" }} size={20} color="#fff" />

      <div className="wrap">
        <div className={`reveal ${styles.head}`}>
          <p className="eyebrow" style={{ color: "var(--teal-text)" }}>
            Private by design
          </p>
          <h2 className={`h2 ${styles.title}`}>
            Only <span className={styles.underline}>you</span> will see this.
          </h2>
          <p className={styles.sub}>Your cycle is your diary. Mochi keeps it locked on your iPhone and never peeks.</p>
        </div>

        <div className={`reveal ${styles.stage}`}>
          <Image
            src={asset.face.privacy}
            alt="Mochi hugging a locked diary inside a protective bubble"
            width={620}
            height={465}
            className={styles.bubble}
          />
          {CHIPS.map((c) => (
            <span key={c.label} className={`${styles.chip} ${c.className}`}>
              <i style={{ background: c.tint, color: c.ink }}>
                <Icon name={c.icon} size={18} />
              </i>
              {c.label}
            </span>
          ))}
        </div>

        <div className={styles.cards}>
          <div className={`reveal ${styles.card} ${styles.keep}`}>
            <div className={styles.cardHead}>
              <span style={{ background: "var(--pink-tint)", color: "var(--pink-ink)" }}>
                <Icon name="lock" size={24} />
              </span>
              <div>
                <p>Stays with you</p>
                <p>On your iPhone, in Mochi only</p>
              </div>
            </div>
            <ul className={styles.list}>
              {KEPT.map((item) => (
                <li key={item}>
                  <svg className={styles.check} width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                    <circle cx="13" cy="13" r="13" fill="var(--pink-ink)" />
                    <path d="M7.5 13.5l3.5 3.5 7-7.5" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={`reveal ${styles.card} ${styles.count}`}>
            <div className={styles.cardHead}>
              <span style={{ background: "#fff", color: "var(--teal-ink)" }}>
                <Icon name="chart" size={24} />
              </span>
              <div>
                <p>All Mochi ever counts</p>
                <p>To make the app better, nothing more</p>
              </div>
            </div>
            <ol className={styles.list}>
              {COUNTED.map((item, i) => (
                <li key={item}>
                  <span className={styles.num}>{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
            <p className={styles.never}>Never a date. Never your cycle.</p>
          </div>
        </div>

        <ul className={`reveal ${styles.facts}`}>
          {FACTS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
