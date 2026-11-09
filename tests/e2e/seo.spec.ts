import { expect, test, type Page } from "@playwright/test";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import ptBR from "../../messages/pt-BR.json";
import ptPT from "../../messages/pt-PT.json";
import { LANDING_ASSETS } from "../../src/features/landing/content/assets";
import { FAQ_IDS, STRUCTURED_FEATURE_IDS } from "../../src/features/landing/content/landing";
import { LEGAL_PAGE_SLUGS } from "../../src/features/legal/pages";
import { LOCALE_META, localePath, localeRoutePath, routing, type AppLocale } from "../../src/i18n/routing";
import { baseOrigin } from "./origin";

const MESSAGES = { en, fr, de, es, "pt-BR": ptBR, "pt-PT": ptPT } satisfies Record<
  AppLocale,
  {
    Metadata: { title: string; description: string };
    FAQ: { items: Record<string, { question: string; answer: string }> };
  }
>;

const SOCIAL_CARD_URL = `${baseOrigin}${LANDING_ASSETS.socialCard}`;

function pageUrl(locale: AppLocale): string {
  return new URL(localePath(locale), baseOrigin).href;
}

function must<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  return value as T;
}

function norm(url: string): string {
  return new URL(url).href;
}

function sorted(values: string[]): string[] {
  return [...values].sort();
}

async function metaContents(page: Page, attr: "property" | "name", key: string): Promise<string[]> {
  return page
    .locator(`head meta[${attr}="${key}"]`)
    .evaluateAll((els) => els.map((el) => el.getAttribute("content") ?? ""));
}

async function metaContent(page: Page, attr: "property" | "name", key: string): Promise<string> {
  const values = await metaContents(page, attr, key);
  expect(values, `exactly one meta ${attr}="${key}"`).toHaveLength(1);
  return must(values[0]);
}

type JsonObject = Record<string, unknown>;

async function readGraph(page: Page): Promise<{ doc: JsonObject; graph: JsonObject[] }> {
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  const raw = (await scripts.first().textContent()) ?? "";
  const doc = JSON.parse(raw) as JsonObject;
  const graph = doc["@graph"];
  expect(Array.isArray(graph), "@graph is an array").toBe(true);
  return { doc, graph: graph as JsonObject[] };
}

function nodeByType(graph: JsonObject[], type: string): JsonObject {
  const matches = graph.filter((node) => node["@type"] === type);
  expect(matches, `exactly one @graph node of @type ${type}`).toHaveLength(1);
  return must(matches[0]);
}

function collectUrlFields(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectUrlFields(item, out);
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if ((key === "@id" || key === "url" || key === "image") && typeof child === "string") {
        out.push(child);
      } else {
        collectUrlFields(child, out);
      }
    }
  }
  return out;
}

function nonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

test.describe("localized metadata", () => {
  for (const locale of routing.locales) {
    test(`${locale} exposes complete document metadata`, async ({ page }) => {
      const response = await page.goto(localePath(locale));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);

      expect(await page.title()).toBe(MESSAGES[locale].Metadata.title);
      expect(await metaContent(page, "name", "description")).toBe(
        MESSAGES[locale].Metadata.description,
      );

      const canonicals = await page
        .locator('head link[rel="canonical"]')
        .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
      expect(canonicals).toHaveLength(1);
      expect(norm(must(canonicals[0]))).toBe(pageUrl(locale));

      const alternates = await page
        .locator('head link[rel="alternate"][hreflang]')
        .evaluateAll((els) =>
          els.map((el): [string, string] => [
            el.getAttribute("hreflang") ?? "",
            el.getAttribute("href") ?? "",
          ]),
        );
      expect(sorted(alternates.map(([lang]) => lang))).toEqual(
        sorted([...routing.locales, "x-default"]),
      );
      const alternateMap = Object.fromEntries(alternates.map(([lang, href]) => [lang, norm(href)]));
      for (const l of routing.locales) {
        expect(alternateMap[l]).toBe(pageUrl(l));
      }
      expect(alternateMap["x-default"]).toBe(pageUrl(routing.defaultLocale));

      expect(norm(await metaContent(page, "property", "og:url"))).toBe(pageUrl(locale));
      expect(await metaContent(page, "property", "og:locale")).toBe(LOCALE_META[locale].ogLocale);
      expect(sorted(await metaContents(page, "property", "og:locale:alternate"))).toEqual(
        sorted(
          routing.locales.filter((l) => l !== locale).map((l) => LOCALE_META[l].ogLocale),
        ),
      );

      const robots = await metaContent(page, "name", "robots");
      expect(robots).toContain("index");
      expect(robots).toContain("follow");
      expect(robots).not.toContain("noindex");
      expect(robots).not.toContain("nofollow");

      expect(await metaContent(page, "property", "og:image")).toBe(SOCIAL_CARD_URL);
      expect(await metaContent(page, "property", "og:image:width")).toBe("1200");
      expect(await metaContent(page, "property", "og:image:height")).toBe("630");
      expect(await metaContent(page, "property", "og:image:alt")).toBe("Mochi");

      expect(await metaContent(page, "name", "twitter:card")).toBe("summary_large_image");
      expect(await metaContent(page, "name", "twitter:image")).toBe(SOCIAL_CARD_URL);
    });
  }
});

test.describe("structured data", () => {
  for (const locale of routing.locales) {
    test(`${locale} JSON-LD keeps site, app and FAQ facts`, async ({ page }) => {
      const response = await page.goto(localePath(locale));
      expect(response?.status()).toBe(200);

      const { doc, graph } = await readGraph(page);
      expect(doc["@context"]).toBe("https://schema.org");

      const website = nodeByType(graph, "WebSite");
      const app = nodeByType(graph, "MobileApplication");
      const faq = nodeByType(graph, "FAQPage");

      for (const node of [website, app, faq]) {
        expect(node.inLanguage).toBe(locale);
      }
      expect(website.description).toBe(MESSAGES[locale].Metadata.description);
      expect(app.description).toBe(MESSAGES[locale].Metadata.description);

      // `npm run build:test` leaves NEXT_PUBLIC_APP_STORE_URL empty, so the app URL is the page itself.
      expect(app.url).toBe(pageUrl(locale));

      const urls = collectUrlFields(doc);
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) {
        expect(url.startsWith(baseOrigin), `${url} starts with ${baseOrigin}`).toBe(true);
      }
      expect(JSON.stringify(doc)).not.toContain("localhost:3000");

      expect(app.applicationCategory).toBe("HealthApplication");
      expect(String(app.operatingSystem)).toContain("iOS");
      const offers = app.offers as JsonObject;
      expect(offers.price).toBe("0");
      expect(offers.priceCurrency).toBe(LOCALE_META[locale].currency);
      const features = app.featureList as unknown[];
      expect(features).toHaveLength(STRUCTURED_FEATURE_IDS.length);
      expect(features.every(nonEmptyString)).toBe(true);

      const questions = faq.mainEntity as JsonObject[];
      expect(questions).toHaveLength(FAQ_IDS.length);
      for (const question of questions) {
        expect(nonEmptyString(question.name)).toBe(true);
        expect(nonEmptyString((question.acceptedAnswer as JsonObject).text)).toBe(true);
      }
      expect(must(questions[0]).name).toBe(MESSAGES[locale].FAQ.items[FAQ_IDS[0]].question);
    });
  }
});

test.describe("crawler endpoints", () => {
  test("robots.txt permits wildcard crawling and names host and sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
    const body = await response.text();

    expect(body.match(/^user-agent:\s*\*\s*$/gim)).toHaveLength(1);
    expect(body).toMatch(/^Allow:\s*\/\s*$/im);
    expect(body).not.toMatch(/^Disallow:\s*\/\s*$/im);
    expect(body).toMatch(new RegExp(`^Host:\\s*${escapeRegExp(baseOrigin)}\\s*$`, "m"));
    expect(body).toMatch(
      new RegExp(`^Sitemap:\\s*${escapeRegExp(`${baseOrigin}/sitemap.xml`)}\\s*$`, "m"),
    );
  });

  test("sitemap.xml lists every locale with full alternates and no lastmod", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    const body = await response.text();

    expect(body).not.toContain("localhost:3000");
    expect(body).not.toMatch(/<lastmod>/i);

    const blocks = [...body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1] ?? "");
    expect(blocks).toHaveLength(routing.locales.length * 3);

    const locs = blocks.map((block) => {
      const found = [...block.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? "");
      expect(found).toHaveLength(1);
      return norm(must(found[0]));
    });
    expect(sorted(locs)).toEqual(sorted(routing.locales.flatMap((locale) => [pageUrl(locale), ...LEGAL_PAGE_SLUGS.map((slug) => new URL(localeRoutePath(locale, slug), baseOrigin).href)])));

    for (const block of blocks) {
      const slug = LEGAL_PAGE_SLUGS.find((candidate) => new RegExp(`<loc>[^<]*/${candidate}</loc>`).test(block));
      const expectedUrl = (locale: AppLocale) => slug ? new URL(localeRoutePath(locale, slug), baseOrigin).href : pageUrl(locale);
      const expectedAlternates: Record<string, string> = {
        ...Object.fromEntries(routing.locales.map((locale) => [locale, expectedUrl(locale)])),
        "x-default": expectedUrl(routing.defaultLocale),
      };
      const links = [...block.matchAll(/<xhtml:link\b([^>]*)\/?>/g)].map((m) => m[1] ?? "");
      const pairs = links.map((attrs): [string, string] => [
        /hreflang="([^"]+)"/.exec(attrs)?.[1] ?? "",
        norm(/href="([^"]+)"/.exec(attrs)?.[1] ?? ""),
      ]);
      expect(sorted(pairs.map(([lang]) => lang))).toEqual(sorted(Object.keys(expectedAlternates)));
      expect(Object.fromEntries(pairs)).toEqual(expectedAlternates);
    }

    for (const url of body.match(/https?:\/\/[^"<\s]+/g) ?? []) {
      if (url.startsWith("http://www.sitemaps.org") || url.startsWith("http://www.w3.org")) continue;
      expect(url.startsWith(baseOrigin), `${url} starts with ${baseOrigin}`).toBe(true);
    }
  });

  test("manifest declares only the shipped PNG icons", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("json");
    const manifest = (await response.json()) as JsonObject;

    for (const key of [
      "name",
      "short_name",
      "start_url",
      "theme_color",
      "background_color",
      "display",
    ]) {
      expect(nonEmptyString(manifest[key]), `manifest.${key} is non-empty`).toBe(true);
    }

    const icons = manifest.icons as { src: string; sizes: string; type: string; purpose: string }[];
    const bySrc = (a: { src: string }, b: { src: string }) => a.src.localeCompare(b.src);
    expect([...icons].sort(bySrc)).toEqual(
      [
        { src: LANDING_ASSETS.manifestIcon192, sizes: "192x192", type: "image/png", purpose: "any" },
        { src: LANDING_ASSETS.manifestIcon512, sizes: "512x512", type: "image/png", purpose: "any" },
      ].sort(bySrc),
    );
    for (const icon of icons) {
      expect(icon.src.endsWith(".webp")).toBe(false);
    }
  });

  for (const path of [
    "/icon.png",
    "/apple-icon.png",
    LANDING_ASSETS.manifestIcon192,
    LANDING_ASSETS.manifestIcon512,
    LANDING_ASSETS.socialCard,
  ]) {
    test(`${path} is served as a PNG`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");
    });
  }
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
