"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import {
  changeReducer,
  faceOf,
  fractionLeft,
  initialChangeState,
  phaseOf,
  type CardAction,
  type CardState,
  type ChangeFace,
  type ChangePhase,
  type ChangeState,
} from "@/lib/change-timer";

const CELEBRATION_MS = 1800;

interface ChangeReminderValue {
  state: ChangeState;
  /** Island and Lock Screen color phase, from the seconds left. */
  phase: ChangePhase;
  face: ChangeFace;
  /** 0…1, how much of the timer is left. */
  left: number;
  /** A button on the Home card (Start reminder, Changed, Stop, 15 min, Done, Undo). */
  act: (action: CardAction) => void;
  /** Shows one card state with demo values (state chips and the tour). */
  show: (card: CardState) => void;
  markChanged: () => void;
  jumpTo: (phase: ChangePhase) => void;
}

const ChangeReminderContext = createContext<ChangeReminderValue | null>(null);

/**
 * One shared timer for the whole page, so the Home card, the Dynamic Island and the Lock Screen
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
  }, [state.celebrating, state.undo]);

  const actions = useMemo(
    () => ({
      act: (action: CardAction) => dispatch({ type: action }),
      show: (card: CardState) => dispatch({ type: "show", card }),
      markChanged: () => dispatch({ type: "changed" }),
      jumpTo: (phase: ChangePhase) => dispatch({ type: "jump", phase }),
    }),
    [],
  );

  const value = useMemo<ChangeReminderValue>(
    () => ({
      state,
      phase: phaseOf(state.remaining),
      face: faceOf(state),
      left: fractionLeft(state),
      ...actions,
    }),
    [state, actions],
  );

  return <ChangeReminderContext.Provider value={value}>{children}</ChangeReminderContext.Provider>;
}

export function useChangeReminder(): ChangeReminderValue {
  const value = useContext(ChangeReminderContext);
  if (!value) throw new Error("useChangeReminder must be used inside <ChangeReminderProvider>");
  return value;
}
