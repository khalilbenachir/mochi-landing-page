"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import {
  changeReducer,
  faceOf,
  fractionLeft,
  initialChangeState,
  phaseOf,
  type ChangeFace,
  type ChangePhase,
  type ChangeState,
  type PadType,
} from "@/lib/change-timer";

/** The demo's fake "now" when Changed is tapped: 9:41, Apple's keynote time. */
const DEMO_NOW = 9 * 60 + 41;
const CELEBRATION_MS = 1800;

interface ChangeReminderValue {
  state: ChangeState;
  phase: ChangePhase;
  face: ChangeFace;
  /** 0…1, how much of the timer is left. */
  left: number;
  markChanged: () => void;
  start: () => void;
  pickPad: (pad: PadType) => void;
  pickHours: (hours: number) => void;
  jumpTo: (phase: ChangePhase) => void;
}

const ChangeReminderContext = createContext<ChangeReminderValue | null>(null);

/**
 * One shared timer for the whole page, so the Home pill, the Dynamic Island and the Lock Screen
 * all tell the same story, just like the app's single `ChangeStore`.
 */
export function ChangeReminderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(changeReducer, initialChangeState);

  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!state.celebrating) return;
    const id = window.setTimeout(() => dispatch({ type: "celebrationEnded" }), CELEBRATION_MS);
    return () => window.clearTimeout(id);
  }, [state.celebrating, state.startedAt]);

  const value = useMemo<ChangeReminderValue>(
    () => ({
      state,
      phase: phaseOf(state.remaining),
      face: faceOf(state),
      left: fractionLeft(state),
      markChanged: () => dispatch({ type: "changed", now: DEMO_NOW }),
      start: () => dispatch({ type: "start", now: DEMO_NOW }),
      pickPad: (pad) => dispatch({ type: "pickPad", pad }),
      pickHours: (hours) => dispatch({ type: "pickHours", hours }),
      jumpTo: (phase) => dispatch({ type: "jump", phase }),
    }),
    [state],
  );

  return <ChangeReminderContext.Provider value={value}>{children}</ChangeReminderContext.Provider>;
}

export function useChangeReminder(): ChangeReminderValue {
  const value = useContext(ChangeReminderContext);
  if (!value) throw new Error("useChangeReminder must be used inside <ChangeReminderProvider>");
  return value;
}
