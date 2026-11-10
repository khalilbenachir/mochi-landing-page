import type { MetadataRoute } from "next";
import { SITE_URL } from "@/features/landing/content/landing";
import { LEGAL_PAGE_SLUGS } from "@/features/legal/pages";
import { BLOG_PAGE_SEGMENTS, BLOG_POSTS } from "@/features/blog/content/catalog";
import { BLOG_LOCALES } from "@/features/blog/locales";
import { blogAlternates } from "@/features/blog/metadata";
import { localePath, localeRoutePath, routing, type AppLocale } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const localized = ["", ...LEGAL_PAGE_SLUGS].flatMap((slug) => {
    const urlFor = (locale: AppLocale) => `${SITE_URL}${slug ? localeRoutePath(locale, slug) : localePath(locale)}`;
    const languages = {
      ...Object.fromEntries(routing.locales.map((locale) => [locale, urlFor(locale)])),
      "x-default": urlFor(routing.defaultLocale),
    };

    return routing.locales.map((locale) => ({
      url: urlFor(locale),
      changeFrequency: "monthly" as const,
      priority: slug ? 0.3 : 1,
      alternates: { languages },
    }));
  });

  // One entry per published translation, sharing the alternates the pages declare.
  const blog: MetadataRoute.Sitemap = BLOG_PAGE_SEGMENTS.flatMap((segments) => {
    const post = BLOG_POSTS.find(({ slug }) => segments.length === 1 && segments[0] === slug);
    return BLOG_LOCALES.map((locale) => {
      const { canonical, languages } = blogAlternates(locale, segments);
      return {
        url: canonical,
        changeFrequency: "monthly" as const,
        priority: 0.5,
        alternates: { languages },
        ...(post ? { lastModified: post.publishedAt } : {}),
      };
    });
  });
  return [...localized, ...blog];
}
