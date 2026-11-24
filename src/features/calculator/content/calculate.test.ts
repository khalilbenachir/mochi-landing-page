import { describe, expect, it } from "vitest";
import { addDays, clampLength, CYCLE_LENGTH, daysBetween, estimateCycles, estimateOvulation, parseDay, PERIOD_LENGTH } from "./calculate";

describe("period calculator", () => {
  it("adds the cycle length to the last start and repeats it", () => {
    const estimate = estimateCycles("2026-03-01", 28, 5, "2026-03-10")!;
    expect(estimate.periods).toEqual([
      { start: "2026-03-29", end: "2026-04-02" },
      { start: "2026-04-26", end: "2026-04-30" },
      { start: "2026-05-24", end: "2026-05-28" },
    ]);
  });

  it("places ovulation 14 days before the next period and a six-day fertile window ending on it", () => {
    const estimate = estimateCycles("2026-03-01", 28, 5, "2026-03-02")!;
    expect(estimate.ovulation).toBe("2026-03-15");
    expect(estimate.fertile).toEqual({ start: "2026-03-10", end: "2026-03-15" });
    expect(daysBetween(estimate.fertile.start, estimate.fertile.end)).toBe(5);
  });

  it("rolls an old start date forward so the first estimate is not in the past", () => {
    const estimate = estimateCycles("2026-01-01", 30, 4, "2026-03-15")!;
    expect(estimate.periods[0]!.start).toBe("2026-04-01");
    expect(daysBetween("2026-03-15", estimate.periods[0]!.start)).toBeGreaterThanOrEqual(0);
  });

  it("keeps a period starting today as the next estimate", () => {
    expect(estimateCycles("2026-02-01", 28, 5, "2026-03-01")!.periods[0]!.start).toBe("2026-03-01");
  });

  it("rejects future and malformed dates", () => {
    expect(estimateCycles("2026-04-01", 28, 5, "2026-03-01")).toBeUndefined();
    expect(estimateCycles("2026-02-30", 28, 5, "2026-03-01")).toBeUndefined();
    expect(estimateCycles("01/03/2026", 28, 5, "2026-03-01")).toBeUndefined();
    expect(parseDay("2026-13-01")).toBeUndefined();
  });

  it("clamps lengths to sensible bounds", () => {
    expect(clampLength(3, CYCLE_LENGTH)).toBe(CYCLE_LENGTH.min);
    expect(clampLength(400, CYCLE_LENGTH)).toBe(CYCLE_LENGTH.max);
    expect(clampLength(Number.NaN, PERIOD_LENGTH)).toBe(PERIOD_LENGTH.fallback);
    expect(clampLength(4.6, PERIOD_LENGTH)).toBe(5);
  });

  it("crosses month and year boundaries in UTC", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  });

  describe("estimateOvulation", () => {
    it("places ovulation 14 days before the next period, with fertile and peak windows", () => {
      const [first] = estimateOvulation("2026-03-01", 28, "2026-03-01")!;
      expect(first).toEqual({
        ovulation: "2026-03-15",
        fertile: { start: "2026-03-10", end: "2026-03-15" },
        peak: { start: "2026-03-13", end: "2026-03-15" },
        nextPeriod: "2026-03-29",
      });
    });

    it("returns three cycles, keeping a window that is open today", () => {
      const cycles = estimateOvulation("2026-03-01", 28, "2026-03-13")!;
      expect(cycles.map(({ ovulation }) => ovulation)).toEqual(["2026-03-15", "2026-04-12", "2026-05-10"]);
    });

    it("skips cycles whose ovulation has passed and rolls old dates forward", () => {
      expect(estimateOvulation("2026-03-01", 28, "2026-03-16")![0]!.ovulation).toBe("2026-04-12");
      expect(estimateOvulation("2025-11-01", 30, "2026-03-01")![0]!.ovulation).toBe("2026-03-17");
    });

    it("uses the cycle length for long and short cycles", () => {
      expect(estimateOvulation("2026-03-01", 35, "2026-03-01")![0]!.ovulation).toBe("2026-03-22");
      expect(estimateOvulation("2026-03-01", 21, "2026-03-01")![0]!.ovulation).toBe("2026-03-08");
    });

    it("rejects future and malformed dates", () => {
      expect(estimateOvulation("2026-04-01", 28, "2026-03-01")).toBeUndefined();
      expect(estimateOvulation("2026-02-30", 28, "2026-03-01")).toBeUndefined();
    });
  });
});
