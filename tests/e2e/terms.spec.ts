import { expect, test } from "@playwright/test";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import ptBR from "../../messages/pt-BR.json";
import ptPT from "../../messages/pt-PT.json";
import { localePath, localeRoutePath, routing } from "../../src/i18n/routing";
import { TERMS_SECTION_IDS } from "../../src/features/terms/content/terms";
import { baseOrigin } from "./origin";
import { waitForPageAssets } from "./assets";

const messages = { en, fr, de, es, "pt-BR": ptBR, "pt-PT": ptPT };
const TEST_CONTACT_EMAIL = "test@mochi.app";

for (const locale of routing.locales) {
  const path = localeRoutePath(locale, "terms");
  test(`${locale} terms route has a complete responsive shell`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    for (const width of [320, 390, 759, 800, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await waitForPageAssets(page);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(messages[locale].TermsOfUse.title);
      await expect(page.locator("body > footer")).toHaveCount(1);
      await expect(page.locator("aside nav a")).toHaveCount(7);
      await expect(page.locator('section[aria-labelledby="terms-summary"] a')).toHaveCount(4);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
      const overflow = await page.locator('h1, aside nav a span, section[aria-labelledby="terms-summary"] h3').evaluateAll((elements) =>
        elements.filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.textContent),
      );
      expect(overflow, `${locale} text at ${width}px`).toEqual([]);
    }
    expect(errors).toEqual([]);
  });

  test(`${locale} terms metadata and alternate links belong to the terms route`, async ({ page }) => {
    await page.goto(path);
    const copy = messages[locale].TermsOfUse;
    await expect(page).toHaveTitle(copy.metadataTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", copy.metadataDescription);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new URL(path, baseOrigin).toString());
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", new URL(path, baseOrigin).toString());
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
    for (const candidate of routing.locales) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${candidate}"]`)).toHaveAttribute("href", new URL(localeRoutePath(candidate, "terms"), baseOrigin).toString());
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute("href", new URL("/terms", baseOrigin).toString());
    await expect(page.locator('section[aria-labelledby="terms-summary"] a').last()).toHaveAttribute("href", localeRoutePath(locale, "privacy"));
    await expect(page.locator("#content a")).toHaveAttribute("href", localeRoutePath(locale, "privacy"));
  });

  test(`${locale} home and privacy footers open the terms page`, async ({ page }) => {
    for (const originPath of [localePath(locale), localeRoutePath(locale, "privacy")]) {
      await page.goto(originPath);
      await page.locator(`body > footer nav a[href="${path}"]`).click();
      await expect(page).toHaveURL(new URL(path, baseOrigin).toString());
      await expect(page.locator("h1")).toHaveText(messages[locale].TermsOfUse.title);
    }
  });
}

test("every terms section is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/terms");
  const article = page.locator("article");
  for (const section of Object.values(en.TermsOfUse.sections)) {
    await expect(article.getByRole("heading", { name: section.title, exact: true })).toBeVisible();
    await expect(article.getByText(section.body, { exact: true })).toBeVisible();
    await expect(article.getByText(section.detail, { exact: true })).toBeVisible();
  }
  await page.locator('aside a[href="#health"]').click();
  await expect(page.locator("#health")).toBeInViewport();
  await context.close();
});

test("terms reader supports every section, summary links, direct URLs and history", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.locator('aside a[href="#using"]')).toHaveAttribute("aria-current", "location");
  await page.locator('aside a[href="#health"]').click();
  await expect(page.locator("#health")).toBeInViewport();
  await expect(page.locator("#health-title")).toBeFocused();
  await page.goBack();
  await expect(page.locator('aside a[href="#using"]')).toHaveAttribute("aria-current", "location");

  for (const id of TERMS_SECTION_IDS) {
    await page.locator(`aside a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}-title`)).toBeFocused();
    await expect(page.locator(`aside a[href="#${id}"]`)).toHaveAttribute("aria-current", "location");
    await expect(page.locator('aside a[aria-current="location"]')).toHaveCount(1);
  }

  await page.goto("/terms#subscriptions");
  await expect(page.locator("#subscriptions-title")).toBeFocused();
  const cards = page.locator('section[aria-labelledby="terms-summary"] a');
  for (const [index, target] of [[0, "health"], [1, "health"], [2, "subscriptions"]] as const) {
    await page.goto("/terms");
    await cards.nth(index).click();
    await expect(page.locator(`#${target}-title`)).toBeFocused();
  }
  await cards.last().click();
  await expect(page).toHaveURL(new URL("/privacy", baseOrigin).toString());
  await page.goto("/terms");
  await expect(page.getByRole("link", { name: en.TermsOfUse.contactButton, exact: true })).toHaveAttribute("href", `mailto:${TEST_CONTACT_EMAIL}`);
  await expect(page.locator("#contact a")).toHaveAttribute("href", `mailto:${TEST_CONTACT_EMAIL}`);
  await expect(page.locator("#subscriptions a")).toHaveAttribute("href", "https://support.apple.com/en-us/118428");
  await expect(page.getByText("[YOUR EMAIL]")).toHaveCount(0);
});

test("terms links support keyboard activation and encoded or invalid hashes", async ({ page }) => {
  await page.goto("/terms#%68ealth");
  await expect(page.locator("#health-title")).toBeFocused();
  await page.locator('aside a[href="#acceptable-use"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#acceptable-use-title")).toBeFocused();
  for (const hash of ["%ZZ", "unknown"]) {
    await page.goto(`/terms#${hash}`);
    await expect(page.locator('aside a[href="#using"]')).toHaveAttribute("aria-current", "location");
    await expect(page.locator("#using")).toBeVisible();
  }
});

test("language links keep terms and mobile navigation returns to localized home", async ({ page }) => {
  await page.goto("/terms");
  await page.getByRole("button", { name: /Change language/ }).click();
  await page.getByRole("link", { name: "Français", exact: true }).click();
  await expect(page).toHaveURL(new URL("/fr/terms", baseOrigin).toString());
  await expect(page.locator("h1")).toHaveText(fr.TermsOfUse.title);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: fr.Navigation.openMenu }).click();
  const mobile = page.getByRole("navigation", { name: fr.Navigation.mobileLabel });
  await expect(mobile.getByRole("link", { name: "English", exact: true })).toHaveAttribute("href", "/en/terms");
  await mobile.getByRole("link", { name: fr.Navigation.features, exact: true }).click();
  await expect(page).toHaveURL(new URL("/fr#features", baseOrigin).toString());
  await expect(page.locator("#features")).toBeVisible();
});

for (const prefix of ["", "/fr"]) {
  test(`terms download links reach ${prefix || "English"} home`, async ({ page }) => {
    await page.goto(`${prefix}/terms`);
    const download = page.locator('footer a[aria-label*="App Store"]').first();
    const expected = `${prefix || "/"}#get`;
    await expect(download).toHaveAttribute("href", expected);
    await download.click();
    await expect(page).toHaveURL(new URL(expected, baseOrigin).toString());
    await expect(page.locator("#get")).toBeVisible();
  });
}

for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "phone", width: 390, height: 844 }]) {
  test(`visual: terms ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/terms");
    await waitForPageAssets(page);
    await expect(page).toHaveScreenshot(`terms-${viewport.name}.png`, { fullPage: true, animations: "disabled" });
  });
}
