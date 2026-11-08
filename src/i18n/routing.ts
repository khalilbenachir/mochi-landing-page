import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];

export function localePath(locale: AppLocale) {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}

/** Explicit prefixes let middleware update the locale cookie before canonicalizing the URL. */
export function localeSwitchPath(locale: AppLocale) {
  return `/${locale}`;
}
