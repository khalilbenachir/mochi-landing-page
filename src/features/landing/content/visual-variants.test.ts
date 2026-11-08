import { describe, expect, it } from "vitest";
import { FLAVOR_CATALOG } from "./product-catalog";
import {
  CYCLE_FACT_CLASS,
  CYCLE_FACT_IDS,
  CYCLE_LEGEND_CLASS,
  CYCLE_LEGEND_IDS,
  FLAVOR_PILL_CLASS,
  MOOD_FACE_CLASS,
  MOOD_TONES,
  SYMPTOM_CHIP_CLASS,
  SYMPTOM_IDS,
} from "./visual-variants";

const sorted = (values: readonly string[]) => [...values].sort();

describe("visual variants", () => {
  it("cover exactly their ID sets", () => {
    expect(sorted(Object.keys(FLAVOR_PILL_CLASS))).toEqual(sorted(FLAVOR_CATALOG.map((f) => f.id)));
    expect(sorted(Object.keys(MOOD_FACE_CLASS))).toEqual(sorted(MOOD_TONES));
    expect(sorted(Object.keys(SYMPTOM_CHIP_CLASS))).toEqual(sorted(SYMPTOM_IDS));
    expect(sorted(Object.keys(CYCLE_LEGEND_CLASS))).toEqual(sorted(CYCLE_LEGEND_IDS));
    expect(sorted(Object.keys(CYCLE_FACT_CLASS))).toEqual(sorted(CYCLE_FACT_IDS));
  });

  it("contain only static, non-empty class strings", () => {
    const values = [
      ...Object.values(FLAVOR_PILL_CLASS),
      ...Object.values(MOOD_FACE_CLASS).flatMap((v) => [v.chip, v.ink]),
      ...Object.values(SYMPTOM_CHIP_CLASS),
      ...Object.values(CYCLE_LEGEND_CLASS),
      ...Object.values(CYCLE_FACT_CLASS),
    ];
    for (const value of values) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).not.toContain("${");
    }
  });
});
