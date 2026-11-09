import { expect, test } from "@playwright/test";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { localePath, routing } from "../../src/i18n/routing";
import { baseOrigin } from "./origin";
import { waitForPageAssets } from "./assets";

for (const locale of routing.locales) {
  const prefix = localePath(locale).replace(/\/$/, "");
  test(`${locale} privacy route has a complete responsive shell`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    for (const width of [320, 390, 759, 800, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`${prefix}/privacy`);
      expect(response?.status()).toBe(200);
      await waitForPageAssets(page);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("body > footer")).toHaveCount(1);
      await expect(page.locator("aside nav a")).toHaveCount(8);
      await expect(page.locator('section[aria-labelledby="privacy-summary"] a')).toHaveCount(4);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
      const textOverflow = await page.locator('h1, aside nav a span, section[aria-labelledby="privacy-summary"] h3').evaluateAll((elements) =>
        elements.filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.textContent),
      );
      expect(textOverflow, `${locale} text at ${width}px`).toEqual([]);
    }
    expect(errors).toEqual([]);
  });
}

/** `npm run build:test` pins these, so the page always renders the configured-launch state. */
const TEST_CONTACT_EMAIL = "test@mochi.app";

test("every policy section is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/privacy");
  const article = page.locator("article");
  for (const section of Object.values(en.PrivacyPolicy.sections)) {
    await expect(article.getByRole("heading", { name: section.title, exact: true })).toBeVisible();
    await expect(article.getByText(section.body, { exact: true })).toBeVisible();
  }
  await context.close();
});

test("privacy reader supports sections, summary links, direct URLs and browser history", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator('aside a[href="#collect"]')).toHaveAttribute("aria-current", "location");

  await page.locator('aside a[href="#analytics"]').click();
  await expect(page.locator("#analytics")).toBeInViewport();
  await expect(page.locator('aside a[href="#analytics"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator('aside a[aria-current="location"]')).toHaveCount(1);
  await expect(page.locator("#analytics-title")).toBeFocused();
  await page.goBack();
  await expect(page.locator('aside a[href="#collect"]')).toHaveAttribute("aria-current", "location");

  for (const id of ["device", "backup", "subscriptions", "rights", "children", "contact"]) {
    await page.locator(`aside a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}-title`)).toBeFocused();
    await expect(page.locator(`aside a[href="#${id}"]`)).toHaveAttribute("aria-current", "location");
  }

  await page.goto("/privacy#backup");
  await expect(page.locator("#backup")).toBeVisible();
  await expect(page.locator("#backup-title")).toBeFocused();
  await page.locator('section[aria-labelledby="privacy-summary"] a[href="#analytics"]').click();
  await expect(page.locator("#analytics-title")).toBeFocused();
  await expect(page.getByRole("link", { name: en.PrivacyPolicy.contactButton, exact: true })).toHaveAttribute("href", `mailto:${TEST_CONTACT_EMAIL}`);
  await expect(page.locator("#contact a")).toHaveAttribute("href", `mailto:${TEST_CONTACT_EMAIL}`);
  await expect(page.getByText("[YOUR EMAIL]")).toHaveCount(0);
});

test("privacy links support keyboard activation and encoded or invalid hashes", async ({ page }) => {
  await page.goto("/privacy#%62ackup");
  await expect(page.locator("#backup-title")).toBeFocused();
  const rights = page.locator('aside a[href="#rights"]');
  await rights.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#rights-title")).toBeFocused();
  await page.goto("/privacy#%ZZ");
  await expect(page.locator("#collect")).toBeVisible();
  await expect(page.locator('aside a[href="#collect"]')).toHaveAttribute("aria-current", "location");
});

for (const prefix of ["", "/fr"] as const) {
  test(`secondary-page download links reach the ${prefix || "English"} home download section`, async ({ page }) => {
    await page.goto(`${prefix}/privacy`);
    const download = page.locator('footer a[aria-label*="App Store"]').first();
    const expected = `${prefix || "/"}#get`;
    await expect(download).toHaveAttribute("href", expected);
    await download.click();
    await expect(page).toHaveURL(new URL(expected, baseOrigin).toString());
    await expect(page.locator("#get")).toBeVisible();
  });

  test(`footer contact link opens the ${prefix || "English"} privacy contact section`, async ({ page }) => {
    await page.goto(prefix || "/");
    await page.locator("body > footer nav a").last().click();
    await expect(page).toHaveURL(new URL(`${prefix}/privacy#contact`, baseOrigin).toString());
    await expect(page.locator("#contact-title")).toBeFocused();
  });
}

for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "phone", width: 390, height: 844 }]) {
  test(`visual: privacy ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/privacy");
    await waitForPageAssets(page);
    await expect(page).toHaveScreenshot(`privacy-${viewport.name}.png`, { fullPage: true, animations: "disabled" });
  });
}

test("language links keep the privacy route and mobile navigation returns home", async ({ page }) => {
  await page.goto("/privacy");
  await page.getByRole("button", { name: /Change language/ }).click();
  await page.getByRole("link", { name: "Français", exact: true }).click();
  await expect(page).toHaveURL(new URL("/fr/privacy", baseOrigin).toString());
  await expect(page.locator("h1")).toHaveText(fr.PrivacyPolicy.title);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: fr.Navigation.openMenu }).click();
  const mobile = page.getByRole("navigation", { name: fr.Navigation.mobileLabel });
  await expect(mobile.getByRole("link", { name: "English", exact: true })).toHaveAttribute("href", "/en/privacy");
  await mobile.getByRole("link", { name: fr.Navigation.features, exact: true }).click();
  await expect(page).toHaveURL(new URL("/fr#features", baseOrigin).toString());
  await expect(page.locator("#features")).toBeVisible();
});

for (const [locale, messages] of [["en", en], ["fr", fr]] as const) {
  test(`${locale} privacy metadata belongs to the policy`, async ({ page }) => {
    const path = `${localePath(locale).replace(/\/$/, "")}/privacy`;
    await page.goto(path);
    await expect(page).toHaveTitle(messages.PrivacyPolicy.metadataTitle);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", messages.PrivacyPolicy.metadataDescription);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new URL(path, baseOrigin).toString());
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", new URL(path, baseOrigin).toString());
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  });
}

for (const [prefix, viewport] of [["", 1440], ["/fr", 390]] as const) {
  test(`landing header privacy link opens ${prefix}/privacy at ${viewport}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport, height: 900 });
    await page.goto(prefix || "/");
    const header = page.locator("header").first();
    if (viewport < 760) await header.getByRole("button", { name: prefix ? fr.Navigation.openMenu : en.Navigation.openMenu }).click();
    const link = header.locator(`a[href="${prefix}/privacy"]`).filter({ visible: true });
    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(new URL(`${prefix}/privacy`, baseOrigin).toString());
    await expect(page.locator("h1")).toHaveText((prefix ? fr : en).PrivacyPolicy.title);
  });
}
