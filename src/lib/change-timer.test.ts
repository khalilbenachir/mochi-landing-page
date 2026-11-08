import { describe, expect, it } from "vitest";
import {
  HOUR,
  changeReducer,
  clampHours,
  faceOf,
  formatClock,
  formatCompact,
  formatCountdown,
  formatHoursMinutes,
  fractionLeft,
  initialChangeState,
  phaseOf,
} from "./change-timer";

describe("phaseOf", () => {
  it("is due at zero and below", () => {
    expect(phaseOf(0)).toBe("due");
    expect(phaseOf(-5)).toBe("due");
  });
  it("is soon within the last hour", () => {
    expect(phaseOf(1)).toBe("soon");
    expect(phaseOf(HOUR)).toBe("soon");
  });
  it("is calm before the last hour", () => {
    expect(phaseOf(HOUR + 1)).toBe("calm");
  });
});

describe("formatting", () => {
  it("rounds the Home pill up so it only reads 0:00 when due", () => {
    expect(formatHoursMinutes(0)).toBe("0:00");
    expect(formatHoursMinutes(1)).toBe("0:01");
    expect(formatHoursMinutes(2 * HOUR + 28 * 60 + 1)).toBe("2:29");
  });
  it("formats the exact countdown", () => {
    expect(formatCountdown(2 * HOUR + 29 * 60 + 12)).toBe("2:29:12");
    expect(formatCountdown(-3)).toBe("0:00:00");
  });
  it("formats the compact island", () => {
    expect(formatCompact(0)).toBe("0:00");
    expect(formatCompact(42 * 60)).toBe("42m");
    expect(formatCompact(2 * HOUR + 5 * 60)).toBe("2h 05m");
  });
  it("wraps the clock past midnight", () => {
    expect(formatClock(14 * 60 + 5)).toBe("14:05");
    expect(formatClock(23 * 60 + 30 + 120)).toBe("01:30");
    expect(formatClock(-30)).toBe("23:30");
  });
});

describe("clampHours", () => {
  it("falls back to the overnight default under 6 hours", () => {
    expect(clampHours("overnight", 4)).toBe(8);
    expect(clampHours("overnight", 7)).toBe(7);
  });
  it("never goes above 8 hours", () => {
    expect(clampHours("day", 12)).toBe(8);
  });
});

describe("changeReducer", () => {
  it("counts down and stops at zero", () => {
    const s = changeReducer({ ...initialChangeState, remaining: 1 }, { type: "tick" });
    expect(s.remaining).toBe(0);
    expect(changeReducer(s, { type: "tick" }).remaining).toBe(0);
  });

  it("restarts the full timer on Changed and celebrates", () => {
    const due = { ...initialChangeState, remaining: 0 };
    const s = changeReducer(due, { type: "changed", now: 600 });
    expect(s.remaining).toBe(s.total);
    expect(s.startedAt).toBe(600);
    expect(faceOf(s)).toBe("happy");
    expect(faceOf(changeReducer(s, { type: "celebrationEnded" }))).toBe("calm");
  });

  it("keeps hours valid when switching to an overnight pad", () => {
    const s = changeReducer({ ...initialChangeState, hours: 3 }, { type: "pickPad", pad: "overnight" });
    expect(s.hours).toBe(8);
  });

  it("ignores hours below the pad's minimum", () => {
    const night = changeReducer(initialChangeState, { type: "pickPad", pad: "overnight" });
    expect(changeReducer(night, { type: "pickHours", hours: 4 })).toBe(night);
    expect(changeReducer(night, { type: "pickHours", hours: 6 }).hours).toBe(6);
  });

  it("starts a timer of the chosen length", () => {
    const s = changeReducer({ ...initialChangeState, hours: 6 }, { type: "start", now: 0 });
    expect(s.total).toBe(6 * HOUR);
    expect(fractionLeft(s)).toBe(1);
  });

  it("jumps to each phase for the demo", () => {
    expect(phaseOf(changeReducer(initialChangeState, { type: "jump", phase: "due" }).remaining)).toBe("due");
    expect(phaseOf(changeReducer(initialChangeState, { type: "jump", phase: "soon" }).remaining)).toBe("soon");
    expect(phaseOf(changeReducer(initialChangeState, { type: "jump", phase: "calm" }).remaining)).toBe("calm");
  });
});
