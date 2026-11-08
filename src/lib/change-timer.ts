/**
 * The pad change reminder, as the landing page demos it.
 *
 * Pure and deterministic, so the rules mirror the app's `ChangeRules` / `ChangeMachine` and can be
 * unit tested: the React layer only dispatches actions and renders the derived values.
 *
 * Two views of the same timer:
 * - `CardState`, the six states of the Home card (variant B): idle, running, due, snoozed,
 *   overdue and "just changed". This is the source of truth.
 * - `ChangePhase` (calm / soon / due), derived from the seconds left, colors the Dynamic Island
 *   and the Lock Screen Live Activity.
 */

export type ChangePhase = "calm" | "soon" | "due";

/** What Mochi's face shows. `happy` is the short celebration right after "Changed". */
export type ChangeFace = ChangePhase | "happy";

export type CardState = "idle" | "running" | "due" | "snoozed" | "overdue" | "fresh";

export const CARD_STATES: readonly CardState[] = ["idle", "running", "due", "snoozed", "overdue", "fresh"];

export const HOUR = 3600;
export const SNOOZE = 15 * 60;

/** The demo's fake clock, in minutes after midnight: changed at 21:30 → next change at 1:30 AM. */
export const DEMO_NOW = 21 * 60 + 30;
const DEMO_TOTAL = 4 * HOUR;
const DEMO_RUNNING_LEFT = 3 * HOUR + 12 * 60;
const DEMO_SNOOZE_LEFT = 14 * 60 + 32;
const DEMO_SOON_LEFT = 42 * 60 + 9;
/** How late the overdue card says she is ("25 min past your reminder"). */
export const DEMO_OVERDUE_MINUTES = 25;

export interface ChangeState {
  card: CardState;
  /** Length of the timer, in seconds. */
  total: number;
  /** Seconds left before the change is due, never negative. */
  remaining: number;
  /** Seconds left in a 15 minute snooze. */
  snooze: number;
  /** When the pad was last changed, as minutes after midnight (the demo's fake clock). */
  startedAt: number;
  /** True for a moment after "Changed": Mochi is happy and confetti flies. */
  celebrating: boolean;
  /** What "Undo" goes back to after "Changed". */
  undo: { card: CardState; remaining: number } | null;
}

export type CardAction = "start" | "changed" | "stop" | "snooze" | "done" | "undo";

export type ChangeAction =
  | { type: "tick"; seconds?: number }
  | { type: CardAction }
  | { type: "show"; card: CardState }
  | { type: "jump"; phase: ChangePhase }
  | { type: "celebrationEnded" };

export const initialChangeState: ChangeState = {
  card: "running",
  total: DEMO_TOTAL,
  remaining: DEMO_RUNNING_LEFT,
  snooze: DEMO_SNOOZE_LEFT,
  startedAt: DEMO_NOW,
  celebrating: false,
  undo: null,
};

/** Shows one card state with believable demo values (the state chips and the tour use this). */
export function showCard(state: ChangeState, card: CardState): ChangeState {
  const base = { ...state, card, celebrating: false };
  switch (card) {
    case "idle":
      return base;
    case "running":
      return { ...base, total: DEMO_TOTAL, remaining: DEMO_RUNNING_LEFT, startedAt: DEMO_NOW };
    case "due":
    case "overdue":
      return { ...base, remaining: 0 };
    case "snoozed":
      return { ...base, remaining: 0, snooze: DEMO_SNOOZE_LEFT };
    case "fresh":
      return { ...base, remaining: state.total, startedAt: DEMO_NOW, undo: { card: "due", remaining: 0 } };
  }
}

export function changeReducer(state: ChangeState, action: ChangeAction): ChangeState {
  switch (action.type) {
    case "tick": {
      const seconds = action.seconds ?? 1;
      if (state.card === "running" || state.card === "fresh") {
        const remaining = Math.max(0, state.remaining - seconds);
        const card = remaining === 0 && state.card === "running" ? "due" : state.card;
        return { ...state, remaining, card };
      }
      if (state.card === "snoozed") {
        const snooze = Math.max(0, state.snooze - seconds);
        return { ...state, snooze, card: snooze === 0 ? "overdue" : "snoozed" };
      }
      return state;
    }
    case "start":
      return { ...state, card: "running", remaining: state.total, startedAt: DEMO_NOW, undo: null };
    case "changed":
      return {
        ...state,
        card: "fresh",
        remaining: state.total,
        startedAt: DEMO_NOW,
        celebrating: true,
        undo: { card: state.card === "fresh" ? "running" : state.card, remaining: state.remaining },
      };
    case "stop":
      return { ...state, card: "idle", celebrating: false };
    case "snooze":
      return { ...state, card: "snoozed", remaining: 0, snooze: SNOOZE };
    case "done":
      return { ...state, card: "running", celebrating: false, undo: null };
    case "undo":
      if (!state.undo) return state;
      return { ...state, card: state.undo.card, remaining: state.undo.remaining, celebrating: false, undo: null };
    case "show":
      return showCard(state, action.card);
    case "jump": {
      if (action.phase === "due") return { ...state, card: "due", remaining: 0, celebrating: false };
      const remaining = action.phase === "soon" ? DEMO_SOON_LEFT : Math.round(state.total * 0.64);
      return { ...state, card: "running", remaining, celebrating: false };
    }
    case "celebrationEnded":
      return { ...state, celebrating: false };
  }
}

/** Matches the app: due at zero, "soon" in the last hour. */
export function phaseOf(remaining: number): ChangePhase {
  if (remaining <= 0) return "due";
  if (remaining <= HOUR) return "soon";
  return "calm";
}

export function faceOf(state: ChangeState): ChangeFace {
  return state.celebrating ? "happy" : phaseOf(state.remaining);
}

/** Share of the timer still left, 0…1 (the ring drains as this falls). */
export function fractionLeft(state: Pick<ChangeState, "remaining" | "total">): number {
  if (state.total <= 0) return 0;
  return Math.min(1, Math.max(0, state.remaining / state.total));
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "3h 12m": hours and minutes rounded up, so it only reads 0h 00m when it's time. */
export function formatHoursMinutes(seconds: number): string {
  const minutes = Math.ceil(Math.max(0, seconds) / 60);
  return `${Math.floor(minutes / 60)}h ${pad2(minutes % 60)}m`;
}

/** "14:32": a snooze countdown. */
export function formatMinutesSeconds(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

/** "2:29:12": the exact countdown (expanded Dynamic Island, Lock Screen). */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / HOUR)}:${pad2(Math.floor((s % HOUR) / 60))}:${pad2(s % 60)}`;
}

/** "2h 29m" or "42m": the compact Dynamic Island. */
export function formatCompact(seconds: number): string {
  if (seconds <= 0) return "0:00";
  const minutes = Math.ceil(seconds / 60);
  const h = Math.floor(minutes / 60);
  return h > 0 ? `${h}h ${pad2(minutes % 60)}m` : `${minutes}m`;
}

const wrapDay = (minutes: number) => ((Math.round(minutes) % 1440) + 1440) % 1440;

/** "14:05" from minutes after midnight, wrapping past midnight. */
export function formatClock(minutesAfterMidnight: number): string {
  const m = wrapDay(minutesAfterMidnight);
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}

/** "1:30 AM": the card's clock times. */
export function formatClock12(minutesAfterMidnight: number): string {
  const m = wrapDay(minutesAfterMidnight);
  const h = Math.floor(m / 60);
  return `${((h + 11) % 12) + 1}:${pad2(m % 60)} ${h < 12 ? "AM" : "PM"}`;
}

/** When the next change is due, in minutes after midnight. */
export function dueAt(state: Pick<ChangeState, "startedAt" | "total">): number {
  return state.startedAt + Math.round(state.total / 60);
}

/** Colors for the island's black background (`ChangeActivityPalette`). */
export const ISLAND_ACCENT: Record<ChangePhase, string> = {
  calm: "#FF8FB1",
  soon: "#FFB86B",
  due: "#FF6B6B",
};

export function statusLine(phase: ChangePhase): string {
  if (phase === "due") return "Time to change";
  return phase === "soon" ? "change soon" : "until change";
}

// ---------- The Home card (variant B) ----------

export interface CardButton {
  label: string;
  action: CardAction;
  icon?: "check" | "timer";
}

/** Everything the card renders for one state. Copy matches the variant B design. */
export interface CardView {
  state: CardState;
  tone: "rose" | "dark";
  face: ChangeFace;
  /** A soft white ring around Mochi when the card needs attention. */
  ringed: boolean;
  /** A navy check on Mochi right after a change. */
  badge: boolean;
  /** Running and snoozed show a small caps label over a big number. */
  counter?: { eyebrow: string; value: string; detail: string };
  heading?: { title: string; subtitle: string };
  /** Elapsed share of the timer, 0…1 (running only). */
  progress?: number;
  primary: CardButton;
  secondary?: CardButton;
}

export function describeCard(state: ChangeState): CardView {
  const base = { state: state.card, tone: "rose" as const, ringed: false, badge: false };
  switch (state.card) {
    case "idle":
      return {
        ...base,
        face: "calm",
        heading: { title: "Pad change reminder", subtitle: "Mochi will tell you when it’s time to change" },
        primary: { label: "Start reminder", action: "start", icon: "timer" },
      };
    case "running":
      return {
        ...base,
        face: "calm",
        counter: {
          eyebrow: "Next change in",
          value: formatHoursMinutes(state.remaining),
          detail: `at ${formatClock12(dueAt(state))}`,
        },
        progress: 1 - fractionLeft(state),
        primary: { label: "Changed now", action: "changed", icon: "check" },
        secondary: { label: "Stop", action: "stop" },
      };
    case "due":
      return {
        ...base,
        face: "soon",
        ringed: true,
        heading: { title: "Time to change", subtitle: "Tap Changed once you’re done" },
        primary: { label: "Changed", action: "changed", icon: "check" },
        secondary: { label: "15 min", action: "snooze", icon: "timer" },
      };
    case "snoozed":
      return {
        ...base,
        face: "calm",
        counter: {
          eyebrow: "Snoozed",
          value: formatMinutesSeconds(state.snooze),
          detail: `back at ${formatClock12(DEMO_NOW + SNOOZE / 60)}`,
        },
        primary: { label: "Changed", action: "changed", icon: "check" },
        secondary: { label: "Stop", action: "stop" },
      };
    case "overdue":
      return {
        ...base,
        tone: "dark",
        face: "due",
        ringed: true,
        heading: { title: "Change overdue", subtitle: `${DEMO_OVERDUE_MINUTES} min past your reminder` },
        primary: { label: "Changed", action: "changed", icon: "check" },
        secondary: { label: "15 min", action: "snooze", icon: "timer" },
      };
    case "fresh":
      return {
        ...base,
        face: "happy",
        badge: true,
        heading: { title: "All fresh!", subtitle: `Next reminder around ${formatClock12(dueAt(state))}` },
        primary: { label: "Done", action: "done" },
        secondary: { label: "Undo", action: "undo" },
      };
  }
}
