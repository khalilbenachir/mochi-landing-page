import { expect, test } from "@playwright/test";
import en from "../../messages/en.json";
import { BLOG_PATHS, BLOG_POSTS, type BlogPost, type BlogPostId } from "../../src/features/blog/content/catalog";
import { articleReadingMinutes, getArticleCopy as getLocalizedArticleCopy } from "../../src/features/blog/content/copy";
import { NEWSLETTER_RECIPIENT } from "../../src/features/blog/content/newsletter";
import { BLOG_LOCALES, blogLocaleFor, blogPath, EDITORIAL_SLUG, isBlogLocale } from "../../src/features/blog/locales";
import { localePath, localeRoutePath, routing } from "../../src/i18n/routing";
import { EDUCATION_FAQ } from "../../src/features/landing/content/education-faq";
import { FAQ_IDS } from "../../src/features/landing/content/landing";
import { baseOrigin } from "./origin";
import { waitForPageAssets } from "./assets";

const getArticleCopy = (post: BlogPost) => getLocalizedArticleCopy(post, "en");
const postById = (id: BlogPostId) => BLOG_POSTS.find((post) => post.id === id)!;
const titleOf = (id: BlogPostId) => getArticleCopy(postById(id)).title;

for (const path of BLOG_PATHS) {
  test(`published English page: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers().link ?? "").not.toContain('hreflang="fr"');
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("body > footer")).toHaveCount(1);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute("href", `${baseOrigin}${path}`);
    expect(await page.locator('head link[rel="alternate"][hreflang]').evaluateAll((links) => links.map((link) => link.getAttribute("hreflang")).sort())).toEqual([...BLOG_LOCALES, "x-default"].sort());
    await expect(page.locator('header a[href="/blog"][aria-current="page"]:visible')).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

for (const post of BLOG_POSTS) {
  test(`article content and structured data agree: ${post.slug}`, async ({ page }) => {
    await page.goto(`/blog/${post.slug}`);
    const copy = getArticleCopy(post);
    await expect(page.locator("h1")).toHaveText(copy.title);
    await expect(page.locator("article time")).toHaveAttribute("datetime", post.publishedAt);
    await expect(page.locator("article header").getByText(en.Blog.readTime.replace("{minutes}", String(articleReadingMinutes(post, "en"))), { exact: true })).toBeVisible();
    await expect(page.getByText(en.Blog.articleNotice, { exact: true })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="related-posts"] article')).toHaveCount(3);
    for (const { id } of post.sections) await expect(page.locator(`section[id="${id}"]`)).toBeVisible();
    const graph = await page.locator('script[type="application/ld+json"]').evaluate((script) => JSON.parse(script.textContent ?? "{}"));
    const article = graph["@graph"].find((node: { "@type": string }) => node["@type"] === "BlogPosting");
    expect(article.headline).toBe(copy.title);
    expect(article.datePublished).toBe(post.publishedAt);
    expect(article).not.toHaveProperty("dateModified");
    expect(article.author).toEqual({ "@type": "Organization", name: "Mochi", url: `${baseOrigin}/blog/editorial-policy` });
    expect(article.mainEntityOfPage["@id"]).toBe(`${baseOrigin}/blog/${post.slug}`);
    expect(article.isPartOf["@id"]).toBe(`${baseOrigin}/blog#blog`);

    // The FAQPage carries exactly the questions and answers the article shows, in order.
    const faq = graph["@graph"].find((node: { "@type": string }) => node["@type"] === "FAQPage");
    const questions = page.locator('section[aria-labelledby="article-questions"] details');
    const visible = await questions.evaluateAll((items) => items.map((item) => ({
      question: item.querySelector("summary span")?.textContent ?? "",
      answer: item.querySelector("p")?.textContent ?? "",
    })));
    expect(visible).toEqual(Object.values(copy.faq));
    expect(faq["@id"]).toBe(`${baseOrigin}/blog/${post.slug}#faq`);
    expect(faq.mainEntity).toEqual(visible.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })));
  });
}

test("blog index structured data lists every published post in page order", async ({ page }) => {
  await page.goto("/blog");
  const graph = await page.locator('script[type="application/ld+json"]').evaluate((script) => JSON.parse(script.textContent ?? "{}"));
  const blog = graph["@graph"].find((node: { "@type": string }) => node["@type"] === "Blog");
  const list = graph["@graph"].find((node: { "@type": string }) => node["@type"] === "ItemList");
  const urls = BLOG_POSTS.map((post) => `${baseOrigin}/blog/${post.slug}`);
  expect(blog["@id"]).toBe(`${baseOrigin}/blog#blog`);
  expect(blog.name).toBe(en.Blog.title);
  expect(blog.blogPost.map((post: { url: string }) => post.url)).toEqual(urls);
  for (const [index, post] of BLOG_POSTS.entries()) {
    expect(blog.blogPost[index].headline).toBe(getArticleCopy(post).title);
    expect(blog.blogPost[index].datePublished).toBe(post.publishedAt);
  }
  expect(list.numberOfItems).toBe(BLOG_POSTS.length);
  expect(list.itemListElement).toEqual(BLOG_POSTS.map((post, index) => ({
    "@type": "ListItem", position: index + 1, url: urls[index], name: getArticleCopy(post).title,
  })));
  // Every listed post is linked from the visible page.
  for (const url of urls) await expect(page.locator(`main a[href="${new URL(url).pathname}"]`).first()).toBeAttached();
});

/** Index, editorial policy and one article: every kind of blog page. */
const ROUTED_PAGES = [[], [EDITORIAL_SLUG], [BLOG_POSTS[0]!.slug]];

for (const locale of routing.locales) {
  test(`blog routing in ${locale}: ${isBlogLocale(locale) ? "serves its own blog" : "redirects to the fallback blog"}`, async ({ request }) => {
    for (const segments of ROUTED_PAGES) {
      const requested = ["", locale, "blog", ...segments].join("/");
      const expected = blogPath(locale, ...segments);

      // One hop at most: /en/blog drops its default prefix, unpublished languages borrow the fallback.
      const first = await request.get(requested, { maxRedirects: 0 });
      if (requested === expected) {
        expect(first.status(), requested).toBe(200);
      } else {
        expect([307, 308], requested).toContain(first.status());
        expect(new URL(first.headers().location!, baseOrigin).pathname, requested).toBe(expected);
      }
      if (!isBlogLocale(locale)) expect(first.status(), `${requested} must stay temporary until translated`).toBe(307);

      const final = await request.get(requested);
      expect(final.status(), requested).toBe(200);
      expect(new URL(final.url()).pathname, requested).toBe(expected);
      expect(await final.text(), requested).toContain(`<html lang="${blogLocaleFor(locale)}"`);
    }

    const missing = await request.get(`/${locale}/blog/missing-article`);
    expect(missing.status()).toBe(404);
    expect(await missing.text()).toMatch(/name="robots" content="noindex/);
  });
}

test("every language shares the same header and footer navigation", async ({ page }) => {
  for (const locale of routing.locales) {
    await page.goto(localePath(locale));
    const header = page.locator("header nav").first();
    expect(await header.locator("a").evaluateAll((links) => links.map((link) => link.getAttribute("href"))), locale).toEqual([
      "#features",
      localeRoutePath(locale, "privacy"),
      blogPath(locale),
      "#faq",
    ]);
    const footerLinks = await page.locator("body > footer nav a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(footerLinks[0], locale).toBe(blogPath(locale));
    expect(footerLinks, locale).toHaveLength(4);

    await header.locator(`a[href="${blogPath(locale)}"]`).click();
    await expect(page, locale).toHaveURL((url) => url.pathname === blogPath(locale));
    await expect(page.locator("html")).toHaveAttribute("lang", blogLocaleFor(locale));
    // On the blog, section links return to that language's home page.
    const home = localePath(blogLocaleFor(locale));
    expect(await page.locator("header nav").first().locator("a").evaluateAll((links) => links.map((link) => link.getAttribute("href"))), locale).toEqual([
      `${home}#features`,
      localeRoutePath(blogLocaleFor(locale), "privacy"),
      blogPath(locale),
      `${home}#faq`,
    ]);
  }
});

test("blog is readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseOrigin}/blog/how-to-track-your-period`);
  await expect(page.locator("h1")).toHaveText(titleOf("tracking"));
  await expect(page.locator("#a-simple-example")).toContainText("29 days");
  await expect(page.locator("#article-sources")).toBeVisible();
  await context.close();
});

test("article language switching keeps the article in every language", async ({ page }) => {
  const slug = "how-to-track-your-period";
  for (const locale of routing.locales) {
    await page.goto(blogPath(routing.defaultLocale, slug));
    await page.getByRole("button", { name: "Change language, current: English" }).click();
    await page.locator(`header a[hreflang="${locale}"]:visible`).click();
    await expect(page, locale).toHaveURL((url) => url.pathname === blogPath(locale, slug));
    await expect(page.locator("html")).toHaveAttribute("lang", blogLocaleFor(locale));
  }
});

test("canonical English blog links ignore a previously selected language", async ({ request }) => {
  const response = await request.get("/blog", { headers: { Cookie: "NEXT_LOCALE=fr", "Accept-Language": "fr-FR" } });
  expect(response.status()).toBe(200);
  expect(new URL(response.url()).pathname).toBe("/blog");
  expect(await response.text()).toContain(en.Blog.title);
});

test("mobile menu reaches the blog and cards reach the articles", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: en.Navigation.openMenu }).click();
  await page.locator('header a[href="/blog"]:visible').click();
  await expect(page).toHaveURL((url) => url.pathname === "/blog");
  await page.getByRole("link", { name: titleOf("tracking"), exact: true }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/blog/how-to-track-your-period");
});

test("mobile Blog navigation retains its active state and hover treatment in every language", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of routing.locales) {
    const path = blogPath(locale);
    await page.goto(path);
    await page.locator('header button[aria-expanded]:visible').click();
    const link = page.locator(`header nav a[href="${path}"]:not([hreflang]):visible`);
    await expect(link).toHaveAttribute("aria-current", "page");
    await link.hover();
    await expect.poll(() => link.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
    await link.click();
    await expect(page).toHaveURL((url) => url.pathname === path);
    await expect(page.locator("html")).toHaveAttribute("lang", blogLocaleFor(locale));
  }
});

test("English homepage exposes four sourced education FAQs", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#faq button")).toHaveCount(FAQ_IDS.length + EDUCATION_FAQ.length);
  for (const item of Object.values(en.PeriodEducationFAQ.items)) {
    const button = page.getByRole("button", { name: item.question, exact: true });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(`[id="${await button.getAttribute("aria-controls")}"]`);
    await expect(panel.locator("p")).toHaveText(item.answer);
    await expect(panel.locator("a").first()).toBeVisible();
  }
  for (const locale of routing.locales) {
    await page.goto(localePath(locale));
    await expect(page.locator("#faq button"), locale).toHaveCount(locale === "en" ? FAQ_IDS.length + EDUCATION_FAQ.length : 4);
  }
});

test("Journal topic filters show only matching guides", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("button", { name: "Period care", exact: true }).click();
  await expect(page.locator("main article:visible")).toHaveCount(1);
  await expect(page.getByRole("link", { name: titleOf("pads"), exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("1 guide");
  await page.getByRole("button", { name: "Symptoms & moods", exact: true }).click();
  await expect(page.locator("main article:visible")).toHaveCount(2);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator("main article:visible")).toHaveCount(BLOG_POSTS.length);
  await expect(page.locator('main input[type="email"]')).toHaveCount(1);
});

test("Journal topic filters are shareable through the URL", async ({ page }) => {
  await page.goto("/blog?category=period-care");
  await expect(page.getByRole("button", { name: "Period care", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("main article:visible")).toHaveCount(1);
  await page.getByRole("button", { name: "Privacy", exact: true }).click();
  await expect(page).toHaveURL((url) => url.searchParams.get("category") === "privacy");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/blog" && !url.search);
});

test("each article has its own generated social card", async ({ page, request }) => {
  const post = postById("pads");
  await page.goto(`/blog/${post.slug}`);
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const url = await page.locator(selector).first().getAttribute("content");
    expect(url, selector).toContain(`/blog/${post.slug}/`);
    const response = await request.get(new URL(url!).pathname + new URL(url!).search);
    expect(response.status(), selector).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  }
});

test("newsletter validates email and opens a subscription request to the supplied inbox", async ({ page }) => {
  await page.goto("/blog");
  const form = page.getByRole("form", { name: en.Blog.newsletter.submitLabel });
  const email = form.getByRole("textbox", { name: en.Blog.newsletter.emailLabel });
  await email.fill("not-an-email");
  await form.getByRole("button", { name: en.Blog.newsletter.submitLabel }).click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await expect(form.getByRole("status")).toHaveCount(0);
  await expect(form).toContainText(en.Blog.newsletter.emailNote);
  // Capture the external-protocol handoff without launching or sending email.
  await page.evaluate(() => { window.open = (url) => { document.documentElement.dataset.emailRequest = String(url); return null; }; });
  await email.fill("reader+guides@example.com");
  await form.getByRole("button", { name: en.Blog.newsletter.submitLabel }).click();
  await expect(form.getByRole("status")).toHaveText(en.Blog.newsletter.requestMessage);
  const href = await form.getByRole("link", { name: en.Blog.newsletter.openEmailLabel }).getAttribute("href");
  const request = new URL(href!);
  expect(request.protocol).toBe("mailto:");
  expect(request.pathname).toBe(NEWSLETTER_RECIPIENT);
  expect(request.searchParams.get("subject")).toBe(en.Blog.newsletter.subject);
  expect(request.searchParams.get("body")).toBe(en.Blog.newsletter.requestBody.replace("{email}", "reader+guides@example.com"));
  expect(await page.locator("html").getAttribute("data-email-request")).toBe(href);
  await expect(page).toHaveURL((url) => url.pathname === "/blog" && !url.search);
});

test("article contents, copy link and native questions work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/blog/how-often-to-change-your-pad");
  const contents = page.getByRole("navigation", { name: en.Blog.onThisPage, exact: true });
  await contents.getByRole("link", { name: "Day pads", exact: true }).click();
  await expect(page).toHaveURL((url) => url.hash === "#day-pads");
  await page.getByRole("button", { name: en.Blog.copyLink }).click();
  await expect(page.getByRole("status")).toHaveText(en.Blog.copiedLink);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseOrigin}/blog/how-often-to-change-your-pad`);
  const questions = page.locator('details[name="faq-pads"]');
  await expect(questions.first()).toHaveAttribute("open", "");
  await questions.nth(1).locator("summary").click();
  await expect(questions.nth(1)).toHaveAttribute("open", "");
  await expect(questions.first()).not.toHaveAttribute("open");
});

test("mobile article contents can be expanded", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blog/how-often-to-change-your-pad");
  const button = page.getByRole("button", { name: en.Blog.onThisPage, exact: true });
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("navigation", { name: en.Blog.onThisPage, exact: true }).getByRole("link", { name: "Overnight pads", exact: true }).click();
  await expect(page).toHaveURL((url) => url.hash === "#overnight-pads");
});

test("blog pages remain within the viewport", async ({ page }) => {
  for (const width of [320, 390, 759, 800, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["/blog", "/blog/how-often-to-change-your-pad", "/blog/period-app-vs-calendar", "/blog/editorial-policy"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});

for (const viewport of [{ name: "desktop", width: 1440, height: 1200 }, { name: "phone", width: 390, height: 844 }]) {
  for (const [name, path] of [["index", "/blog"], ["article", "/blog/how-often-to-change-your-pad"], ["editorial", "/blog/editorial-policy"]]) {
    test(`visual: blog ${name} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(path!);
      await waitForPageAssets(page);
      await expect(page).toHaveScreenshot(`blog-${name}-${viewport.name}.png`, { fullPage: true, animations: "disabled" });
    });
  }
}
