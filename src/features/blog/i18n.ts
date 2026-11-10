import { useLocale } from "next-intl";
import { blogRoutes, isBlogLocale, type BlogLocale } from "./locales";

/** The request locale, narrowed to a blog locale. Routes 404 other locales before rendering. */
export function useBlogLocale(): BlogLocale {
  const locale = useLocale();
  if (!isBlogLocale(locale)) throw new Error(`Blog rendered for unpublished locale "${locale}"`);
  return locale;
}

/** Blog URLs for the request locale. */
export function useBlogRoutes() {
  return blogRoutes(useBlogLocale());
}
