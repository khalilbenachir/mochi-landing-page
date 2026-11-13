import Image from "next/image";
import { Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import type { BlogPost } from "../content/catalog";
import { articleReadingMinutes, getArticleCopy } from "../content/copy";
import { useBlogLocale, useBlogRoutes } from "../i18n";
import { BlogCard } from "./BlogCard";

export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const t = useTranslations("Blog");
  const locale = useBlogLocale();
  const copy = getArticleCopy(post, locale);
  const href = useBlogRoutes().post(post.slug);
  const readTime = t("readTime", { minutes: articleReadingMinutes(post, locale) });

  return (
    <BlogCard.Root variant={featured ? "featured" : "standard"}>
      <BlogCard.Media src={post.image} alt={copy.imageAlt} tone={post.tone} contain priority={featured} />
      <BlogCard.Content>
        <BlogCard.Category>{t(`categories.${post.category}`)}</BlogCard.Category>
        <BlogCard.Title href={href} as={featured ? "h2" : "h3"}>
          {copy.title}
        </BlogCard.Title>
        {featured ? <p className="mt-[12px] text-[19px] font-medium leading-[1.4] text-ink-slate max-phone:text-[17px]">{copy.description}</p> : null}
        <BlogCard.Meta>
          {featured ? (
            <>
              <Image src={LANDING_ASSETS.faces.headerHappy} width={256} height={238} alt="" className="h-auto w-[38px]" />
              <span className="font-heavy">{t("byline")}</span>
              <span aria-hidden="true">·</span>
            </>
          ) : (
            <Clock3 aria-hidden="true" className="size-[17px] shrink-0" strokeWidth={1.7} />
          )}
          <span>{readTime}</span>
          {featured ? (
            <BlogCard.Action href={href} aria-label={`${t("readArticle")}: ${copy.title}`}>
              {t("readArticle")}
            </BlogCard.Action>
          ) : null}
        </BlogCard.Meta>
      </BlogCard.Content>
    </BlogCard.Root>
  );
}
