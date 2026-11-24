import { describe, expect, it } from "vitest";
import { parseSitemap, selectUrls } from "./indexnow.mjs";

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>https://mochiii.app</loc>
<xhtml:link rel="alternate" hreflang="fr" href="https://mochiii.app/fr" />
<changefreq>monthly</changefreq>
</url>
<url>
<loc>https://mochiii.app/blog/how-often-to-change-your-pad</loc>
<lastmod>2026-11-24</lastmod>
</url>
<url>
<loc>https://mochiii.app/fr/blog/old-post</loc>
<lastmod>2026-09-01T00:00:00.000Z</lastmod>
</url>
</urlset>`;

describe("indexnow", () => {
  const entries = parseSitemap(SITEMAP);
  const now = new Date("2026-11-25T12:00:00Z");

  it("reads every url entry, ignoring hreflang links", () => {
    expect(entries).toEqual([
      { loc: "https://mochiii.app", lastmod: undefined },
      { loc: "https://mochiii.app/blog/how-often-to-change-your-pad", lastmod: "2026-11-24" },
      { loc: "https://mochiii.app/fr/blog/old-post", lastmod: "2026-09-01T00:00:00.000Z" },
    ]);
  });

  it("keeps only recently modified URLs by default", () => {
    expect(selectUrls(entries, { all: false, days: 3, now })).toEqual([
      "https://mochiii.app/blog/how-often-to-change-your-pad",
    ]);
  });

  it("keeps every URL with --all", () => {
    expect(selectUrls(entries, { all: true, days: 3, now })).toHaveLength(3);
  });
});
