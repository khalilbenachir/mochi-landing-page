import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { blogPath, isBlogLocale, parseBlogRoute } from "@/features/blog/locales";
import { routing } from "@/i18n/routing";

// The URL selects the language; browser preferences and saved cookies must not redirect it.
const localizedMiddleware = createMiddleware({ ...routing, localeDetection: false });
// Blog URLs carry their language explicitly: no cookie or Accept-Language redirect, and no
// hreflang header advertising translations that may not exist (pages emit their own alternates).
const blogMiddleware = createMiddleware({ ...routing, localeDetection: false, alternateLinks: false });

export default function middleware(request: NextRequest) {
  const blogRoute = parseBlogRoute(request.nextUrl.pathname);
  if (!blogRoute) return localizedMiddleware(request);

  // A language without a published blog borrows the fallback blog instead of returning 404.
  // Temporary (307), so the localized URL can start serving once that translation ships.
  if (blogRoute.prefix && !isBlogLocale(blogRoute.prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = blogPath(blogRoute.prefix, ...blogRoute.rest);
    return NextResponse.redirect(url, 307);
  }
  return blogMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
