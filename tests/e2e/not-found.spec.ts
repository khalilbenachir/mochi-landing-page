import { expect, test, type Page } from "@playwright/test";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import ptBR from "../../messages/pt-BR.json";
import ptPT from "../../messages/pt-PT.json";
import { blogPath } from "../../src/features/blog/locales";
import { localePath, routing, type AppLocale } from "../../src/i18n/routing";
import { baseOrigin } from "./origin";
import { waitForPageAssets } from "./assets";

const MESSAGES = { en, fr, de, es, "pt-BR": ptBR, "pt-PT": ptPT } satisfies Record<
  AppLocale,
  {
    NotFound: {
      metadataTitle: string;
      metadataDescription: string;
      code: string;
      title: string;
      body: string;
      home: string;
      mascotAlt: string;
    };
    Footer: {
      navLabel: string;
      privacy: string;
      terms: string;
      contact: string;
      disclaimer: string;
    };
  }
>;

function missingPath(locale: AppLocale): string {
  const home = localePath(locale);
  return home === "/" ? "/missing-page" : `${home}/missing-page`;
}

function watchNotFoundErrors(page: Page) {
  const errors: string[] = [];
  const imageErrors: string[] = [];
  let expectedDocument404Messages = 0;
  const isSameOrigin = (url: string) => new URL(url).origin === baseOrigin;

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text() === "Failed to load resource: the server responded with a status of 404 (Not Found)") {
      expectedDocument404Messages += 1;
      return;
    }
    errors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (isSameOrigin(request.url()) && request.resourceType() === "image") {
      imageErrors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
    }
  });
  page.on("response", (response) => {
    if (
      isSameOrigin(response.url()) &&
      response.request().resourceType() === "image" &&
      response.status() >= 400
    ) {
      imageErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  return () => {
    expect(errors, "page errors and console errors").toEqual([]);
    expect(imageErrors, "failed same-origin images").toEqual([]);
    expect(expectedDocument404Messages, "only the expected 404 document may log a resource error").toBeLessThanOrEqual(1);
  };
}

test.describe("localized not-found routes", () => {
  test("paths outside the locale middleware return 404 without rendering app metadata", async ({ request }) => {
    for (const path of ["/missing.css", "/invalid.locale/privacy"]) {
      const response = await request.get(path);
      expect(response.status()).toBe(404);
      expect(await response.text()).not.toContain('"@type":"MobileApplication"');
    }
  });

  for (const locale of routing.locales) {
    test(`${locale} unknown URL returns the localized 404`, async ({ page }) => {
      const assertClean = watchNotFoundErrors(page);
      const response = await page.goto(missingPath(locale));
      await waitForPageAssets(page);

      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("body > footer")).toHaveCount(1);
      await expect(page.locator("body > footer a").first()).toHaveAttribute(
        "href",
        `${localePath(locale)}#top`,
      );
      const routePrefix = localePath(locale) === "/" ? "" : localePath(locale);
      const footer = page.locator("body > footer");
      expect(await footer.locator("nav a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual([
        blogPath(locale),
        `${routePrefix}/privacy`,
        `${routePrefix}/terms`,
        `${routePrefix}/privacy#contact`,
      ]);
      await expect(footer.locator("nav")).toHaveAttribute("aria-label", MESSAGES[locale].Footer.navLabel);
      await expect(footer.locator("p")).toHaveText(MESSAGES[locale].Footer.disclaimer);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toContainText(MESSAGES[locale].NotFound.title);
      await expect(page.getByText(MESSAGES[locale].NotFound.body, { exact: true })).toBeVisible();
      await expect(page.getByTestId("not-found-home")).toHaveText(MESSAGES[locale].NotFound.home);
      await expect(page.getByTestId("not-found-home")).toHaveAttribute("href", localePath(locale));
      assertClean();
    });
  }

  for (const locale of ["en", "fr"] as const) {
    test(`${locale} 404 has non-indexable route-specific metadata`, async ({ page }) => {
      const response = await page.goto(missingPath(locale));
      expect(response?.status()).toBe(404);

      await expect(page).toHaveTitle(MESSAGES[locale].NotFound.metadataTitle);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        MESSAGES[locale].NotFound.metadataDescription,
      );

      const robots = await page
        .locator('meta[name="robots"]')
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("content") ?? ""));
      const tokens = robots.flatMap((value) => value.toLowerCase().split(",").map((token) => token.trim()));
      expect(tokens).toContain("noindex");
      expect(tokens).not.toContain("index");
      expect(tokens).not.toContain("follow");
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
    });
  }
});

test.describe("not-found recovery", () => {
  for (const locale of ["en", "fr"] as const) {
    test(`${locale} recovery links return to the localized landing`, async ({ page }) => {
      const homeHref = localePath(locale);
      await page.goto(missingPath(locale));
      await waitForPageAssets(page);

      const home = page.getByTestId("not-found-home");
      await expect(home).toHaveAttribute("href", homeHref);
      await home.click();
      await expect(page).toHaveURL((url) => url.pathname === homeHref);
      await expect(page.locator("#top")).toBeVisible();

      await page.goto(missingPath(locale));
      const featureHref = `${homeHref}#features`;
      const featureLink = page.locator(`header a[href="${featureHref}"]`).first();
      await expect(featureLink).toBeVisible();
      await featureLink.click();
      await expect(page).toHaveURL((url) => `${url.pathname}${url.hash}` === featureHref);
      await expect(page.locator("#features")).toBeVisible();

      const response = await page.request.get(homeHref);
      expect(response.status()).toBe(200);
    });
  }

  test("keyboard and accessibility expose one useful error message", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(missingPath("en"));
    await waitForPageAssets(page);

    const home = page.getByTestId("not-found-home");
    const appStore = page.locator('main a[aria-label*="App Store"]').last();
    for (const link of [home, appStore]) {
      let focused = await link.evaluate((element) => element === document.activeElement);
      for (let index = 0; index < 100 && !focused; index += 1) {
        await page.keyboard.press("Tab");
        focused = await link.evaluate((element) => element === document.activeElement);
      }
      expect(focused, "primary 404 actions are reachable using Tab").toBe(true);
    }

    await expect(page.locator("main svg:not([aria-hidden=true])")).toHaveCount(0);
    const digits = page.locator("[data-not-found-digit]");
    await expect(digits).toHaveCount(2);
    for (const digit of await digits.all()) await expect(digit).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("h1")).toHaveAccessibleName(
      `${MESSAGES.en.NotFound.code}: ${MESSAGES.en.NotFound.title}`,
    );
  });
});

for (const locale of routing.locales) {
  test(`layout: ${locale} 404 never scrolls horizontally`, async ({ page }) => {
    for (const width of [390, 759, 1099, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(missingPath(locale));
      expect(response?.status()).toBe(404);
      await waitForPageAssets(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${locale} 404 at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

const SHARED_LAYOUT_SELECTORS = {
  art: '[data-testid="not-found-art"]',
  title: '[data-testid="not-found-title"]',
  body: '[data-testid="not-found-body"]',
  actions: '[data-testid="not-found-actions"]',
  footer: "footer",
} as const;

for (const viewport of [
  { width: 390, height: 844 },
  { width: 759, height: 1000 },
  { width: 1099, height: 1000 },
  { width: 1440, height: 1000 },
]) {
  test(`layout: 404 content lines up in every locale and the footer closes the page at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    let reference: Record<keyof typeof SHARED_LAYOUT_SELECTORS, { y: number; height: number }> | undefined;

    for (const locale of routing.locales) {
      const response = await page.goto(missingPath(locale));
      expect(response?.status()).toBe(404);
      await waitForPageAssets(page);

      const geometry = {} as Record<keyof typeof SHARED_LAYOUT_SELECTORS, { y: number; height: number }>;
      for (const [name, selector] of Object.entries(SHARED_LAYOUT_SELECTORS) as [
        keyof typeof SHARED_LAYOUT_SELECTORS,
        string,
      ][]) {
        const box = await page.locator(selector).boundingBox();
        expect(box, `${locale} ${name} exists at ${viewport.width}px`).not.toBeNull();
        geometry[name] = { y: Math.round(box!.y), height: Math.round(box!.height) };
      }

      // In every language the footer closes the page: its bottom edge is the document's bottom edge.
      const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      // y and height are rounded separately, so allow one pixel.
      expect(Math.abs(geometry.footer.y + geometry.footer.height - documentHeight), `${locale} footer ends the page at ${viewport.width}px`).toBeLessThanOrEqual(1);

      if (!reference) {
        reference = geometry;
        continue;
      }

      for (const name of Object.keys(SHARED_LAYOUT_SELECTORS) as (keyof typeof SHARED_LAYOUT_SELECTORS)[]) {
        // The footer wraps (and stacks) differently by language, so it is checked separately below.
        if (name === "footer") continue;
        expect(geometry[name].y, `${locale} ${name} y at ${viewport.width}px`).toBe(reference[name].y);
        expect(geometry[name].height, `${locale} ${name} height at ${viewport.width}px`).toBe(reference[name].height);
      }
    }
  });
}

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`visual: en 404 ${viewport.name} ${viewport.width}x${viewport.height}`, async ({ page }) => {
    const assertClean = watchNotFoundErrors(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const response = await page.goto(missingPath("en"));
    expect(response?.status()).toBe(404);
    await waitForPageAssets(page);
    await expect(page.locator("footer")).toBeVisible();
    await expect(page).toHaveScreenshot(`en-404-${viewport.name}-${viewport.width}x${viewport.height}.png`, {
      fullPage: true,
      animations: "disabled",
    });
    assertClean();
  });
}
