import type { FlavorId } from "./product-catalog";

export const MOOD_TONES = ["joy", "calm", "meh", "sad"] as const; // render order
export type MoodTone = (typeof MOOD_TONES)[number];
export const SYMPTOM_IDS = ["cramps", "bloating", "headache", "tired"] as const; // render order
export type SymptomId = (typeof SYMPTOM_IDS)[number];
export const CYCLE_PHASE_IDS = ["period", "follicular", "fertile", "ovulation", "luteal"] as const; // render order
export type CyclePhaseId = (typeof CYCLE_PHASE_IDS)[number];

/** Pill tint: each starter has its own color; everything you earn is pink. */
export const FLAVOR_PILL_CLASS: Record<FlavorId, string> = {
  strawberry: "bg-flavors-pill-starter",
  classic: "bg-flavors-pill-classic",
  matcha: "bg-flavors-pill-matcha",
  ube: "bg-flavors-pill-streak",
  mango: "bg-flavors-pill-streak",
  sesame: "bg-flavors-pill-streak",
  yuzu: "bg-flavors-pill-streak",
  chocolate: "bg-flavors-pill-streak",
  hojicha: "bg-flavors-pill-streak",
  sakura: "bg-flavors-pill-petals",
  peach: "bg-flavors-pill-challenge",
  coconut: "bg-flavors-pill-challenge",
};

/** chip = face background (bg-*), ink = stroke/fill color via currentColor (text-*). */
export const MOOD_FACE_CLASS: Record<MoodTone, { chip: string; ink: string }> = {
  joy: { chip: "bg-mood-face-joy", ink: "text-white" },
  calm: { chip: "bg-mood-face-calm", ink: "text-ink-slate" },
  meh: { chip: "bg-white", ink: "text-ink-slate" },
  sad: { chip: "bg-mood-face-sad", ink: "text-ink-slate" },
};

export const SYMPTOM_CHIP_CLASS: Record<SymptomId, string> = {
  cramps: "bg-mood-chip-cramps",
  bloating: "bg-mood-chip-violet",
  headache: "bg-mood-chip-violet",
  tired: "bg-mood-chip-violet",
};

/** The app's phase colors, as on its "Your cycle" bar and legend. */
export const CYCLE_PHASE_CLASS: Record<CyclePhaseId, string> = {
  period: "bg-cycle-period",
  follicular: "bg-cycle-follicular",
  fertile: "bg-cycle-fertile",
  ovulation: "bg-cycle-ovulation",
  luteal: "bg-cycle-luteal",
};
