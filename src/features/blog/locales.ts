import { localeRoutePath, routing, type AppLocale } from "@/i18n/routing";

/**
 * Locales with published editorial content: the blog and the sourced education FAQ on the home page.
 * This is the single switch for translating that content. Adding a locale here requires its
 * `Blog` and `PeriodEducationFAQ` messages and a registered `content/articles/<locale>/` folder;
 * type checks and `messages.test.ts` enforce both.
 */
export const BLOG_LOCALES = ["en", "fr", "de", "es", "pt-BR", "pt-PT"] as const satisfies readonly AppLocale[];

export type BlogLocale = (typeof BLOG_LOCALES)[number];

/** Serves every locale whose blog is not published yet; must stay the site's default locale (tested). */
export const FALLBACK_BLOG_LOCALE = "en" satisfies BlogLocale;

export const BLOG_SEGMENT = "blog";

export function isBlogLocale(locale: string): locale is BlogLocale {
  return (BLOG_LOCALES as readonly string[]).includes(locale);
}

/** The blog locale that serves visitors of `locale`: itself when published, otherwise the fallback. */
export function blogLocaleFor(locale: AppLocale): BlogLocale {
  return isBlogLocale(locale) ? locale : FALLBACK_BLOG_LOCALE;
}

/**
 * Public URL path of a blog page, e.g. `blogPath("fr", "some-slug")` → `/fr/blog/some-slug`.
 * Locales without a published blog resolve to the fallback blog, so every link works in every language.
 */
export function blogPath(locale: AppLocale, ...segments: string[]) {
  return localeRoutePath(blogLocaleFor(locale), [BLOG_SEGMENT, ...segments].join("/"));
}

export const EDITORIAL_SLUG = "editorial-policy";

/** Every blog URL for one locale; components use this instead of writing paths. */
export function blogRoutes(locale: AppLocale) {
  return {
    index: blogPath(locale),
    editorial: blogPath(locale, EDITORIAL_SLUG),
    post: (slug: string) => blogPath(locale, slug),
  };
}

/**
 * Splits a request path into its explicit locale prefix (if any) and the blog sub-path, or
 * returns `undefined` when the path is not a blog route. `/fr/blog/x` → `{ prefix: "fr", rest: ["x"] }`.
 */
export function parseBlogRoute(pathname: string): { prefix?: AppLocale; rest: string[] } | undefined {
  const parts = pathname.split("/").filter(Boolean);
  const prefix = routing.locales.find((locale) => locale === parts[0]);
  const [segment, ...rest] = prefix ? parts.slice(1) : parts;
  return segment === BLOG_SEGMENT ? { prefix, rest } : undefined;
}
