/** Public route segment under each locale home, e.g. `/period-calculator` or `/fr/period-calculator`. */
export const CALCULATOR_SLUG = "period-calculator";

/** Input bounds: wide enough for irregular and teen cycles, narrow enough to catch typos. */
export const CYCLE_LENGTH = { min: 15, max: 60, fallback: 28 } as const;
export const PERIOD_LENGTH = { min: 1, max: 14, fallback: 5 } as const;

/** The luteal phase lasts about 14 days (Cleveland Clinic), so ovulation is estimated 14 days before a period. */
export const LUTEAL_DAYS = 14;
/** The fertile window shown: the five days before estimated ovulation plus the ovulation day. */
export const FERTILE_DAYS_BEFORE_OVULATION = 5;
export const UPCOMING_PERIODS = 3;

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type DateRange = { start: string; end: string };
export type CycleEstimate = {
  periods: DateRange[];
  ovulation: string;
  fertile: DateRange;
};

/** Parses `YYYY-MM-DD` as a UTC calendar day; returns undefined for anything else. */
export function parseDay(value: string): number | undefined {
  if (!ISO_DATE.test(value)) return undefined;
  const time = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== value) return undefined;
  return time;
}

export function formatDay(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

export function addDays(day: string, days: number) {
  const time = parseDay(day);
  if (time === undefined) throw new Error(`Invalid day: ${day}`);
  return formatDay(time + days * DAY_MS);
}

export function daysBetween(from: string, to: string) {
  const a = parseDay(from);
  const b = parseDay(to);
  if (a === undefined || b === undefined) throw new Error(`Invalid day: ${from} / ${to}`);
  return Math.round((b - a) / DAY_MS);
}

export function clampLength(value: number, bounds: { min: number; max: number; fallback: number }) {
  if (!Number.isFinite(value)) return bounds.fallback;
  return Math.min(bounds.max, Math.max(bounds.min, Math.round(value)));
}

/**
 * Calendar estimate: each period starts one average cycle after the previous one. When the logged
 * start is old, cycles roll forward so the first estimate is today or later. Ovulation is placed
 * LUTEAL_DAYS before the next period. Returns undefined for an invalid or future start date.
 */
export function estimateCycles(lastStart: string, cycleLength: number, periodLength: number, today: string): CycleEstimate | undefined {
  if (parseDay(lastStart) === undefined || parseDay(today) === undefined) return undefined;
  const elapsed = daysBetween(lastStart, today);
  if (elapsed < 0) return undefined;
  const cycle = clampLength(cycleLength, CYCLE_LENGTH);
  const period = clampLength(periodLength, PERIOD_LENGTH);
  const cyclesAhead = Math.max(1, Math.ceil(elapsed / cycle));
  const periods = Array.from({ length: UPCOMING_PERIODS }, (_, index) => {
    const start = addDays(lastStart, (cyclesAhead + index) * cycle);
    return { start, end: addDays(start, period - 1) };
  });
  const ovulation = addDays(periods[0]!.start, -LUTEAL_DAYS);
  return { periods, ovulation, fertile: { start: addDays(ovulation, -FERTILE_DAYS_BEFORE_OVULATION), end: ovulation } };
}
