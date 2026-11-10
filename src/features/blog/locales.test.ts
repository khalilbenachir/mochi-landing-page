import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { BLOG_LOCALES, blogPath, FALLBACK_BLOG_LOCALE, isBlogLocale, parseBlogRoute } from "./locales";

describe("blog locales and routes", () => {
  it("falls back to the site's default locale, which always publishes the blog", () => {
    expect(FALLBACK_BLOG_LOCALE).toBe(routing.defaultLocale);
    expect(isBlogLocale(FALLBACK_BLOG_LOCALE)).toBe(true);
  });

  it("links every language to a published blog", () => {
    for (const locale of routing.locales) {
      const target = isBlogLocale(locale) ? locale : FALLBACK_BLOG_LOCALE;
      const prefix = target === routing.defaultLocale ? "" : `/${target}`;
      expect(blogPath(locale)).toBe(`${prefix}/blog`);
      expect(blogPath(locale, "some-slug")).toBe(`${prefix}/blog/some-slug`);
    }
    expect(BLOG_LOCALES.every((locale) => blogPath(locale).includes(locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`))).toBe(true);
  });

  it("recognizes blog routes with and without a locale prefix, and nothing else", () => {
    expect(parseBlogRoute("/blog")).toEqual({ prefix: undefined, rest: [] });
    expect(parseBlogRoute("/blog/a-post")).toEqual({ prefix: undefined, rest: ["a-post"] });
    expect(parseBlogRoute("/pt-PT/blog/a-post/")).toEqual({ prefix: "pt-PT", rest: ["a-post"] });
    expect(parseBlogRoute("/fr/blog")).toEqual({ prefix: "fr", rest: [] });
    for (const path of ["/", "/fr", "/blogs", "/fr/blogging", "/privacy", "/fr/privacy", "/xx/blog"]) expect(parseBlogRoute(path), path).toBeUndefined();
  });
});
