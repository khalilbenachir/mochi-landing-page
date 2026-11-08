import { describe, expect, it } from "vitest";
import {
  CARD_STATES,
  HOUR,
  SNOOZE,
  changeReducer,
  describeCard,
  faceOf,
  formatClock,
  formatClock12,
  formatCompact,
  formatCountdown,
  formatHoursMinutes,
  formatMinutesSeconds,
  fractionLeft,
  initialChangeState,
  phaseOf,
  showCard,
  type ChangeState,
} from "./change-timer";

const at = (patch: Partial<ChangeState>): ChangeState => ({ ...initialChangeState, ...patch });

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
  it("rounds the card countdown up so it only reads 0h 00m when due", () => {
    expect(formatHoursMinutes(0)).toBe("0h 00m");
    expect(formatHoursMinutes(1)).toBe("0h 01m");
    expect(formatHoursMinutes(3 * HOUR + 11 * 60 + 1)).toBe("3h 12m");
  });
  it("formats a snooze as minutes and seconds", () => {
    expect(formatMinutesSeconds(14 * 60 + 32)).toBe("14:32");
    expect(formatMinutesSeconds(-1)).toBe("00:00");
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
  it("wraps the 24 hour clock past midnight", () => {
    expect(formatClock(14 * 60 + 5)).toBe("14:05");
    expect(formatClock(23 * 60 + 30 + 120)).toBe("01:30");
    expect(formatClock(-30)).toBe("23:30");
  });
  it("formats the 12 hour clock around noon and midnight", () => {
    expect(formatClock12(0)).toBe("12:00 AM");
    expect(formatClock12(12 * 60)).toBe("12:00 PM");
    expect(formatClock12(21 * 60 + 45)).toBe("9:45 PM");
    expect(formatClock12(25 * 60 + 30)).toBe("1:30 AM");
  });
});

describe("timer", () => {
  it("counts down and turns due at zero", () => {
    const s = changeReducer(at({ card: "running", remaining: 1 }), { type: "tick" });
    expect(s.remaining).toBe(0);
    expect(s.card).toBe("due");
  });

  it("turns a finished snooze into overdue", () => {
    const s = changeReducer(at({ card: "snoozed", snooze: 1 }), { type: "tick" });
    expect(s.card).toBe("overdue");
  });

  it("does not count down while idle, due or overdue", () => {
    for (const card of ["idle", "due", "overdue"] as const) {
      const s = at({ card, remaining: 100 });
      expect(changeReducer(s, { type: "tick" })).toBe(s);
    }
  });

  it("keeps the next timer running after a change, without turning due", () => {
    const s = changeReducer(at({ card: "fresh", remaining: 1 }), { type: "tick" });
    expect(s.remaining).toBe(0);
    expect(s.card).toBe("fresh");
  });
});

describe("card actions", () => {
  it("starts a full timer from idle", () => {
    const s = changeReducer(at({ card: "idle", remaining: 0 }), { type: "start" });
    expect(s.card).toBe("running");
    expect(fractionLeft(s)).toBe(1);
  });

  it("celebrates a change and can undo it", () => {
    const due = at({ card: "due", remaining: 0 });
    const fresh = changeReducer(due, { type: "changed" });
    expect(fresh.card).toBe("fresh");
    expect(fresh.remaining).toBe(fresh.total);
    expect(faceOf(fresh)).toBe("happy");

    const undone = changeReducer(fresh, { type: "undo" });
    expect(undone.card).toBe("due");
    expect(undone.remaining).toBe(0);
    expect(undone.undo).toBeNull();
  });

  it("ignores undo when there is nothing to undo", () => {
    const s = at({ undo: null });
    expect(changeReducer(s, { type: "undo" })).toBe(s);
  });

  it("snoozes for 15 minutes", () => {
    const s = changeReducer(at({ card: "due", remaining: 0 }), { type: "snooze" });
    expect(s.card).toBe("snoozed");
    expect(s.snooze).toBe(SNOOZE);
  });

  it("goes back to running after Done, and to idle after Stop", () => {
    expect(changeReducer(at({ card: "fresh" }), { type: "done" }).card).toBe("running");
    expect(changeReducer(at({ card: "snoozed" }), { type: "stop" }).card).toBe("idle");
  });

  it("follows the island's phase buttons", () => {
    expect(changeReducer(initialChangeState, { type: "jump", phase: "due" }).card).toBe("due");
    const soon = changeReducer(initialChangeState, { type: "jump", phase: "soon" });
    expect(soon.card).toBe("running");
    expect(phaseOf(soon.remaining)).toBe("soon");
  });
});

describe("describeCard", () => {
  it("matches the variant B copy for every state", () => {
    const view = (card: (typeof CARD_STATES)[number]) => describeCard(showCard(initialChangeState, card));

    expect(view("idle").primary.label).toBe("Start reminder");
    expect(view("idle").secondary).toBeUndefined();

    expect(view("running").counter).toEqual({ eyebrow: "Next change in", value: "3h 12m", detail: "at 1:30 AM" });
    expect(view("running").secondary?.label).toBe("Stop");

    expect(view("due").heading?.title).toBe("Time to change");
    expect(view("due").ringed).toBe(true);
    expect(view("due").secondary?.label).toBe("15 min");

    expect(view("snoozed").counter).toEqual({ eyebrow: "Snoozed", value: "14:32", detail: "back at 9:45 PM" });

    expect(view("overdue").tone).toBe("dark");
    expect(view("overdue").heading?.subtitle).toBe("25 min past your reminder");

    expect(view("fresh").heading).toEqual({ title: "All fresh!", subtitle: "Next reminder around 1:30 AM" });
    expect(view("fresh").badge).toBe(true);
    expect(view("fresh").secondary?.label).toBe("Undo");
  });

  it("shows elapsed progress while running", () => {
    const v = describeCard(at({ card: "running", total: 4 * HOUR, remaining: 3 * HOUR }));
    expect(v.progress).toBeCloseTo(0.25);
  });
});
