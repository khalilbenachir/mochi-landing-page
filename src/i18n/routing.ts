import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "de", "es", "pt-BR", "pt-PT"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];

type LocaleMeta = {
  /** Endonym: the language's name written in that language. */
  name: string;
  /** Compact code shown on the switcher trigger. */
  short: string;
  /** Open Graph locale (language_TERRITORY). */
  ogLocale: string;
  /** Currency used for the free offer in structured data. */
  currency: string;
};

export const LOCALE_META = {
  en: { name: "English", short: "EN", ogLocale: "en_US", currency: "USD" },
  fr: { name: "Français", short: "FR", ogLocale: "fr_FR", currency: "EUR" },
  de: { name: "Deutsch", short: "DE", ogLocale: "de_DE", currency: "EUR" },
  es: { name: "Español", short: "ES", ogLocale: "es_ES", currency: "EUR" },
  "pt-BR": { name: "Português (Brasil)", short: "PT", ogLocale: "pt_BR", currency: "BRL" },
  "pt-PT": { name: "Português (Portugal)", short: "PT", ogLocale: "pt_PT", currency: "EUR" },
} as const satisfies Record<AppLocale, LocaleMeta>;

export function localePath(locale: AppLocale) {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}

/** Explicit prefixes let middleware update the locale cookie before canonicalizing the URL. */
export function localeSwitchPath(locale: AppLocale) {
  return `/${locale}`;
}
