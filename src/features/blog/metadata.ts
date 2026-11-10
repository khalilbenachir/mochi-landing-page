import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PUBLIC_SITE_URL, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { LOCALE_META } from "@/i18n/routing";
import type { BlogPost } from "./content/catalog";
import { getArticleCopy } from "./content/copy";
import { BLOG_LOCALES, blogPath, blogRoutes, EDITORIAL_SLUG, FALLBACK_BLOG_LOCALE, isBlogLocale, type BlogLocale } from "./locales";

/** Narrows the route locale, returning 404 for languages without published blog content. */
export function requireBlogLocale(locale: string): BlogLocale {
  if (!isBlogLocale(locale)) notFound();
  return locale;
}

/** Canonical URL plus every published translation of the same page (hreflang), with the fallback as x-default. */
export function blogAlternates(locale: BlogLocale, segments: readonly string[]) {
  const url = (target: BlogLocale) => `${SITE_URL}${blogPath(target, ...segments)}`;
  return {
    canonical: url(locale),
    languages: { ...Object.fromEntries(BLOG_LOCALES.map((target) => [target, url(target)])), "x-default": url(FALLBACK_BLOG_LOCALE) },
  };
}

type BlogMetadataInput = { locale: BlogLocale; segments: readonly string[]; title: string; description: string; post?: BlogPost };

function blogMetadata({ locale, segments, title, description, post }: BlogMetadataInput): Metadata {
  const alternates = blogAlternates(locale, segments);
  const author = `${SITE_URL}${blogRoutes(locale).editorial}`;
  // Articles get a generated card from their `opengraph-image` / `twitter-image` routes, which take precedence.
  const images = post ? undefined : [{ url: `${SITE_URL}${LANDING_ASSETS.socialCard}`, width: 1200, height: 630, alt: SITE_NAME }];
  return {
    ...(PUBLIC_SITE_URL ? { metadataBase: new URL(PUBLIC_SITE_URL) } : {}),
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: author }],
    publisher: SITE_NAME,
    alternates,
    robots: { index: true, follow: true },
    icons: { icon: "/icon.png", apple: "/apple-icon.png" },
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: SITE_NAME,
      locale: LOCALE_META[locale].ogLocale,
      ...(images ? { images } : {}),
      ...(post ? { type: "article" as const, publishedTime: post.publishedAt, authors: [author] } : { type: "website" as const }),
    },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images: images.map((image) => image.url) } : {}) },
  };
}

export async function blogIndexMetadata(locale: BlogLocale) {
  const t = await getTranslations({ locale, namespace: "Blog" });
  return blogMetadata({ locale, segments: [], title: t("metadataTitle"), description: t("metadataDescription") });
}

export async function editorialMetadata(locale: BlogLocale) {
  const t = await getTranslations({ locale, namespace: "Blog" });
  return blogMetadata({ locale, segments: [EDITORIAL_SLUG], title: `${t("editorial.title")} | ${SITE_NAME}`, description: t("editorial.description") });
}

export function articleMetadata(post: BlogPost, locale: BlogLocale) {
  const copy = getArticleCopy(post, locale);
  return blogMetadata({ locale, segments: [post.slug], title: `${copy.title} | ${SITE_NAME}`, description: copy.description, post });
}
