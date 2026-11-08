import { expect, test, type Page } from "@playwright/test";
import { baseOrigin } from "./origin";

const sectionIds = [
  "top",
  "features",
  "moods",
  "flavors",
  "predictions",
  "privacy",
  "why",
  "plus",
  "account",
  "faq",
  "get",
];

function watchPageErrors(page: Page) {
  const errors: string[] = [];
  const sameOriginResourceErrors: string[] = [];
  const isSameOrigin = (url: string) => new URL(url).origin === baseOrigin;

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (
      isSameOrigin(request.url()) &&
      ["document", "image"].includes(request.resourceType())
    ) {
      sameOriginResourceErrors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
    }
  });
  page.on("response", (response) => {
    const request = response.request();
    if (
      isSameOrigin(response.url()) &&
      ["document", "image"].includes(request.resourceType()) &&
      response.status() >= 400
    ) {
      sameOriginResourceErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  return () => {
    expect(errors, "page errors and console errors").toEqual([]);
    expect(sameOriginResourceErrors, "failed same-origin documents and images").toEqual([]);
  };
}

async function waitForPageAssets(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.images);
    images.forEach((image) => {
      image.loading = "eager";
    });
    await Promise.all(images.map((image) => image.decode()));
  });
}

test.describe("localized landing routes", () => {
  test("route: / returns 200 and renders one main landmark", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    const response = await page.goto("/");

    await waitForPageAssets(page);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);
    assertClean();
  });

  test("route: /en redirects to the default-locale root", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    const response = await page.goto("/en");

    await waitForPageAssets(page);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL((url) => url.pathname === "/");
    await expect(page.locator("main")).toHaveCount(1);
    assertClean();
  });

  test("locale: /fr renders French content at the localized URL", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    const response = await page.goto("/fr");

    await waitForPageAssets(page);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL((url) => url.pathname === "/fr");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("main")).toHaveCount(1);
    assertClean();
  });

  test("landmarks: all eleven bands and the footer stay in composition order", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    await page.goto("/");
    await waitForPageAssets(page);

    const landmarks = page.locator("main");
    await expect(landmarks).toHaveCount(1);
    await expect(landmarks.locator("section")).toHaveCount(11);
    await expect(landmarks.locator("footer")).toHaveCount(1);
    const renderedIds = await landmarks.locator("section").evaluateAll((sections) =>
      sections.map((section) => section.id),
    );
    expect(renderedIds).toEqual(sectionIds);
    assertClean();
  });

  test("keyboard: primary App Store links receive focus and FAQ opens with Space", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto("/");
    await waitForPageAssets(page);

    const heroCta = page.locator("#top a[aria-label*='App Store']").first();
    const closingCta = page.locator("#get a[aria-label*='App Store']").first();
    for (const cta of [heroCta, closingCta]) {
      let focused = await cta.evaluate((element) => element === document.activeElement);
      for (let i = 0; i < 100 && !focused; i += 1) {
        await page.keyboard.press("Tab");
        focused = await cta.evaluate((element) => element === document.activeElement);
      }
      expect(focused, "App Store CTA should be reachable using Tab").toBe(true);
    }

    const firstQuestion = page.locator("#faq button[aria-expanded]").nth(0);
    const secondQuestion = page.locator("#faq button[aria-expanded]").nth(1);
    await secondQuestion.focus();
    await page.keyboard.press("Space");
    await expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    assertClean();
  });
});

const visualCases = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "poster-transition", width: 1099, height: 1000 },
  { name: "navigation-transition", width: 759, height: 1000 },
  { name: "phone", width: 390, height: 844 },
  { name: "wide", width: 1600, height: 1200 },
];

for (const locale of ["en", "fr"] as const) {
  for (const viewport of visualCases) {
    test(`visual: ${locale} ${viewport.name} ${viewport.width}x${viewport.height}`, async ({ page }) => {
      const assertClean = watchPageErrors(page);
      // Freeze the one-second Dynamic Island countdown so its text cannot vary between captures.
      await page.clock.install({ time: new Date("2026-11-08T12:00:00Z") });
      await page.clock.pauseAt(new Date("2026-11-08T12:00:00Z"));
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(locale === "en" ? "/" : "/fr");
      // Keep Next.js's development toolbar out of visual baselines without changing app CSS.
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.locator("nextjs-portal").evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
      await expect(page.locator("nextjs-portal")).toHaveCount(0);
      await waitForPageAssets(page);
      await expect(page.locator("footer")).toBeVisible();
      await expect(page).toHaveScreenshot(`${locale}-${viewport.name}-${viewport.width}x${viewport.height}.png`, {
        fullPage: true,
        animations: "disabled",
      });
      assertClean();
    });
  }
}

for (const locale of ["en", "fr"] as const) {
  test(`visual: ${locale} phone menu 390x844`, async ({ page }) => {
    const assertClean = watchPageErrors(page);
    await page.clock.install({ time: new Date("2026-11-08T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-11-08T12:00:00Z"));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(locale === "en" ? "/" : "/fr");
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await page.locator("nextjs-portal").evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
    await expect(page.locator("nextjs-portal")).toHaveCount(0);
    await waitForPageAssets(page);
    const menuButton = page.locator("#top header button[aria-expanded]");
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(page).toHaveScreenshot(`${locale}-phone-menu-390x844.png`, { animations: "disabled" });
    assertClean();
  });
}
