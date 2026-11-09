import type { MetadataRoute } from "next";
import { SITE_URL } from "@/features/landing/content/landing";
import { LEGAL_PAGE_SLUGS } from "@/features/legal/pages";
import { localePath, localeRoutePath, routing, type AppLocale } from "@/i18n/routing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...LEGAL_PAGE_SLUGS].flatMap((slug) => {
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
}
