import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/landing";
import { localePath, routing } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}${localePath(locale)}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
