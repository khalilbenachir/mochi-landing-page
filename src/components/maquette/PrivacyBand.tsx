import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./PrivacyBand.module.css";

/** One laurel branch: a curved stem with paired leaves, mirrored for the right side. */
const bez = (t: number, a: number, b: number, c: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c;
const LEAVES = Array.from({ length: 7 }, (_, i) => {
  const t = 0.08 + i * 0.135;
  const x = bez(t, 20, -7, 18);
  const y = bez(t, 58, 32, 4);
  const dx = 2 * (1 - t) * (-7 - 20) + 2 * t * (18 + 7);
  const dy = 2 * (1 - t) * (32 - 58) + 2 * t * (4 - 32);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // leaf axis along the stem
  return { x: +x.toFixed(2), y: +y.toFixed(2), angle: Math.round(angle), s: 1 - i * 0.05 };
});

function Laurel({ side }: { side: "left" | "right" }) {
  return (
    <svg className={`${styles.laurel} ${side === "right" ? styles.laurelRight : ""}`} viewBox="0 0 30 60" aria-hidden="true">
      <path d="M20 58Q-7 32 18 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {LEAVES.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.s})`}>
          <ellipse cx="-5" cy="-1.8" rx="5.4" ry="2.5" transform="rotate(-38 -5 -1.8)" fill="currentColor" />
          <ellipse cx="4.4" cy="-2" rx="4.6" ry="2.2" transform="rotate(38 4.4 -2)" fill="currentColor" />
        </g>
      ))}
      <ellipse cx="18.5" cy="3.5" rx="2.3" ry="4.4" transform="rotate(25 18.5 3.5)" fill="currentColor" />
    </svg>
  );
}

function Badge({ lines }: { lines: readonly string[] }) {
  return (
    <div className={styles.badge}>
      <Laurel side="left" />
      <p>{lines.map((line, index) => index < 2 ? <b key={line}>{line}</b> : line ? <span key={line}>{line}</span> : null)}</p>
      <Laurel side="right" />
    </div>
  );
}

function PromiseIcon({ name }: { name: "lock" | "offline" | "cloud" }) {
  return (
    <span className={styles.iconDisc} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <g fill="none" stroke="#1d2b4a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {name === "lock" && <><rect x="5" y="10.5" width="14" height="10" rx="2.2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><path d="M12 14.5v2.5" /></>}
          {name === "offline" && <><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 15.8a5 5 0 0 1 6.8 0" /><circle cx="12" cy="19" r="1" fill="#1d2b4a" /><path d="M4 3.5 20 20.5" /></>}
        </g>
        {name === "cloud" && <path fill="#1d2b4a" d="M7.5 19h10a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.6 9.1 5 5 0 0 0 7.5 19Z" />}
      </svg>
    </span>
  );
}

const PROMISES = [
  { id: "private", icon: "lock", strong: true },
  { id: "offline", icon: "offline", strong: false },
  { id: "account", icon: "cloud", strong: false },
] as const;

const STAYS = [["dates"], ["logs"], ["reminders1", "reminders2"]] as const;

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M12 4 17 15" /><path d="M27 8 24 19" /><path d="M36 22 26 25" />
      </g>
    </svg>
  );
}

/** Section 6: what stays on the phone, in the app's own privacy wording. */
export function PrivacyBand() {
  const t = useTranslations("Privacy");

  return (
    <section id="privacy" className={styles.band}>
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h2><span>{t("title1")}</span> <span>{t("title2")}</span></h2>
          <p><span>{t("body1")}</span> <span>{t("body2")}</span></p>
        </div>

        <div className={styles.mascot} aria-hidden="true">
          <Image src="/mochi/predict-mochi.webp" alt="" width={368} height={264} sizes="12vw" />
          <svg className={styles.hug} viewBox="0 0 24 24"><path fill="#f2558a" d="M12 21.2C5.4 16.6 2 13 2 8.8 2 5.7 4.4 3.4 7.3 3.4c2 0 3.6 1 4.7 2.6 1.1-1.6 2.7-2.6 4.7-2.6 2.9 0 5.3 2.3 5.3 5.4 0 4.2-3.4 7.8-10 12.4Z" /><path fill="#ff8db3" d="M6.5 6.4c1.2-.8 2.6-.4 3.1.4-.9.1-1.9.6-2.6 1.6-.5-.5-.8-1.3-.5-2Z" /></svg>
          <Rays className={styles.rays} />
        </div>

        <ul className={styles.promises}>
          {PROMISES.map((item) => (
            <li key={item.id}>
              <PromiseIcon name={item.icon} />
              <b>{t(`promises.${item.id}.title`)}</b>
              <span className={item.strong ? styles.strongLine : undefined}>{t(`promises.${item.id}.line1`)}<br />{t(`promises.${item.id}.line2`)}</span>
              <Badge lines={[t(`promises.${item.id}.badge1`), t(`promises.${item.id}.badge2`), t(`promises.${item.id}.badge3`)]} />
            </li>
          ))}
        </ul>

        <div className={styles.card}>
          <h3>{t("staysTitle")}</h3>
          <ul>
            {STAYS.map((line) => (
              <li key={line[0]}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#ef4a7a" /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span>{line.map((part) => <span key={part}>{t(`stays.${part}`)}</span>)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
