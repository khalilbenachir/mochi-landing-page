"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChangeFaces } from "@/components/ui/ChangeFaces";
import { Icon } from "@/components/ui/Icon";
import { useChangeReminder } from "@/features/change-reminder/ChangeReminderProvider";
import { ActivityRing, ActivityTimeline, ChangedCheck, Confetti, useIslandAccent } from "@/features/change-reminder/LiveActivityParts";
import { formatCompact, formatCountdown, statusLine, type ChangePhase } from "@/lib/change-timer";
import styles from "./DynamicIsland.module.css";

type IslandView = "minimal" | "compact" | "expanded";

const VIEWS: { id: IslandView; label: string; caption: string }[] = [
  { id: "minimal", label: "Minimal", caption: "Minimal: when another app shares the island, Mochi becomes a tiny ring." },
  { id: "compact", label: "Compact", caption: "Compact: Mochi on the left, time left on the right." },
  { id: "expanded", label: "Expanded", caption: "Expanded: the exact countdown, changed-to-due timeline and the Changed button." },
];

const PHASES: { id: ChangePhase; label: string }[] = [
  { id: "calm", label: "Plenty of time" },
  { id: "soon", label: "Last hour" },
  { id: "due", label: "Time to change" },
];

const GLOW: Record<ChangePhase, string> = {
  calm: "rgba(255,143,177,.22)",
  soon: "rgba(255,184,107,.24)",
  due: "rgba(255,107,107,.28)",
};

const TOUR_STEP_MS = 4000;

export function DynamicIsland() {
  const { state, phase, face, jumpTo, markChanged } = useChangeReminder();
  const accent = useIslandAccent();
  const [view, setView] = useState<IslandView>("compact");
  const [touring, setTouring] = useState(true);

  // A gentle tour through the three sizes until the visitor takes over.
  useEffect(() => {
    if (!touring) return;
    const order: IslandView[] = ["compact", "expanded", "minimal"];
    const id = window.setInterval(() => setView((v) => order[(order.indexOf(v) + 1) % order.length] ?? "compact"), TOUR_STEP_MS);
    return () => window.clearInterval(id);
  }, [touring]);

  // Starting a timer from the sheet above opens the island so the change is visible.
  useEffect(() => {
    if (state.celebrating) {
      setView("expanded");
      setTouring(false);
    }
  }, [state.celebrating]);

  const pickView = (v: IslandView) => {
    setView(v);
    setTouring(false);
  };
  const pickPhase = (p: ChangePhase) => {
    jumpTo(p);
    setTouring(false);
    if (view === "minimal") setView("expanded");
  };

  return (
    <section id="island" className={styles.section}>
      <div className={styles.glow} style={{ background: `radial-gradient(circle, ${GLOW[phase]} 0%, rgba(18,16,20,0) 62%)` }} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <p className="eyebrow reveal" style={{ color: "#FF8FB1" }}>
          Live Activity
        </p>
        <h2 className={`h2 reveal ${styles.title}`}>Mochi lives in your Dynamic Island.</h2>
        <p className={`lead reveal ${styles.lead}`}>
          A ring that drains as time passes. Pink while you&apos;re fine, apricot in the last hour, coral when it&apos;s
          time. Press and hold to see the countdown and tap Changed without opening the app.
        </p>

        <div className={styles.controls}>
          <div className={styles.seg} role="group" aria-label="Dynamic Island size">
            {VIEWS.map((v) => (
              <button key={v.id} type="button" className={view === v.id ? styles.on : undefined} aria-pressed={view === v.id} onClick={() => pickView(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
          <div className={styles.seg} role="group" aria-label="Time left">
            {PHASES.map((p) => (
              <button key={p.id} type="button" className={phase === p.id ? styles.on : undefined} aria-pressed={phase === p.id} onClick={() => pickPhase(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.stageWrap}>
          <div className={styles.stage}>
            <div className={styles.phoneTop}>
              <span className={`tnum ${styles.clock}`}>9:41</span>
              <div className={`${styles.island} ${styles[view]}`} style={{ boxShadow: `0 0 0 1px ${accent}` }} aria-live="polite">
                {view === "minimal" && (
                  <div className={`${styles.in} ${styles.minimalBody}`}>
                    <ActivityRing size={32} stroke={3} face={[20, 14]} />
                  </div>
                )}
                {view === "compact" && (
                  <div className={`${styles.in} ${styles.compactBody}`}>
                    <ChangeFaces face={face} width={32} height={23} />
                    <span className="tnum" style={{ color: accent }}>
                      {formatCompact(state.remaining)}
                    </span>
                  </div>
                )}
                {view === "expanded" && (
                  <div className={`${styles.in} ${styles.expandedBody}`}>
                    <div className={styles.expandedTop}>
                      <ActivityRing size={64} stroke={5} face={[40, 28]} />
                      <div className={styles.expandedTime}>
                        <p className="tnum" style={{ color: accent }}>
                          {formatCountdown(state.remaining)}
                        </p>
                        <p>{statusLine(phase)}</p>
                      </div>
                    </div>
                    <div className={styles.expandedBottom}>
                      <ActivityTimeline />
                      <ChangedCheck />
                    </div>
                  </div>
                )}
              </div>
              <Confetti />
            </div>
          </div>
        </div>

        <p className={styles.caption}>{VIEWS.find((v) => v.id === view)?.caption}</p>
        <div className={styles.actions}>
          <Button variant="island" onClick={markChanged}>
            <Icon name="check" strokeWidth={3} />
            Changed
          </Button>
          <Button variant="dim" onClick={() => setTouring((t) => !t)}>
            {touring ? "Pause tour" : "Play tour"}
          </Button>
        </div>
      </div>
    </section>
  );
}
