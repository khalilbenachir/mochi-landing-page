import { expect, test } from "@playwright/test";
import { BLOG_POSTS } from "../../src/features/blog/content/catalog";
import { blogRoutes } from "../../src/features/blog/locales";
import { localePath, routing } from "../../src/i18n/routing";
import { baseOrigin } from "./origin";

for (const locale of routing.locales) {
  test(`homepage negotiates ${locale}`, async ({ request }) => {
    const headers = { "Accept-Language": locale };
    const response = await request.get("/?campaign=welcome", { headers, maxRedirects: 0 });
    expect(response.status()).toBe(locale === "en" ? 200 : 307);
    expect(response.headers()["cache-control"]).toMatch(/private/);
    expect(response.headers()["cache-control"]).toMatch(/no-store/);
    expect(response.headers()["cache-control"]).not.toMatch(/public|s-maxage/);
    if (locale !== "en") {
      expect((response.headers().vary ?? "").toLowerCase()).toContain("accept-language");
      expect((response.headers().vary ?? "").toLowerCase()).toContain("cookie");
      const destination = new URL(response.headers().location!, baseOrigin);
      expect(destination.pathname).toBe(localePath(locale));
      expect(destination.search).toBe("?campaign=welcome");
      const final = await request.get(destination.toString(), { headers });
      expect(final.status()).toBe(200);
      expect(await final.text()).toContain(`<html lang="${locale}"`);
    } else {
      expect(response.headers().location).toBeUndefined();
      expect(await response.text()).toContain('<html lang="en"');
    }
  });
}

for (const [label, language, cookie, expected] of [
  ["no preference", "", "", "en"],
  ["unsupported language", "ja-JP", "", "en"],
  ["saved French", "en", "fr", "fr"],
  ["saved English", "fr-FR", "en", "en"],
  ["invalid cookie", "fr-FR", "invalid", "fr"],
  ["weighted preferences", "es;q=0.5,fr-FR;q=0.9", "", "fr"],
  ["malformed language", "@@@", "", "en"],
] as const) {
  test(`homepage handles ${label}`, async ({ request }) => {
    const headers: Record<string, string> = { "Accept-Language": language };
    if (cookie) headers.Cookie = `NEXT_LOCALE=${cookie}`;
    const response = await request.get("/", { headers, maxRedirects: 0 });
    expect(response.status()).toBe(expected === "en" ? 200 : 307);
    if (expected === "en") {
      expect(await response.text()).toContain('<html lang="en"');
    } else {
      expect(new URL(response.headers().location!, baseOrigin).pathname).toBe(`/${expected}`);
      const final = await request.get(response.headers().location!, { headers: { "Accept-Language": language } });
      expect(final.status()).toBe(200);
      expect(await final.text()).toContain(`<html lang="${expected}"`);
    }
  });
}

for (const [locale, preferred] of [["fr", "en"], ["de", "fr"]] as const) {
  test(`explicit ${locale} overrides ${preferred} preferences`, async ({ request }) => {
    const response = await request.get(`/${locale}`, {
      headers: { "Accept-Language": preferred, Cookie: `NEXT_LOCALE=${preferred}` },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`<html lang="${locale}"`);
  });
}

for (const route of ["", "/privacy", "/blog"]) {
  test(`explicit English ${route || "home"} persists without a redirect loop`, async ({ request }) => {
    const headers = { "Accept-Language": "fr-FR" };
    const response = await request.get(`/en${route}`, {
      headers: { ...headers, Cookie: "NEXT_LOCALE=fr" },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(307);
    expect(new URL(response.headers().location!, baseOrigin).pathname).toBe(route || "/");
    expect(response.headers()["set-cookie"]).toContain("NEXT_LOCALE=en");
    const final = await request.get(response.headers().location!, { headers, maxRedirects: 0 });
    expect(final.status()).toBe(200);
    expect(await final.text()).toContain('<html lang="en"');
    const home = await request.get("/", { headers, maxRedirects: 0 });
    expect(home.status()).toBe(200);
    expect(await home.text()).toContain('<html lang="en"');
  });
}

test("English content reads preserve a saved French preference", async ({ context }) => {
  await context.addCookies([{ name: "NEXT_LOCALE", value: "fr", url: test.info().project.use.baseURL! }]);
  const headers = { "Accept-Language": "fr-FR" };
  for (const path of ["/privacy", "/terms", "/blog", blogRoutes("en").post(BLOG_POSTS[0]!.slug)]) {
    const response = await context.request.get(path, { headers, maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<html lang="en"');
    expect((await context.cookies()).find((cookie) => cookie.name === "NEXT_LOCALE")?.value).toBe("fr");
  }
  const home = await context.request.get("/", { headers, maxRedirects: 0 });
  expect(home.status()).toBe(307);
  expect(new URL(home.headers().location!, baseOrigin).pathname).toBe("/fr");
});

test.describe("French browser manual language choice", () => {
  test.use({ locale: "fr-FR" });

  for (const mobile of [false, true]) {
    test(`${mobile ? "mobile" : "desktop"} menu can select persistent English`, async ({ page }) => {
      await page.setViewportSize({ width: mobile ? 390 : 1440, height: 1000 });
      await page.goto("/");
      await expect(page).toHaveURL((url) => url.pathname === "/fr");
      if (mobile) {
        await page.locator("#top header button[aria-expanded]:visible").click();
        await page.locator('#top header a[hreflang="en"]:visible').click();
      } else {
        await page.locator('header nav:has(> ul a[hreflang="en"]) > button').first().click();
        await page.locator('header a[hreflang="en"]').first().click();
      }
      await expect(page).toHaveURL((url) => url.pathname === "/");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page).toHaveURL((url) => url.pathname === "/");
    });
  }

  test("legal page language selection persists to the homepage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/fr/privacy");
    await page.locator('header nav:has(> ul a[hreflang="en"]) > button').first().click();
    await page.locator('header a[hreflang="en"]').first().click();
    await expect(page).toHaveURL((url) => url.pathname === "/privacy");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goto("/");
    await expect(page).toHaveURL((url) => url.pathname === "/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
