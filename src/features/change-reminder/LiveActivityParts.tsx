"use client";

import type { CSSProperties } from "react";
import { ChangeFaces } from "@/components/ui/ChangeFaces";
import { Icon } from "@/components/ui/Icon";
import { ISLAND_ACCENT, formatClock } from "@/lib/change-timer";
import { useChangeReminder } from "./ChangeReminderProvider";
import styles from "./LiveActivity.module.css";

/** The accent for the island's black background, from the shared timer. */
export function useIslandAccent(): string {
  return ISLAND_ACCENT[useChangeReminder().phase];
}

/** Mochi's face inside a ring that drains with the time left (ChangeMinimalView / ChangeExpandedRing). */
export function ActivityRing({ size, stroke, face, background = "#000" }: { size: number; stroke: number; face: [number, number]; background?: string }) {
  const { left, face: mood } = useChangeReminder();
  const accent = useIslandAccent();
  const style: CSSProperties = {
    width: size,
    height: size,
    background: `conic-gradient(${accent} ${Math.round(left * 360)}deg, rgba(255,255,255,.14) 0deg)`,
  };
  return (
    <div className={styles.ring} style={style}>
      <div className={styles.ringHole} style={{ width: size - stroke * 2, height: size - stroke * 2, background }}>
        <ChangeFaces face={mood} width={face[0]} height={face[1]} />
      </div>
    </div>
  );
}

/** "Changed at → due at" line with the progress bar (ChangeExpandedTimeline). */
export function ActivityTimeline({ small }: { small?: boolean }) {
  const { state, left } = useChangeReminder();
  const accent = useIslandAccent();
  return (
    <div className={`${styles.timeline} ${small ? styles.small : ""}`}>
      <span className="tnum">{formatClock(state.startedAt)}</span>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${Math.round((1 - left) * 100)}%`, background: accent }} />
      </div>
      <span className="tnum">{formatClock(state.startedAt + Math.round(state.total / 60))}</span>
    </div>
  );
}

/** The one control: "Changed" restarts the timer (MarkChangedIntent). Pulses when it's time. */
export function ChangedCheck({ size = 40 }: { size?: number }) {
  const { phase, markChanged } = useChangeReminder();
  const accent = useIslandAccent();
  return (
    <button
      type="button"
      className={`${styles.check} ${phase === "due" ? styles.due : ""}`}
      style={{ width: size, height: size, background: accent }}
      onClick={markChanged}
      aria-label="Mark changed"
    >
      <Icon name="check" size={20} strokeWidth={3.2} />
    </button>
  );
}

const CONFETTI_COLORS = ["#FF8FB1", "#F7B036", "#45B5DA", "#4B47B0", "#CFF3E6", "#FFFFFF", "#F2577C"];
const PIECES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  const distance = 120 + ((i * 37) % 90);
  return {
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    dx: Math.round(Math.cos(angle) * distance * 1.6),
    dy: Math.round(Math.sin(angle) * distance - 40),
    rot: (i * 97) % 540,
    delay: (i % 5) * 0.03,
  };
});

/** A burst of confetti while Mochi celebrates a change. Remounts (and replays) on every "Changed". */
export function Confetti() {
  const { state } = useChangeReminder();
  if (!state.celebrating) return null;
  return (
    <div key={state.startedAt + state.total} className={styles.confetti} aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          style={
            {
              background: p.color,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
              animationDelay: `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
