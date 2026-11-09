import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/features/landing/content/landing";
import { LEGAL_PAGE_SLUGS } from "@/features/legal/pages";
import { localePath, localeRoutePath, routing } from "@/i18n/routing";
import sitemap from "./sitemap";

const entries = sitemap();

const slugs = ["", ...LEGAL_PAGE_SLUGS];
/** The page slug is the URL's last path segment, or "" for a locale home. */
const slugOf = (url: string) => slugs.find((slug) => slug && new URL(url).pathname.split("/").at(-1) === slug) ?? "";

function urlFor(locale: (typeof routing.locales)[number], slug = "") {
  return `${SITE_URL}${slug ? localeRoutePath(locale, slug) : localePath(locale)}`;
}

describe("sitemap", () => {
  it("returns home, privacy and terms entries for every routed locale", () => {
    expect(entries).toHaveLength(routing.locales.length * slugs.length);
  });

  it("lists each canonical URL exactly once", () => {
    const urls = entries.map((entry) => entry.url);
    for (const locale of routing.locales) {
      for (const slug of slugs) {
        expect(urls.filter((url) => url === urlFor(locale, slug))).toHaveLength(1);
      }
    }
  });

  it("carries the full alternate cluster plus x-default on every entry", () => {
    for (const entry of entries) {
      const slug = slugOf(entry.url);
      const expected = {
        ...Object.fromEntries(routing.locales.map((locale) => [locale, urlFor(locale, slug)])),
        "x-default": urlFor(routing.defaultLocale, slug),
      };
      expect(entry.alternates?.languages).toEqual(expected);
    }
  });

  it("keeps changeFrequency and priority", () => {
    for (const entry of entries) {
      expect(entry.changeFrequency).toBe("monthly");
      expect(entry.priority).toBe(slugOf(entry.url) ? 0.3 : 1);
    }
  });

  it("does not claim a modification date", () => {
    for (const entry of entries) {
      expect("lastModified" in entry).toBe(false);
    }
  });
});
