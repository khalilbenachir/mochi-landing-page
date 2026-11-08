"use client";

import Image from "next/image";
import { Phone } from "@/components/ui/Phone";
import { useChangeReminder } from "@/features/change-reminder/ChangeReminderProvider";
import { ActivityRing, ActivityTimeline, ChangedCheck, useIslandAccent } from "@/features/change-reminder/LiveActivityParts";
import { asset } from "@/content/mochi";
import { formatCountdown, statusLine } from "@/lib/change-timer";
import styles from "./LockScreen.module.css";

const CARDS = [
  { title: "Tap Changed", text: "Restarts the timer without opening the app." },
  { title: "No network needed", text: "The countdown runs from the system clock." },
];

export function LockScreen() {
  const { state, phase } = useChangeReminder();
  const accent = useIslandAccent();

  return (
    <section id="lock" className={styles.section}>
      <div className={`wrap ${styles.grid}`}>
        <div className={`reveal ${styles.device}`}>
          <Phone screenStyle={{ background: "linear-gradient(160deg, #4B47B0 0%, #8f6fd6 40%, #F2577C 100%)" }}>
            <div className={`blob ${styles.wallBlob}`} aria-hidden="true" />
            <div className={styles.island} aria-hidden="true" />
            <div className={styles.time}>
              <p>Saturday 7 November</p>
              <p className="tnum">9:41</p>
            </div>

            {/* Discreet: only Mochi, a time and "Time to change". */}
            <div className={styles.notification}>
              <Image src={asset.appIcon} alt="" width={36} height={36} className={styles.notifIcon} />
              <div>
                <p className={styles.notifTop}>
                  Mochi <span>now</span>
                </p>
                <p className={styles.notifBody}>Time to change</p>
              </div>
            </div>

            <div className={styles.activity}>
              <div className={styles.activityTop}>
                <ActivityRing size={54} stroke={4} face={[34, 24]} background="#120f14" />
                <div className={styles.activityTime}>
                  <p className="tnum" style={{ color: accent }}>
                    {formatCountdown(state.remaining)}
                  </p>
                  <p>{statusLine(phase)}</p>
                </div>
                <ChangedCheck size={44} />
              </div>
              <ActivityTimeline small />
            </div>
            <div className={styles.homeIndicator} aria-hidden="true" />
          </Phone>
        </div>

        <div className={`reveal ${styles.copy}`}>
          <p className="eyebrow" style={{ color: "var(--teal-text)" }}>
            Lock Screen
          </p>
          <h2 className="h2">
            Discreet, even
            <br />
            on the Lock Screen.
          </h2>
          <p className="lead" style={{ color: "var(--navy)" }}>
            Anyone glancing at your phone sees Mochi and a time. Nothing else. No product names, no period wording, just
            a friendly &ldquo;Time to change&rdquo;.
          </p>
          <div className={styles.cards}>
            {CARDS.map((c) => (
              <div key={c.title} className={styles.card}>
                <p>{c.title}</p>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
