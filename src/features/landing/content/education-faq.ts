import type { EditorialSourceId } from "@/lib/editorial-sources";

/** Default sourced education questions appended to the English home FAQ (messages: `PeriodEducationFAQ`). */
export const EDUCATION_FAQ = [
  { id: "bestWay", sources: ["irregularPeriods"] },
  { id: "meaning", sources: ["menstrualCycle"] },
  { id: "noBleeding", sources: ["missedPeriods", "pregnancyTests"] },
  { id: "whenToStart", sources: ["menstrualCycle"] },
] as const satisfies readonly { id: string; sources: readonly EditorialSourceId[] }[];
