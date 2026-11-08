"use client";

import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useChangeReminder } from "@/features/change-reminder/ChangeReminderProvider";
import { PadChangeCard } from "@/features/change-reminder/PadChangeCard";
import { CARD_STATES, type CardState } from "@/lib/change-timer";
import styles from "./PadChange.module.css";

const POINTS: { icon: IconName; tint: string; ink: string; text: string }[] = [
  { icon: "timer", tint: "var(--pink-tint)", ink: "var(--pink-ink)", text: "Day pad, overnight pad or liner, 2 to 8 hours" },
  { icon: "moon", tint: "var(--teal-tint)", ink: "var(--teal-ink)", text: "Overnight reminders arrive quietly, without a sound" },
  { icon: "lock", tint: "var(--indigo-tint)", ink: "var(--indigo)", text: "Stays on your iPhone. Never synced, never tracked" },
];

const STATE_INFO: Record<CardState, { label: string; caption: string }> = {
  idle: { label: "Idle", caption: "On period days, Mochi offers the reminder right on Home. One tap starts it." },
  running: { label: "Running", caption: "The countdown, when the next change is due, and how far along you are." },
  due: { label: "Due", caption: "Time to change. Tap Changed when you’re done, or ask for 15 more minutes." },
  snoozed: { label: "Snoozed", caption: "Mochi checks back in 15 minutes. Changed or Stop is always one tap away." },
  overdue: { label: "Overdue", caption: "The card darkens and Mochi looks worried, so it’s hard to miss." },
  fresh: { label: "Just changed", caption: "All fresh. The next reminder is set, with Undo in case you tapped by mistake." },
};

const TOUR_STEP_MS = 4000;

export function PadChange() {
  const { state, show } = useChangeReminder();
  const [touring, setTouring] = useState(true);

  // Walk through all six states until the visitor taps something on the card or a chip.
  useEffect(() => {
    if (!touring || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const next = CARD_STATES[(CARD_STATES.indexOf(state.card) + 1) % CARD_STATES.length];
      if (next) show(next);
    }, TOUR_STEP_MS);
    return () => window.clearInterval(id);
  }, [touring, state.card, show]);

  const pick = (card: CardState) => {
    setTouring(false);
    show(card);
  };

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

        <div className={`reveal ${styles.demoWrap}`}>
          <div className={styles.demo}>
            {/* Any tap on the card stops the tour, so the visitor stays in control. */}
            <div className={styles.stage} onClickCapture={() => setTouring(false)}>
              <PadChangeCard className={styles.card} />
            </div>

            <div className={styles.states} role="group" aria-label="Card state">
              {CARD_STATES.map((card, i) => (
                <button
                  key={card}
                  type="button"
                  className={`${styles.state} ${state.card === card ? styles.stateOn : ""}`}
                  aria-pressed={state.card === card}
                  onClick={() => pick(card)}
                >
                  {i + 1} · {STATE_INFO[card].label}
                </button>
              ))}
            </div>
            <p className={styles.caption}>{STATE_INFO[state.card].caption}</p>
            <button type="button" className={styles.state} onClick={() => setTouring((t) => !t)}>
              {touring ? "Pause tour" : "Play all states"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
