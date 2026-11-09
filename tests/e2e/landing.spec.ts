import { expect, test, type Page } from "@playwright/test";
import { baseOrigin } from "./origin";
import { waitForPageAssets } from "./assets";

const LOCALES = ["en", "fr", "de", "es", "pt-BR", "pt-PT"] as const;
type Locale = (typeof LOCALES)[number];
const localeUrl = (locale: Locale) => (locale === "en" ? "/" : `/${locale}`);

async function expectLocalizedFooter(page: Page, locale: Locale) {
  const homePath = localeUrl(locale);
  const routePrefix = homePath === "/" ? "" : homePath;
  const footer = page.locator("body > footer");

  await expect(footer).toHaveCount(1);
  await expect(footer.locator("a").first()).toHaveAttribute("href", `${homePath}#top`);
  expect(await footer.locator("nav a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual([
    `${routePrefix}/privacy`,
    `${routePrefix}/terms`,
    `${routePrefix}/privacy#contact`,
  ]);
  await expect(footer.locator("nav a")).toHaveCount(3);
  await expect(footer.locator("p")).toBeVisible();
}

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

test.describe("localized landing routes", () => {
  test("route: / returns 200 and renders one main landmark", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    const response = await page.goto("/");

    await waitForPageAssets(page);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);
    await expectLocalizedFooter(page, "en");
    assertClean();
  });

  test("route: /en redirects to the default-locale root", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    const response = await page.goto("/en");

    await waitForPageAssets(page);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL((url) => url.pathname === "/");
    await expect(page.locator("main")).toHaveCount(1);
    await expectLocalizedFooter(page, "en");
    assertClean();
  });

  for (const locale of LOCALES.filter((candidate) => candidate !== "en")) {
    test(`locale: /${locale} renders localized content at the localized URL`, async ({ page }) => {
      const assertClean = watchPageErrors(page);
      const response = await page.goto(`/${locale}`);

      await waitForPageAssets(page);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL((url) => url.pathname === `/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toHaveCount(1);
      await expectLocalizedFooter(page, locale);
      assertClean();
    });
  }

  test("landmarks: all eleven bands and the footer stay in composition order", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    await page.goto("/");
    await waitForPageAssets(page);

    const landmarks = page.locator("main");
    await expect(landmarks).toHaveCount(1);
    await expect(landmarks.locator("section")).toHaveCount(11);
    await expect(landmarks.locator("footer")).toHaveCount(0);
    await expect(page.locator("body > footer")).toHaveCount(1);
    expect(
      await page.locator("body > main, body > footer").evaluateAll((elements) =>
        elements.map((element) => element.tagName.toLowerCase()),
      ),
    ).toEqual(["main", "footer"]);
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

test.describe("language switcher", () => {
  test("desktop: dropdown lists every language and navigates to the choice", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    await page.setViewportSize({ width: 1440, height: 1200 });
    await page.goto("/");
    await waitForPageAssets(page);

    const trigger = page.locator("#top header nav button[aria-expanded]").first();
    const options = trigger.locator("xpath=..").locator("ul a");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(options).toHaveCount(LOCALES.length);
    await expect(options.and(page.locator("[aria-current=page]"))).toHaveText("English");

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    await trigger.press("ArrowDown");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(options.first()).toBeFocused();

    await options.filter({ hasText: "Deutsch" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/de");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    assertClean();
  });

  test("phone: burger menu shows every language inline", async ({ page }) => {
    const assertClean = watchPageErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/es");
    await waitForPageAssets(page);

    await page.locator("#top header button[aria-expanded]:visible").click();
    const links = page.locator("#top header a[hreflang]:visible");
    await expect(links).toHaveCount(LOCALES.length);
    await expect(links.filter({ hasText: "Español" })).toHaveAttribute("aria-current", "page");
    await links.filter({ hasText: "Português (Brasil)" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/pt-BR");
    assertClean();
  });

  test.describe("phone: burger menu with a mouse", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await waitForPageAssets(page);
    });

    const burger = (page: Page) => page.locator("#top header button[aria-expanded]:visible");
    const away = (page: Page) => page.mouse.move(10, 800);

    test("hover opens the menu and leaving closes it", async ({ page }) => {
      const assertClean = watchPageErrors(page);
      await burger(page).hover();
      await expect(burger(page)).toHaveAttribute("aria-expanded", "true");
      const panelId = await burger(page).getAttribute("aria-controls");
      await expect(page.locator(`[id="${panelId}"] a`).first()).toBeVisible();

      await away(page);
      await expect(burger(page)).toHaveAttribute("aria-expanded", "false");
      assertClean();
    });

    test("moving from the button into the panel keeps it open", async ({ page }) => {
      await burger(page).hover();
      await expect(burger(page)).toHaveAttribute("aria-expanded", "true");
      const box = (await burger(page).boundingBox())!;
      await page.mouse.move(box.x - 80, box.y + 140, { steps: 12 });
      await page.waitForTimeout(400);
      await expect(burger(page)).toHaveAttribute("aria-expanded", "true");
    });

    test("a click right after hovering pins the menu; a later click on the cross closes it", async ({ page }) => {
      await burger(page).click();
      await away(page);
      await page.waitForTimeout(400);
      await expect(burger(page)).toHaveAttribute("aria-expanded", "true");

      await burger(page).click();
      await expect(burger(page)).toHaveAttribute("aria-expanded", "false");
    });

    test("clicking the cross of a hover-opened menu closes it", async ({ page }) => {
      await burger(page).hover();
      await expect(burger(page)).toHaveAttribute("aria-expanded", "true");
      await page.waitForTimeout(400);
      await burger(page).click();
      await expect(burger(page)).toHaveAttribute("aria-expanded", "false");
    });
  });

  test("phone: burger menu toggles on touch", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await page.goto("/");
    await waitForPageAssets(page);
    const burger = page.locator("#top header button[aria-expanded]:visible");

    await burger.tap();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await burger.tap();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await context.close();
  });
});

for (const locale of LOCALES) {
  test(`layout: ${locale} never scrolls horizontally`, async ({ page }) => {
    for (const width of [390, 759, 1099, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(localeUrl(locale));
      await waitForPageAssets(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${locale} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

const visualCases = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "poster-transition", width: 1099, height: 1000 },
  { name: "navigation-transition", width: 759, height: 1000 },
  { name: "phone", width: 390, height: 844 },
  { name: "wide", width: 1600, height: 1200 },
];

for (const locale of LOCALES) {
  for (const viewport of visualCases) {
    test(`visual: ${locale} ${viewport.name} ${viewport.width}x${viewport.height}`, async ({ page }) => {
      const assertClean = watchPageErrors(page);
      // Freeze the one-second Dynamic Island countdown so its text cannot vary between captures.
      await page.clock.install({ time: new Date("2026-11-08T12:00:00Z") });
      await page.clock.pauseAt(new Date("2026-11-08T12:00:00Z"));
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(localeUrl(locale));
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

for (const locale of LOCALES) {
  test(`visual: ${locale} phone menu 390x844`, async ({ page }) => {
    const assertClean = watchPageErrors(page);
    await page.clock.install({ time: new Date("2026-11-08T12:00:00Z") });
    await page.clock.pauseAt(new Date("2026-11-08T12:00:00Z"));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(localeUrl(locale));
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await page.locator("nextjs-portal").evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
    await expect(page.locator("nextjs-portal")).toHaveCount(0);
    await waitForPageAssets(page);
    const menuButton = page.locator("#top header button[aria-expanded]:visible");
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(page).toHaveScreenshot(`${locale}-phone-menu-390x844.png`, { animations: "disabled" });
    assertClean();
  });
}
