import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Rays } from "@/features/landing/components/shared/decor";
import { BLOG_SEGMENT } from "../locales";
import { useBlogRoutes } from "../i18n";
import { BLOG_CATEGORIES, BLOG_POSTS, FEATURED_POST, JOURNAL_ART_SIZE } from "../content/catalog";
import { ALL_CATEGORIES } from "../content/filters";
import { BlogFilters } from "./BlogFilters";
import { BlogShell } from "./BlogShell";
import { BlogIndexStructuredData } from "./BlogStructuredData";
import { BlogNewsletter } from "./NewsletterBanner";
import { PostCard } from "./PostCard";

export function BlogIndexPage() {
  const t = useTranslations("Blog");
  const routes = useBlogRoutes();
  const options = [
    { id: ALL_CATEGORIES, label: t("allCategories"), count: BLOG_POSTS.length },
    ...BLOG_CATEGORIES.map((category) => ({
      id: category,
      label: t(`categories.${category}`),
      count: BLOG_POSTS.filter((post) => post.category === category).length,
    })).filter(({ count }) => count > 0),
  ].map(({ count, ...option }) => ({ ...option, resultText: t("guideCount", { count }) }));

  return (
    <BlogShell.Root>
      <BlogIndexStructuredData />
      <BlogShell.Header route={`/${BLOG_SEGMENT}`} />
      <section className="overflow-hidden bg-hero-band text-white" aria-labelledby="blog-title">
        <BlogShell.Container className="grid grid-cols-[1.3fr_1fr] items-center gap-[24px] pb-[8px] pt-[18px] max-nav:gap-[10px] max-phone:grid-cols-1 max-phone:pt-[26px]">
          <div className="pb-[30px] max-phone:pb-0">
            <div className="relative inline-flex">
              <span className="-rotate-6 rounded-full bg-ink-navy px-[20px] py-[7px] text-[20px] font-max uppercase leading-none">{t("eyebrow")}</span>
              <Rays shape="privacy" aria-hidden="true" className="absolute -right-[45px] -top-[6px] w-[38px] text-sun" />
            </div>
            <h1
              id="blog-title"
              className="mt-[22px] text-pretty text-[60px] font-max leading-[1.04] tracking-[-0.03em] max-poster:text-[48px] max-phone:text-[43px]"
            >
              {t("title")}
            </h1>
            <p className="mt-[14px] max-w-[570px] text-[24px] font-bold leading-[1.25] max-nav:text-[20px]">{t("description")}</p>
          </div>
          <Image
            src="/blog-art/journal-mochi.webp"
            {...JOURNAL_ART_SIZE}
            alt={t("heroAlt")}
            priority
            sizes="(max-width: 480px) 300px, 470px"
            className="-mb-[5px] h-auto w-full max-w-[470px] justify-self-center self-end max-phone:mt-[4px] max-phone:max-w-[300px]"
          />
        </BlogShell.Container>
      </section>
      <BlogShell.Container className="pb-[28px]">
        <BlogFilters.Root options={options} label={t("filterLabel")}>
          <BlogFilters.Tabs />
          {FEATURED_POST ? (
            <BlogFilters.Featured>
              <PostCard post={FEATURED_POST} featured />
            </BlogFilters.Featured>
          ) : null}
          <section aria-label={t("guidesHeading")}>
            <BlogFilters.Grid>
              {BLOG_POSTS.map((post) => (
                <BlogFilters.Item key={post.id} category={post.category} hideWhenAll={post === FEATURED_POST}>
                  <PostCard post={post} />
                </BlogFilters.Item>
              ))}
            </BlogFilters.Grid>
          </section>
        </BlogFilters.Root>
        <aside className="mt-[26px] text-center text-[14px] font-semibold text-blog-muted">
          <Link href={routes.editorial} className="underline underline-offset-4 hover:text-mochi-pink-ink">
            {t("editorialNote")} {t("editorialLink")}
          </Link>
        </aside>
      </BlogShell.Container>
      <BlogNewsletter />
    </BlogShell.Root>
  );
}
