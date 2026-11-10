import { expect, test } from "@playwright/test";
import { BLOG_POSTS } from "../../src/features/blog/content/catalog";
import { articleParagraphText, getArticleCopy } from "../../src/features/blog/content/copy";
import { BLOG_LOCALES, blogRoutes } from "../../src/features/blog/locales";
import { localePath, localeRoutePath, routing } from "../../src/i18n/routing";

for (const preferred of routing.locales.filter((locale) => locale !== "en")) {
  test(`canonical English pages ignore ${preferred} browser and cookie preferences`, async ({ request }) => {
    for (const path of ["/", "/privacy", "/terms"]) {
      const preferenceHeaders: Record<string, string>[] = [
        { "Accept-Language": preferred },
        { "Accept-Language": "en", Cookie: `NEXT_LOCALE=${preferred}` },
        { "Accept-Language": preferred, Cookie: `NEXT_LOCALE=${preferred}` },
      ];
      for (const headers of preferenceHeaders) {
        const response = await request.get(path, { headers, maxRedirects: 0 });
        expect(response.status(), `${path}: ${JSON.stringify(headers)}`).toBe(200);
        expect(response.headers().location).toBeUndefined();
        expect(await response.text()).toContain('<html lang="en"');
      }
    }
  });
}

test("explicit locale switching preserves home and legal routes and returns to English", async ({ page }) => {
  for (const slug of ["", "privacy", "terms"]) {
    await page.goto(slug ? `/${slug}` : "/");
    for (const locale of [...routing.locales.filter((locale) => locale !== "en"), "en"] as const) {
      const option = page.locator(`header a[hreflang="${locale}"]`).first();
      await page.locator(`header nav:has(> ul a[hreflang="${locale}"]) > button`).first().click();
      await option.click();
      await expect(page).toHaveURL((url) => url.pathname === (slug ? localeRoutePath(locale, slug) : localePath(locale)));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    }
  }
});

for (const locale of BLOG_LOCALES) {
  test(`${locale} privacy guide exposes the localized contextual link without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      const post = BLOG_POSTS.find(({ id }) => id === "privacy")!;
      const copy = getArticleCopy(post, locale);
      await page.goto(blogRoutes(locale).post(post.slug));
      const paragraph = page.locator("#a-checklist-to-keep > p").first();
      await expect(paragraph).toHaveText(articleParagraphText(copy.sections["a-checklist-to-keep"]!.paragraphs!.first!));
      const link = paragraph.locator("a");
      await expect(link).toHaveAttribute("href", blogRoutes(locale).post("period-app-vs-calendar"));
      await link.click();
      await expect(page).toHaveURL((url) => url.pathname === blogRoutes(locale).post("period-app-vs-calendar"));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
    } finally {
      await context.close();
    }
  });

  test(`${locale} privacy summary and FAQ agree with metadata and structured data`, async ({ page }) => {
    const post = BLOG_POSTS.find(({ id }) => id === "privacy")!;
    const copy = getArticleCopy(post, locale);
    await page.goto(blogRoutes(locale).post(post.slug));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", copy.description);
    await expect(page.locator("article header > p")).toHaveText(copy.description);
    const graphs = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.flatMap((script) => JSON.parse(script.textContent ?? "{}")["@graph"] ?? []));
    const article = graphs.find((node) => node["@type"] === "BlogPosting");
    expect(article.description).toBe(copy.description);
    const faq = graphs.find((node) => node["@type"] === "FAQPage");
    const privateFaq = copy.faq.private!;
    const answer = faq.mainEntity.find((item: { name: string }) => item.name === privateFaq.question).acceptedAnswer.text;
    expect(answer).toBe(privateFaq.answer);
    const question = page.locator("details").filter({ has: page.locator("summary", { hasText: privateFaq.question }) });
    await question.locator("summary").click();
    await expect(question.locator("p")).toHaveText(answer);
  });
}
