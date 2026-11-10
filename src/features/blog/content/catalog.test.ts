import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import en from "../../../../messages/en.json";
import { EDITORIAL_SOURCE_URLS } from "@/lib/editorial-sources";
import { BLOG_LOCALES } from "../locales";
import { BLOG_ART_SIZE, BLOG_CATEGORIES, BLOG_PATHS, BLOG_POSTS, FEATURED_POST, findBlogPost, relatedPosts } from "./catalog";
import { articleParagraphText, articleReadingMinutes, articleSourceIds, getArticleCopy, getArticleSection, parseArticleParagraph } from "./copy";

describe("blog catalog", () => {
  it("preserves paragraph text and counts translated link labels without link metadata", () => {
    const paragraph = parseArticleParagraph(["Read our ", { postId: "methods", label: "app and calendar comparison" }, " before choosing."]);
    expect(articleParagraphText(paragraph)).toBe("Read our app and calendar comparison before choosing.");
    expect(articleParagraphText("Existing plain paragraph.")).toBe("Existing plain paragraph.");
    expect(() => parseArticleParagraph([{ postId: "missing", label: "A guide" }])).toThrow("Unknown article link target");
    expect(() => parseArticleParagraph([{ postId: "methods", label: " " }])).toThrow("Missing article link label");
  });

  for (const locale of BLOG_LOCALES) {
    it(`links the ${locale} privacy checklist to the comparison guide`, () => {
      const post = BLOG_POSTS.find(({ id }) => id === "privacy")!;
      const paragraph = getArticleSection(post, "a-checklist-to-keep", locale).paragraphs!.first!;
      expect(Array.isArray(paragraph)).toBe(true);
      if (typeof paragraph === "string") throw new Error("Missing contextual guide link");
      const links = paragraph.filter((part) => typeof part !== "string");
      expect(links).toHaveLength(1);
      expect(links[0]?.postId).toBe("methods");
      expect(links[0]?.label.trim()).toBeTruthy();
      expect(articleParagraphText(paragraph)).not.toContain("[object Object]");
    });
  }

  it("resolves published slugs and rejects unknown or reserved slugs", () => {
    expect(new Set(BLOG_PATHS).size).toBe(BLOG_PATHS.length);
    for (const post of BLOG_POSTS) expect(findBlogPost(post.slug)).toBe(post);
    expect(findBlogPost("editorial-policy")).toBeUndefined();
    expect(findBlogPost("missing-article")).toBeUndefined();
  });

  it("orders posts newest first and features at most one", () => {
    const dates = BLOG_POSTS.map((post) => post.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(BLOG_POSTS.filter((post) => post.featured).length).toBeLessThanOrEqual(1);
    expect(FEATURED_POST).toBeDefined();
  });

  it("relates same-category posts first and never the post itself", () => {
    for (const post of BLOG_POSTS) {
      const related = relatedPosts(post);
      expect(related).toHaveLength(Math.min(3, BLOG_POSTS.length - 1));
      expect(related).not.toContain(post);
      const sameCategory = BLOG_POSTS.filter((candidate) => candidate !== post && candidate.category === post.category).length;
      related.slice(0, Math.min(sameCategory, 3)).forEach((candidate) => expect(candidate.category).toBe(post.category));
    }
  });

  it("labels every category and every editorial source", () => {
    for (const category of BLOG_CATEGORIES) expect(en.Blog.categories[category]).toBeTruthy();
    for (const id of Object.keys(EDITORIAL_SOURCE_URLS)) expect(en.Blog.sources).toHaveProperty(id);
  });

  for (const post of BLOG_POSTS) {
    it(`ships optimized artwork for ${post.id}`, () => {
      const file = path.join(process.cwd(), "public", post.image);
      expect(existsSync(file)).toBe(true);
      const bytes = readFileSync(file);
      expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
      expect(bytes.length).toBeLessThan(100_000);
      expect(BLOG_ART_SIZE).toEqual({ width: 1200, height: 800 });
      expect(new Date(post.publishedAt).toISOString().slice(0, 10)).toBe(post.publishedAt);
      for (const id of articleSourceIds(post)) expect(EDITORIAL_SOURCE_URLS[id]).toMatch(/^(https:\/\/|\/)/);
    });

    for (const locale of BLOG_LOCALES) {
      it(`publishes complete ${locale} copy for ${post.id}`, () => {
        const copy = getArticleCopy(post, locale);
        expect(copy.title.length).toBeGreaterThan(10);
        expect(copy.description.length).toBeGreaterThan(20);
        expect(copy.imageAlt).toBeTruthy();
        expect(post.sections.map(({ id }) => id).sort()).toEqual(Object.keys(copy.sections).sort());
        expect(new Set(post.sections.map(({ id }) => id)).size).toBe(post.sections.length);
        for (const { id } of post.sections) {
          const section = getArticleSection(post, id, locale);
          expect(section.title).toBeTruthy();
          expect(Object.keys(section.paragraphs ?? {}).length + Object.keys(section.items ?? {}).length).toBeGreaterThan(0);
          for (const row of section.table?.rows ?? []) expect(row).toHaveLength(section.table!.columns.length);
        }
        expect(articleReadingMinutes(post, locale)).toBeGreaterThan(0);
        expect(Object.keys(copy.faq).length).toBeGreaterThan(0);
      });
    }
  }

  it("discloses the publisher and clinical review status", () => {
    expect(en.Blog.articleNotice).toContain("has not been reviewed by a clinician");
    expect(en.Blog.editorial.sections.editing.body).toContain("AI assistance");
    expect(en.Blog.commercialNote).toContain("makes the app");
  });
});
