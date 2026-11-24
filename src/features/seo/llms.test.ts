import { describe, expect, it } from "vitest";
import { BLOG_POSTS, BLOG_TOPICS } from "@/features/blog/content/catalog";
import { blogRoutes } from "@/features/blog/locales";
import { buildLlmsTxt } from "./llms";

describe("llms.txt", () => {
  const text = buildLlmsTxt();

  it("starts with the llmstxt.org title and summary", () => {
    expect(text.startsWith("# Mochi\n\n> ")).toBe(true);
  });

  it("links every topic hub and every published guide", () => {
    const routes = blogRoutes("en");
    for (const topic of BLOG_TOPICS) expect(text).toContain(`${routes.topic(topic)})`);
    for (const post of BLOG_POSTS) expect(text).toContain(`${routes.post(post.slug)})`);
  });

  it("contains no unresolved message placeholders", () => {
    expect(text).not.toMatch(/undefined|\{[a-z]+\}/);
  });
});
