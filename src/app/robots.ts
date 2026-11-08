import type { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/features/landing/content/landing";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(PUBLIC_SITE_URL ? { sitemap: `${PUBLIC_SITE_URL}/sitemap.xml`, host: PUBLIC_SITE_URL } : {}),
  };
}
