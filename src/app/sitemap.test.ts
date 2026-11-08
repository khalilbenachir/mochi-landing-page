import { describe, expect, it } from "vitest";
import { SITE_URL } from "@/features/landing/content/landing";
import { localePath, routing } from "@/i18n/routing";
import sitemap from "./sitemap";

const entries = sitemap();

function urlFor(locale: (typeof routing.locales)[number]) {
  return `${SITE_URL}${localePath(locale)}`;
}

describe("sitemap", () => {
  it("returns one entry per routed locale", () => {
    expect(entries).toHaveLength(routing.locales.length);
  });

  it("lists each canonical URL exactly once", () => {
    const urls = entries.map((entry) => entry.url);
    for (const locale of routing.locales) {
      expect(urls.filter((url) => url === urlFor(locale))).toHaveLength(1);
    }
  });

  it("carries the full alternate cluster plus x-default on every entry", () => {
    const expected = {
      ...Object.fromEntries(routing.locales.map((locale) => [locale, urlFor(locale)])),
      "x-default": urlFor(routing.defaultLocale),
    };
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual(expected);
    }
  });

  it("keeps changeFrequency and priority", () => {
    for (const entry of entries) {
      expect(entry.changeFrequency).toBe("monthly");
      expect(entry.priority).toBe(1);
    }
  });

  it("does not claim a modification date", () => {
    for (const entry of entries) {
      expect("lastModified" in entry).toBe(false);
    }
  });
});
