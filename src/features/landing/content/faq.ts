import { getTranslations } from "next-intl/server";
import { isBlogLocale } from "@/features/blog/locales";
import type { AppLocale } from "@/i18n/routing";
import { sourceHref, type SourceLink } from "@/lib/editorial-sources";
import { EDUCATION_FAQ } from "./education-faq";
import { FAQ_IDS } from "./landing";
import { getLocalizedFaqConfig } from "./localized-faq";

export type FaqItem = { id: string; question: string; answer: string; sources?: SourceLink[]; sourcesLabel?: string };

/** Both the visible FAQ and JSON-LD consume this complete locale-specific list. */
export async function getLandingFaqItems(locale: AppLocale): Promise<FaqItem[]> {
  const localized = getLocalizedFaqConfig(locale);
  if (localized) {
    const education = await getTranslations({ locale, namespace: "PeriodEducationFAQ" });
    return localized.map(({ id, sources }) => ({
      id,
      question: education(`items.${id}.question`),
      answer: education(`items.${id}.answer`),
      sourcesLabel: education("sourcesLabel"),
      sources,
    }));
  }

  const faq = await getTranslations({ locale, namespace: "FAQ" });
  const items: FaqItem[] = FAQ_IDS.map((id) => ({
    id,
    question: faq(`items.${id}.question`),
    answer: faq(`items.${id}.answer`),
  }));
  if (!isBlogLocale(locale)) return items;

  const education = await getTranslations({ locale, namespace: "PeriodEducationFAQ" });
  return [
    ...items,
    ...EDUCATION_FAQ.map(({ id, sources }) => ({
      id,
      question: education(`items.${id}.question`),
      answer: education(`items.${id}.answer`),
      sourcesLabel: education("sourcesLabel"),
      sources: sources.map((source) => ({ href: sourceHref(source, locale), label: education(`sources.${source}`) })),
    })),
  ];
}
