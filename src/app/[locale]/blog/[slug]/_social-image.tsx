import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { PLATFORM_COLORS } from "@/app/platform-colors";
import { BLOG_POSTS, findBlogPost } from "@/features/blog/content/catalog";
import { getArticleCopy } from "@/features/blog/content/copy";
import { BLOG_LOCALES, isBlogLocale } from "@/features/blog/locales";

/** Shared by `opengraph-image.tsx` and `twitter-image.tsx`: one 1200×630 PNG card per article. */
export const socialImageSize = { width: 1200, height: 630 };

export function socialImageParams() {
  return BLOG_LOCALES.flatMap((locale) => BLOG_POSTS.map(({ slug }) => ({ locale, slug })));
}

export type SocialImageProps = { params: Promise<{ locale: string; slug: string }> };

export async function renderSocialImage({ params }: SocialImageProps) {
  const { locale, slug } = await params;
  const post = findBlogPost(slug);
  if (!isBlogLocale(locale) || !post) notFound();

  const [t, icon] = await Promise.all([
    getTranslations({ locale, namespace: "Blog" }),
    // next/og cannot decode WebP, so the card uses the PNG app icon.
    readFile(path.join(process.cwd(), "public/mochi/app-icon-512.png")),
  ]);
  const copy = getArticleCopy(post, locale);
  const colors = {
    background: PLATFORM_COLORS.socialCardBackground.value,
    ink: PLATFORM_COLORS.socialCardInk.value,
    accent: PLATFORM_COLORS.socialCardAccent.value,
  };

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: colors.background,
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain img elements */}
        <img src={`data:image/png;base64,${icon.toString("base64")}`} width={84} height={84} alt="" style={{ borderRadius: 42 }} />
        <div style={{ fontSize: 36, fontWeight: 800 }}>{t("title")}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex" }}>
          <div style={{ background: colors.ink, borderRadius: 999, padding: "8px 24px", fontSize: 28, fontWeight: 700 }}>
            {t(`categories.${post.category}`)}
          </div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1000 }}>{copy.title}</div>
      </div>
      <div style={{ display: "flex", height: 12, width: 160, borderRadius: 6, background: colors.accent }} />
    </div>,
    socialImageSize,
  );
}
