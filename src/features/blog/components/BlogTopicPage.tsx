import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Rays } from "@/features/landing/components/shared/decor";
import { cn } from "@/lib/utils";
import { BLOG_SEGMENT, TOPICS_SEGMENT } from "../locales";
import { useBlogRoutes } from "../i18n";
import { BLOG_ART_SIZE, BLOG_TOPICS, topicPosts, type BlogCategory } from "../content/catalog";
import { BlogShell } from "./BlogShell";
import { BlogTopicStructuredData } from "./BlogStructuredData";
import { PostCard } from "./PostCard";

/** A topic hub: a crawlable page per category with an answer-first intro and every guide in it. */
export function BlogTopicPage({ category }: { category: BlogCategory }) {
  const t = useTranslations("Blog");
  const routes = useBlogRoutes();
  const posts = topicPosts(category);
  const lead = posts[0];

  return (
    <BlogShell.Root>
      <BlogTopicStructuredData category={category} />
      <BlogShell.Header route={`/${BLOG_SEGMENT}/${TOPICS_SEGMENT}/${category}`} />
      <section className="overflow-hidden bg-hero-band text-white" aria-labelledby="topic-title">
        <BlogShell.Container className="grid grid-cols-[1.4fr_1fr] items-center gap-[32px] py-[30px] max-nav:grid-cols-1 max-nav:gap-[20px] max-nav:py-[26px]">
          <div>
            <nav aria-label={t("breadcrumb")} className="flex flex-wrap gap-[9px] text-[14px] font-heavy">
              <Link href={routes.index} className="underline-offset-4 hover:underline">
                {t("navigation")}
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{t(`categories.${category}`)}</span>
            </nav>
            <div className="relative mt-[18px] inline-flex">
              <span className="-rotate-6 rounded-full bg-ink-navy px-[18px] py-[6px] text-[17px] font-max uppercase leading-none">{t("topicEyebrow")}</span>
              <Rays shape="privacy" aria-hidden="true" className="absolute -right-[40px] -top-[6px] w-[32px] text-sun" />
            </div>
            <h1
              id="topic-title"
              className="mt-[18px] text-pretty text-[52px] font-max leading-[1.04] tracking-[-0.03em] max-poster:text-[44px] max-phone:text-[38px]"
            >
              {t(`topics.${category}.title`)}
            </h1>
            <p className="mt-[14px] max-w-[600px] text-[20px] font-bold leading-[1.35] max-phone:text-[18px]">{t(`topics.${category}.intro`)}</p>
            <p className="mt-[14px] text-[15px] font-heavy uppercase tracking-[0.04em] text-white/85">{t("guideCount", { count: posts.length })}</p>
          </div>
          {lead ? (
            <div
              className={cn(
                "rotate-2 overflow-hidden rounded-[28px] border-4 border-white [box-shadow:0_14px_30px_var(--color-blog-shadow)] max-nav:hidden",
                lead.tone,
              )}
            >
              <Image src={lead.image} {...BLOG_ART_SIZE} alt="" priority sizes="400px" className="h-auto w-full" />
            </div>
          ) : null}
        </BlogShell.Container>
      </section>
      <BlogShell.Container className="pb-[28px] pt-[32px]">
        <section aria-labelledby="topic-guides">
          <h2 id="topic-guides" className="sr-only">
            {t("guidesHeading")}
          </h2>
          <div className="grid grid-cols-3 gap-[22px] max-poster:grid-cols-2 max-nav:grid-cols-1 max-nav:gap-[16px]">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
        <TopicLinks current={category} />
      </BlogShell.Container>
    </BlogShell.Root>
  );
}

/** Links to every topic hub; used on hubs and on the blog index so each hub is one click from the blog. */
export function TopicLinks({ current }: { current?: BlogCategory }) {
  const t = useTranslations("Blog");
  const routes = useBlogRoutes();
  return (
    <nav
      aria-labelledby="topic-links"
      className="mt-[40px] rounded-[28px] bg-white px-[28px] py-[24px] [box-shadow:0_2px_3px_var(--color-blog-shadow)] max-phone:px-[20px]"
    >
      <h2 id="topic-links" className="text-[22px] font-max leading-[1.15]">
        {t("topicsHeading")}
      </h2>
      <ul className="mt-[14px] flex flex-wrap gap-[10px]">
        {BLOG_TOPICS.map((topic) => (
          <li key={topic}>
            <Link
              href={routes.topic(topic)}
              aria-current={topic === current ? "page" : undefined}
              className="inline-flex min-h-[44px] items-center rounded-full border border-blog-border px-[20px] py-[9px] text-[16px] font-heavy leading-[1.2] hover:border-mochi-pink-ink aria-[current=page]:border-ink-navy aria-[current=page]:bg-ink-navy aria-[current=page]:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink"
            >
              {t(`categories.${topic}`)}
            </Link>
          </li>
        ))}
        {current ? (
          <li>
            <Link
              href={routes.index}
              className="inline-flex min-h-[44px] items-center rounded-full px-[14px] py-[9px] text-[16px] font-heavy leading-[1.2] text-mochi-pink-ink underline-offset-4 hover:underline"
            >
              {t("back")}
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
