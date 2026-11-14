import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { blogPath, isBlogLocale, parseBlogRoute } from "@/features/blog/locales";
import { routing } from "@/i18n/routing";

// Only the arrival homepage negotiates language. Content URLs remain explicit.
const homepageMiddleware = createMiddleware({ ...routing, localeDetection: true });
const localizedMiddleware = createMiddleware({ ...routing, localeDetection: false });
// Reading an English content link must not reset the visitor's saved choice.
const englishMiddleware = createMiddleware({ ...routing, localeDetection: false, localeCookie: false });
// Blog URLs carry their language explicitly: no cookie or Accept-Language redirect, and no
// hreflang header advertising translations that may not exist (pages emit their own alternates).
const blogMiddleware = createMiddleware({ ...routing, localeDetection: false, alternateLinks: false });
const englishBlogMiddleware = createMiddleware({ ...routing, localeDetection: false, localeCookie: false, alternateLinks: false });

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const response = homepageMiddleware(request);
    // The same URL depends on per-visitor preferences, including when English renders.
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.append("Vary", "Accept-Language, Cookie");
    return response;
  }

  const prefix = request.nextUrl.pathname.split("/")[1];
  const hasLocalePrefix = routing.locales.some((locale) => locale === prefix);
  const blogRoute = parseBlogRoute(request.nextUrl.pathname);
  if (!blogRoute) return (hasLocalePrefix ? localizedMiddleware : englishMiddleware)(request);

  // A language without a published blog borrows the fallback blog instead of returning 404.
  // Temporary (307), so the localized URL can start serving once that translation ships.
  if (blogRoute.prefix && !isBlogLocale(blogRoute.prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = blogPath(blogRoute.prefix, ...blogRoute.rest);
    return NextResponse.redirect(url, 307);
  }
  return (hasLocalePrefix ? blogMiddleware : englishBlogMiddleware)(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
