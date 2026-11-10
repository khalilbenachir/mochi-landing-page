import type { AppLocale } from "@/i18n/routing";
import { sourceHref, type FaqSourceId } from "@/lib/editorial-sources";

type LocalizedFaqLocale = Exclude<AppLocale, "en">;
type EducationFaqId = "bestWay" | "meaning" | "noBleeding" | "whenToStart";

// Keep translation keys shared while selecting each language's requested questions and sources.
const SOURCE_IDS = {
  fr: [
    { id: "bestWay", sources: ["cycleFertility"] },
    { id: "meaning", sources: ["cycleFertility"] },
    { id: "noBleeding", sources: ["ovulation", "ovulationDetection"] },
    { id: "whenToStart", sources: ["naturalFertility", "fertilityAwareness"] },
  ],
  de: [
    { id: "bestWay", sources: ["ovulationDetection"] },
    { id: "meaning", sources: ["cycleFertility"] },
    { id: "noBleeding", sources: ["ovulation"] },
    { id: "whenToStart", sources: ["cycleFertility"] },
  ],
  es: [
    { id: "bestWay", sources: ["ovulationDetection", "cycleFertility"] },
    { id: "meaning", sources: ["menstrualCycle", "cycleFertility", "pregnancyTests"] },
    { id: "noBleeding", sources: ["cycleFertility", "fertilityAwareness"] },
    { id: "whenToStart", sources: ["fertilityAwareness", "pregnancyTests"] },
  ],
  "pt-BR": [
    { id: "bestWay", sources: ["menstrualCycle", "irregularPeriods"] },
    { id: "meaning", sources: ["trackingCycle", "cycleFertility"] },
    { id: "noBleeding", sources: ["ovulation", "ovulationDetection"] },
    { id: "whenToStart", sources: ["cycleFertility", "fertilityAwareness"] },
  ],
  "pt-PT": [
    { id: "bestWay", sources: ["trackingCycle", "menstrualCycle"] },
    { id: "meaning", sources: ["trackingCycle"] },
    { id: "noBleeding", sources: ["ovulation", "ovulationDetection"] },
    { id: "whenToStart", sources: ["periodBlood", "trackingCycle"] },
  ],
} as const satisfies Record<LocalizedFaqLocale, readonly { id: EducationFaqId; sources: readonly FaqSourceId[] }[]>;

// Source titles are locale-specific; editorial namespaces keep their existing schema.
const SOURCE_LABELS = {
  fr: {
    cycleFertility: "NHS : règles et fertilité au cours du cycle",
    ovulation: "Cleveland Clinic : ovulation et signes possibles",
    ovulationDetection: "ASRM : détecter l’ovulation",
    naturalFertility: "ASRM : comprendre la fenêtre fertile",
    fertilityAwareness: "NHS : observation de la fertilité et contraception",
  },
  de: {
    ovulationDetection: "ASRM: Methoden zur Feststellung des Eisprungs",
    cycleFertility: "NHS: Periode und Fruchtbarkeit im Zyklus",
    ovulation: "Cleveland Clinic: Eisprung und mögliche Anzeichen",
  },
  es: {
    ovulationDetection: "ASRM: cómo detectar la ovulación",
    cycleFertility: "NHS: menstruación y fertilidad en el ciclo",
    menstrualCycle: "Office on Women’s Health: el ciclo menstrual",
    pregnancyTests: "NHS: cuándo hacer un test de embarazo",
    fertilityAwareness: "NHS: conocimiento de la fertilidad y anticoncepción",
  },
  "pt-BR": {
    menstrualCycle: "Office on Women’s Health: o ciclo menstrual",
    irregularPeriods: "NHS: menstruação irregular",
    trackingCycle: "HHS: registros do ciclo e sinais de fertilidade",
    cycleFertility: "NHS: menstruação e fertilidade no ciclo",
    ovulation: "Cleveland Clinic: ovulação e possíveis sinais",
    ovulationDetection: "ASRM: métodos para detectar a ovulação",
    fertilityAwareness: "NHS: percepção da fertilidade e contracepção",
  },
  "pt-PT": {
    trackingCycle: "HHS: registos do ciclo e sinais de fertilidade",
    menstrualCycle: "Office on Women’s Health: o ciclo menstrual",
    ovulation: "Cleveland Clinic: ovulação e possíveis sinais",
    ovulationDetection: "ASRM: métodos de deteção da ovulação",
    periodBlood: "Cleveland Clinic: a cor do sangue menstrual",
  },
} satisfies Record<LocalizedFaqLocale, Partial<Record<FaqSourceId, string>>>;

export function getLocalizedFaqConfig(locale: AppLocale) {
  if (locale === "en") return undefined;
  const labels: Partial<Record<FaqSourceId, string>> = SOURCE_LABELS[locale];
  return SOURCE_IDS[locale].map(({ id, sources }) => ({
    id,
    sources: sources.map((source) => {
      const label = labels[source];
      if (!label) throw new Error(`Missing ${locale} FAQ source label: ${source}`);
      return { href: sourceHref(source, locale), label };
    }),
  }));
}
