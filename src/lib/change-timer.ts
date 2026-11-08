/**
 * The pad change reminder, as the landing page demos it.
 *
 * Pure and deterministic, so the rules mirror the app's `ChangeRules` / `ChangePhase` and can be
 * unit tested: the React layer only dispatches actions and renders the derived values.
 */

export type ChangePhase = "calm" | "soon" | "due";

/** What Mochi's face shows. `happy` is the short celebration right after "Changed". */
export type ChangeFace = ChangePhase | "happy";

export type PadType = "day" | "overnight" | "liner";

export interface PadOption {
  id: PadType;
  label: string;
  hint: string;
  minHours: number;
  defaultHours: number;
}

export const MAX_HOURS = 8;
export const HOUR = 3600;

export const PAD_OPTIONS: readonly PadOption[] = [
  { id: "day", label: "Day pad", hint: "Pick 2 to 8 hours. Mochi suggests 4.", minHours: 2, defaultHours: 4 },
  {
    id: "overnight",
    label: "Overnight pad",
    hint: "Pick 6 to 8 hours. The reminder arrives quietly, without a sound.",
    minHours: 6,
    defaultHours: 8,
  },
  { id: "liner", label: "Liner", hint: "Pick 2 to 8 hours.", minHours: 2, defaultHours: 4 },
];

export function padOption(id: PadType): PadOption {
  const option = PAD_OPTIONS.find((p) => p.id === id);
  if (!option) throw new Error(`Unknown pad type: ${id}`);
  return option;
}

/** Keeps the chosen hours valid for a pad type (an overnight pad can't be under 6 hours). */
export function clampHours(pad: PadType, hours: number): number {
  const { minHours, defaultHours } = padOption(pad);
  if (!Number.isFinite(hours) || hours < minHours) return defaultHours;
  return Math.min(Math.round(hours), MAX_HOURS);
}

export interface ChangeState {
  /** Length of the running timer, in seconds. */
  total: number;
  /** Seconds left, never negative. */
  remaining: number;
  /** When the pad was last changed, as minutes after midnight (the demo's fake clock). */
  startedAt: number;
  pad: PadType;
  hours: number;
  /** True for a moment after "Changed": Mochi is happy and confetti flies. */
  celebrating: boolean;
}

export type ChangeAction =
  | { type: "tick"; seconds?: number }
  | { type: "changed"; now: number }
  | { type: "pickPad"; pad: PadType }
  | { type: "pickHours"; hours: number }
  | { type: "start"; now: number }
  | { type: "jump"; phase: ChangePhase }
  | { type: "celebrationEnded" };

export const initialChangeState: ChangeState = {
  total: 4 * HOUR,
  remaining: 2 * HOUR + 29 * 60 + 12,
  startedAt: 14 * 60 + 5,
  pad: "day",
  hours: 4,
  celebrating: false,
};

export function changeReducer(state: ChangeState, action: ChangeAction): ChangeState {
  switch (action.type) {
    case "tick":
      return { ...state, remaining: Math.max(0, state.remaining - (action.seconds ?? 1)) };
    case "changed":
      return { ...state, remaining: state.total, startedAt: action.now, celebrating: true };
    case "pickPad":
      return { ...state, pad: action.pad, hours: clampHours(action.pad, state.hours) };
    case "pickHours":
      if (action.hours < padOption(state.pad).minHours || action.hours > MAX_HOURS) return state;
      return { ...state, hours: action.hours };
    case "start": {
      const total = state.hours * HOUR;
      return { ...state, total, remaining: total, startedAt: action.now, celebrating: true };
    }
    case "jump": {
      const remaining =
        action.phase === "due" ? 0 : action.phase === "soon" ? 42 * 60 + 9 : Math.round(state.total * 0.64);
      return { ...state, remaining, celebrating: false };
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

/** "2:29": hours and minutes rounded up, so it only reads 0:00 when it's time (the Home pill). */
export function formatHoursMinutes(seconds: number): string {
  const minutes = Math.ceil(Math.max(0, seconds) / 60);
  return `${Math.floor(minutes / 60)}:${pad2(minutes % 60)}`;
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

/** "14:05" from minutes after midnight, wrapping past midnight. */
export function formatClock(minutesAfterMidnight: number): string {
  const m = ((Math.round(minutesAfterMidnight) % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
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
