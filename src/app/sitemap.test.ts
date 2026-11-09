import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/features/landing/content/landing";
import { localePath, localeRoutePath, routing } from "@/i18n/routing";
import sitemap from "./sitemap";

const entries = sitemap();

function urlFor(locale: (typeof routing.locales)[number], privacy = false) {
  return `${SITE_URL}${privacy ? localeRoutePath(locale, "privacy") : localePath(locale)}`;
}

describe("sitemap", () => {
  it("returns home and privacy entries for every routed locale", () => {
    expect(entries).toHaveLength(routing.locales.length * 2);
  });

  it("lists each canonical URL exactly once", () => {
    const urls = entries.map((entry) => entry.url);
    for (const locale of routing.locales) {
      for (const privacy of [false, true]) {
        expect(urls.filter((url) => url === urlFor(locale, privacy))).toHaveLength(1);
      }
    }
  });

  it("carries the full alternate cluster plus x-default on every entry", () => {
    for (const entry of entries) {
      const privacy = new URL(entry.url).pathname.endsWith("/privacy");
      const expected = {
        ...Object.fromEntries(routing.locales.map((locale) => [locale, urlFor(locale, privacy)])),
        "x-default": urlFor(routing.defaultLocale, privacy),
      };
      expect(entry.alternates?.languages).toEqual(expected);
    }
  });

  it("keeps changeFrequency and priority", () => {
    for (const entry of entries) {
      expect(entry.changeFrequency).toBe("monthly");
      expect(entry.priority).toBe(new URL(entry.url).pathname.endsWith("/privacy") ? 0.3 : 1);
    }
  });

  it("does not claim a modification date", () => {
    for (const entry of entries) {
      expect("lastModified" in entry).toBe(false);
    }
  });
});
