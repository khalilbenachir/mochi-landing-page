import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/features/landing/content/landing";
import { LEGAL_PAGE_SLUGS } from "@/features/legal/pages";
import { BLOG_PAGE_SEGMENTS, BLOG_POSTS } from "@/features/blog/content/catalog";
import { BLOG_LOCALES, blogPath, FALLBACK_BLOG_LOCALE, parseBlogRoute } from "@/features/blog/locales";
import { localePath, localeRoutePath, routing } from "@/i18n/routing";
import sitemap from "./sitemap";

const entries = sitemap();
const slugs = ["", ...LEGAL_PAGE_SLUGS];

describe("sitemap", () => {
  it("lists each published canonical once, including every published blog translation", () => {
    const expected = [
      ...slugs.flatMap((slug) => routing.locales.map((locale) => `${SITE_URL}${slug ? localeRoutePath(locale, slug) : localePath(locale)}`)),
      ...BLOG_LOCALES.flatMap((locale) => BLOG_PAGE_SEGMENTS.map((segments) => `${SITE_URL}${blogPath(locale, ...segments)}`)),
    ];
    expect(entries.map(({ url }) => url).sort()).toEqual(expected.sort());
    expect(new Set(entries.map(({ url }) => url)).size).toBe(entries.length);
  });

  it("advertises only published language equivalents", () => {
    for (const entry of entries) {
      const path = new URL(entry.url).pathname;
      const blogRoute = parseBlogRoute(path);
      if (blogRoute) {
        const url = (locale: (typeof BLOG_LOCALES)[number]) => `${SITE_URL}${blogPath(locale, ...blogRoute.rest)}`;
        expect(entry.alternates?.languages).toEqual({
          ...Object.fromEntries(BLOG_LOCALES.map((locale) => [locale, url(locale)])),
          "x-default": url(FALLBACK_BLOG_LOCALE),
        });
      } else {
        const slug = LEGAL_PAGE_SLUGS.find((candidate) => path.endsWith(`/${candidate}`));
        const urlFor = (locale: (typeof routing.locales)[number]) => `${SITE_URL}${slug ? localeRoutePath(locale, slug) : localePath(locale)}`;
        expect(entry.alternates?.languages).toEqual({
          ...Object.fromEntries(routing.locales.map((locale) => [locale, urlFor(locale)])),
          "x-default": urlFor(routing.defaultLocale),
        });
      }
    }
  });

  it("uses deliberate article dates without inventing dates for other pages", () => {
    for (const entry of entries) {
      const rest = parseBlogRoute(new URL(entry.url).pathname)?.rest;
      const post = BLOG_POSTS.find(({ slug }) => rest?.length === 1 && rest[0] === slug);
      if (post) expect(entry.lastModified).toBe(post.publishedAt);
      else expect(entry).not.toHaveProperty("lastModified");
      expect(entry.changeFrequency).toBe("monthly");
    }
  });

  it("keeps home first, then blog pages, then legal pages by priority", () => {
    for (const entry of entries) {
      const path = new URL(entry.url).pathname;
      const isLegal = LEGAL_PAGE_SLUGS.some((slug) => path.endsWith(`/${slug}`));
      expect(entry.priority).toBe(parseBlogRoute(path) ? 0.5 : isLegal ? 0.3 : 1);
    }
  });
});
