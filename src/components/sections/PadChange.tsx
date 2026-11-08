"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useChangeReminder } from "@/features/change-reminder/ChangeReminderProvider";
import { asset } from "@/content/mochi";
import { MAX_HOURS, PAD_OPTIONS, padOption } from "@/lib/change-timer";
import styles from "./PadChange.module.css";

const POINTS: { icon: IconName; tint: string; ink: string; text: string }[] = [
  { icon: "timer", tint: "var(--pink-tint)", ink: "var(--pink-ink)", text: "Day pad, overnight pad or liner, 2 to 8 hours" },
  { icon: "moon", tint: "var(--teal-tint)", ink: "var(--teal-ink)", text: "Overnight reminders arrive quietly, without a sound" },
  { icon: "lock", tint: "var(--indigo-tint)", ink: "var(--indigo)", text: "Stays on your iPhone. Never synced, never tracked" },
];

const HOURS = Array.from({ length: MAX_HOURS - 1 }, (_, i) => i + 2);

export function PadChange() {
  const { state, pickPad, pickHours, start } = useChangeReminder();
  const current = padOption(state.pad);

  return (
    <section id="change" className={styles.section}>
      <div className={`wrap ${styles.grid}`}>
        <div className={`reveal ${styles.copy}`}>
          <p className="eyebrow" style={{ color: "var(--pink-ink)" }}>
            Pad change reminder
          </p>
          <h2 className="h2">
            Mochi tells you
            <br />
            when to change.
          </h2>
          <p className="lead">
            Pick what you&apos;re wearing and how long. The timer lives on Home, in the Dynamic Island and on the Lock
            Screen. One tap on <b style={{ color: "var(--navy-deep)" }}>Changed</b> starts it again, right from the Lock
            Screen.
          </p>
          <ul className={styles.points}>
            {POINTS.map((p) => (
              <li key={p.icon}>
                <span className={styles.pointIcon} style={{ background: p.tint, color: p.ink }}>
                  <Icon name={p.icon} size={22} />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <div className={`reveal ${styles.sheetWrap}`}>
          <div className={styles.sheet}>
            <div className={styles.sheetHead}>
              <Image src={asset.face.wondering} alt="" width={84} height={67} className="jelly" />
              <div>
                <p className={styles.sheetTitle}>Pad change reminder</p>
                <p className={styles.sheetSub}>Lock Screen shows only Mochi and the time.</p>
              </div>
            </div>

            <fieldset className={styles.group}>
              <legend className={styles.label}>What are you wearing?</legend>
              <div className={styles.chips}>
                {PAD_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.chip} ${p.id === state.pad ? styles.chipOn : ""}`}
                    aria-pressed={p.id === state.pad}
                    onClick={() => pickPad(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className={styles.hint}>{current.hint}</p>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.label}>Remind me after</legend>
              <div className={styles.hours}>
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`${styles.hour} ${h === state.hours ? styles.hourOn : ""}`}
                    aria-pressed={h === state.hours}
                    aria-label={`${h} hours`}
                    disabled={h < current.minHours}
                    onClick={() => pickHours(h)}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </fieldset>

            <p className={styles.tip}>
              <Icon name="info" size={20} />
              Change at least every 4 to 8 hours.
            </p>
            <Button block onClick={start} className={styles.start}>
              Remind me in {state.hours} hours
            </Button>
            <p className={styles.try}>Try it: the phone and the Dynamic Island follow your choice.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
