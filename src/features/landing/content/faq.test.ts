import { describe, expect, it, vi } from "vitest";
import en from "../../../../messages/en.json";
import fr from "../../../../messages/fr.json";
import de from "../../../../messages/de.json";
import es from "../../../../messages/es.json";
import ptBR from "../../../../messages/pt-BR.json";
import ptPT from "../../../../messages/pt-PT.json";
import { getLandingFaqItems } from "./faq";
import { routing } from "@/i18n/routing";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ locale, namespace }: { locale: string; namespace: string }) => {
    const { readFileSync } = await import("node:fs");
    const messages = JSON.parse(readFileSync(new URL(`../../../../messages/${locale}.json`, import.meta.url), "utf8"));
    return (key: string) => key.split(".").reduce((value, part) => value[part], messages[namespace]);
  },
}));

const expectedQuestions = {
  fr: ["Est-ce possible d’ovuler 7 jours après les règles ?", "Quelle est la durée entre les règles et l’ovulation ?", "Quels sont les 4 principaux signes de l’ovulation ?", "Quels sont les 2 jours les plus fertiles ?"],
  de: ["Wie kann ich messen, ob ich einen Eisprung habe?", "Wie viele Tage nach der Regel ist der Eisprung?", "Wie fühlt man sich 3 Tage vor dem Eisprung?", "Wie viele Eier platzen beim Eisprung?"],
  es: ["¿Cómo puedo controlarme cuando estoy ovulando?", "¿Cómo puedo calcular mi menstruación y la ovulación?", "¿Cuántos días después de la regla son los días fértiles?", "¿Cómo controlar mi ciclo menstrual para no quedar embarazada?"],
  "pt-BR": ["Como monitorar minha menstruação?", "Qual é a tabela para acompanhar a menstruação?", "O que sente a mulher quando está ovulando?", "Quantos dias após parar a menstruação é o dia fértil?"],
  "pt-PT": ["Qual é a tabela para acompanhar a menstruação?", "Como acompanhar minha menstruação?", "O que sente a mulher quando está ovulando?", "Qual o último dia da menstruação, borra ou sangue?"],
};
const messages = { en, fr, de, es, "pt-BR": ptBR, "pt-PT": ptPT };

describe("locale-specific landing FAQs", () => {
  for (const locale of routing.locales) {
    it(`serves the requested questions and sources for ${locale}`, async () => {
      const items = await getLandingFaqItems(locale);
      if (locale === "en") {
        expect(items.map(({ question, answer }) => ({ question, answer }))).toEqual([
          ...Object.values(en.FAQ.items), ...Object.values(en.PeriodEducationFAQ.items),
        ]);
        return;
      }
      expect(items.map(({ question }) => question)).toEqual(expectedQuestions[locale]);
      expect(new Set(items.map(({ id }) => id)).size).toBe(4);
      expect(items.map(({ question, answer }) => ({ question, answer }))).toEqual(Object.values(messages[locale].PeriodEducationFAQ.items));
      for (const item of items) {
        expect(item.answer.split(/\s+/).length).toBeGreaterThanOrEqual(50);
        expect(item.answer.split(/\s+/).length).toBeLessThanOrEqual(90);
        expect(item.sourcesLabel).toBeTruthy();
        expect(item.sources?.length).toBeGreaterThan(0);
        for (const source of item.sources ?? []) {
          expect(new URL(source.href).protocol).toBe("https:");
          expect(source.label).toBeTruthy();
        }
      }
    });
  }
});
