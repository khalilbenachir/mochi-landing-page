import Image from "next/image";
import Link from "next/link";
import { Lightbulb, TriangleAlert } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { HeartOutline } from "@/features/landing/components/shared/decor";
import { FreeSticker } from "@/features/landing/components/shared/FreeSticker";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { SITE_URL } from "@/features/landing/content/landing";
import { sourceHref, type EditorialSourceId } from "@/lib/editorial-sources";
import { BLOG_ART_SIZE, BLOG_POSTS, relatedPosts, type BlogPost, type BlogSection } from "../content/catalog";
import { articleReadingMinutes, articleSourceIds, getArticleCopy, getArticleSection, type ArticleTable } from "../content/copy";
import { useBlogLocale, useBlogRoutes } from "../i18n";
import { BLOG_SEGMENT } from "../locales";
import { ArticleNavigation } from "./ArticleNavigation";
import { BlogArticle } from "./BlogArticle";
import { BlogCard } from "./BlogCard";
import { BlogCta } from "./BlogCta";
import { BlogShell } from "./BlogShell";
import { BlogStructuredData } from "./BlogStructuredData";
import { PostCard } from "./PostCard";

function useSourceLinks() {
  const t = useTranslations("Blog");
  const locale = useBlogLocale();
  return (ids: readonly EditorialSourceId[]) => ids.map((id) => ({ href: sourceHref(id, locale), label: t(`sources.${id}`) }));
}

/** A table on wide containers, a stacked list on narrow ones; both come from the same article data. */
function ArticleTableView({ table: { caption, columns, rows } }: { table: ArticleTable }) {
  return (
    <div className="@container mt-[18px] min-w-0">
      <div className="overflow-hidden rounded-[16px] border border-blog-border bg-white">
        <table className="hidden w-full border-collapse text-left text-[14px] leading-[1.4] @xl:table [&_th]:px-[14px] [&_th]:py-[10px] [&_th]:font-heavy [&_td]:px-[14px] [&_td]:py-[10px] [&_td]:align-top [&_tbody_tr]:border-t [&_tbody_tr]:border-blog-border">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-blog-lavender">
            <tr>
              {columns.map((text) => (
                <th key={text} scope="col">
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([heading, ...cells]) => (
              <tr key={heading}>
                <th scope="row">{heading}</th>
                {cells.map((text, index) => (
                  <td key={columns[index + 1]}>{text}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ol aria-label={caption} className="m-0 list-none p-0 text-[14px] leading-[1.5] @xl:hidden">
          {rows.map(([heading, ...cells]) => (
            <li key={heading} className="border-blog-border pb-[16px] [&+li]:border-t">
              <div className="bg-blog-lavender px-[16px] py-[12px] font-heavy text-ink-navy">{heading}</div>
              <dl className="space-y-[12px] px-[16px] pt-[12px]">
                {cells.map((text, index) => (
                  <div key={columns[index + 1]}>
                    <dt className="font-heavy">{columns[index + 1]}</dt>
                    <dd className="m-0 break-words">{text}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function ArticleHero({ post }: { post: BlogPost }) {
  const t = useTranslations("Blog");
  const format = useFormatter();
  const locale = useBlogLocale();
  const routes = useBlogRoutes();
  const copy = getArticleCopy(post, locale);
  const category = t(`categories.${post.category}`);

  return (
    <section className={post.tone} aria-labelledby="article-title">
      <BlogShell.Container className="grid grid-cols-[1.6fr_1fr] items-center gap-[20px] py-[22px] max-nav:grid-cols-1 max-nav:gap-0 max-phone:pt-[18px]">
        <BlogArticle.Header>
          <nav aria-label={t("back")} className="mb-[12px] flex gap-[9px] text-[14px] font-heavy">
            <Link href={routes.index} className="underline-offset-4 hover:underline">
              {t("navigation")}
            </Link>
            <span aria-hidden="true">/</span>
            <span>{category}</span>
          </nav>
          <BlogCard.Category>{category}</BlogCard.Category>
          <h1
            id="article-title"
            className="mt-[10px] wrap-anywhere text-pretty text-[44px] font-max leading-[1.03] tracking-[-0.03em] max-poster:text-[39px] max-phone:text-[34px]"
          >
            {copy.title}
          </h1>
          <p className="mt-[10px] text-[20px] font-semibold leading-[1.3] max-phone:text-[18px]">{copy.description}</p>
          <BlogArticle.Meta>
            <Image src={LANDING_ASSETS.appIcon} width={36} height={36} alt="" className="size-[36px] rounded-full" />
            <Link href={routes.editorial} className="font-heavy underline-offset-4 hover:underline">
              {t("byline")}
            </Link>
            <span aria-hidden="true">·</span>
            <span>
              {t("published")} <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), { dateStyle: "long", timeZone: "UTC" })}</time>
            </span>
            <span aria-hidden="true">·</span>
            <span>{t("readTime", { minutes: articleReadingMinutes(post, locale) })}</span>
          </BlogArticle.Meta>
        </BlogArticle.Header>
        <Image
          src={post.image}
          alt={copy.imageAlt}
          {...BLOG_ART_SIZE}
          priority
          sizes="(max-width: 760px) 320px, 420px"
          className="h-auto max-h-[270px] w-full object-contain max-nav:max-h-[200px] max-nav:max-w-[340px] max-nav:justify-self-center"
        />
      </BlogShell.Container>
    </section>
  );
}

function QuickAnswer({ intro }: { intro: string }) {
  const t = useTranslations("Blog");
  return (
    <section
      id="quick-answer"
      aria-labelledby="quick-answer-title"
      className="flex scroll-mt-[24px] items-start gap-[16px] rounded-[20px] bg-blog-pink px-[22px] py-[17px] max-phone:gap-[12px] max-phone:px-[16px]"
    >
      <Lightbulb aria-hidden="true" className="mt-[3px] size-[38px] shrink-0 text-mochi-pink-ink max-phone:size-[28px]" strokeWidth={1.7} />
      <div className="min-w-0 border-l border-mochi-pink-ink/25 pl-[16px] max-phone:pl-[12px]">
        <h2 id="quick-answer-title" className="text-[25px] font-max leading-[1.1] max-phone:text-[23px]">
          {t("quickAnswer")}
        </h2>
        <p className="mt-[4px] text-[16px] font-medium leading-[1.45]">{intro}</p>
      </div>
    </section>
  );
}

function ArticleSection({ post, section: { id, sources } }: { post: BlogPost; section: BlogSection }) {
  const t = useTranslations("Blog");
  const sourceLinks = useSourceLinks();
  const routes = useBlogRoutes();
  const section = getArticleSection(post, id, useBlogLocale());

  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <BlogArticle.Heading id={`${id}-title`}>{section.title}</BlogArticle.Heading>
      {Object.entries(section.paragraphs ?? {}).map(([key, text]) => (
        <p key={key}>
          {typeof text === "string"
            ? text
            : text.map((part, index) => {
                if (typeof part === "string") return part;
                const target = BLOG_POSTS.find(({ id }) => id === part.postId)!;
                return (
                  <Link key={index} href={routes.post(target.slug)} className="text-blog-link underline underline-offset-4">
                    {part.label}
                  </Link>
                );
              })}
        </p>
      ))}
      {section.items ? (
        <ul>
          {Object.entries(section.items).map(([key, text]) => (
            <li key={key}>{text}</li>
          ))}
        </ul>
      ) : null}
      {section.after ? <p>{section.after}</p> : null}
      {section.note ? <aside className="mt-[14px] rounded-[12px] bg-blog-pink px-[18px] py-[13px] text-[14px] leading-[1.45]">{section.note}</aside> : null}
      {section.table ? <ArticleTableView table={section.table} /> : null}
      {sources ? <BlogArticle.SectionSources label={`${t("sourceLabel")}: ${section.title}`} sources={sourceLinks(sources)} /> : null}
    </section>
  );
}

/** In-article app CTA: the companion Mochi pops over a violet card, next to the App Store badge. */
function ArticleCta() {
  const t = useTranslations("Blog");
  return (
    <section
      className="relative mt-[56px] grid grid-cols-[150px_1fr_auto] [--spacing:1px] items-center gap-x-[22px] rounded-[24px] bg-[linear-gradient(120deg,var(--color-island-band),var(--color-blog-cta-glow))] px-[26px] py-[22px] text-white [box-shadow:0_14px_30px_var(--color-blog-cta-shadow)] max-poster:grid-cols-[120px_1fr] max-poster:gap-y-[16px] max-nav:mt-[84px] max-nav:grid-cols-1 max-nav:justify-items-center max-nav:px-[20px] max-nav:pb-[24px] max-nav:pt-[78px] max-nav:text-center"
      aria-labelledby="article-cta-title"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]" aria-hidden="true">
        <div className="absolute -right-[60px] -top-[80px] size-[260px] rounded-full bg-[radial-gradient(closest-side,var(--color-blog-cta-light),transparent)]" />
        <HeartOutline className="absolute right-[34%] top-[14px] w-[22px] rotate-12 text-white/35 max-nav:hidden" strokeWidth={2.4} />
        <HeartOutline className="absolute bottom-[12px] left-[42%] w-[16px] -rotate-12 text-white/25" strokeWidth={2.4} />
      </div>
      <Image
        src="/blog-art/companion-mochi.webp"
        width={600}
        height={530}
        alt=""
        sizes="(max-width: 760px) 130px, 170px"
        className="relative z-1 -mt-[64px] -ml-[6px] h-auto w-[170px] max-w-none -rotate-6 animate-float [filter:drop-shadow(0_8px_10px_var(--color-blog-cta-shadow))] max-poster:w-[140px] max-nav:absolute max-nav:left-1/2 max-nav:top-[-62px] max-nav:m-0 max-nav:w-[130px] max-nav:-translate-x-1/2"
      />
      <div className="relative z-1 min-w-0">
        <h2 id="article-cta-title" className="text-pretty text-[26px] font-max leading-[1.1] tracking-[-0.02em] max-phone:text-[23px]">{t("inlineCtaTitle")}</h2>
        <p className="mt-[6px] max-w-[440px] text-[15px] font-semibold leading-[1.4] text-white/90 max-nav:mx-auto">{t("inlineCtaDescription")}</p>
      </div>
      <div className="relative z-1 flex items-center gap-[6px] max-poster:col-start-2 max-nav:col-start-1">
        <BlogCta.Store />
        <FreeSticker className="-ml-[10px] -mt-[34px] w-[62px] rotate-6 max-nav:hidden" rays={false} />
      </div>
    </section>
  );
}

function ArticleNotice() {
  const t = useTranslations("Blog");
  return (
    <aside className="mt-[14px] flex items-start gap-[12px] rounded-[14px] bg-journal-warning px-[20px] py-[14px] text-[14px] font-medium leading-[1.5]">
      <TriangleAlert aria-hidden="true" className="size-[24px] shrink-0 text-journal-warning-ink" />
      <p>{t("articleNotice")}</p>
    </aside>
  );
}

function ArticleQuestions({ post }: { post: BlogPost }) {
  const t = useTranslations("Blog");
  const copy = getArticleCopy(post, useBlogLocale());
  return (
    <section className="mt-[26px]" aria-labelledby="article-questions">
      <BlogArticle.Heading id="article-questions" className="mb-[14px]">
        {t("questionsHeading")}
      </BlogArticle.Heading>
      {Object.entries(copy.faq).map(([id, item], index) => (
        <details
          key={id}
          name={`faq-${post.id}`}
          open={index === 0}
          className="group/question mt-[5px] rounded-[14px] border border-blog-border bg-white px-[18px] [box-shadow:0_2px_5px_var(--color-blog-shadow)]"
        >
          <summary className="flex cursor-pointer items-start justify-between gap-[18px] py-[11px] text-[17px] font-heavy leading-[1.2] [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span aria-hidden="true" className="font-normal group-open/question:hidden">
              +
            </span>
            <span aria-hidden="true" className="hidden font-normal group-open/question:inline">
              −
            </span>
          </summary>
          <p className="pb-[14px] text-[15px] font-normal leading-[1.5] text-ink-slate">{item.answer}</p>
        </details>
      ))}
    </section>
  );
}

function ArticleSources({ post }: { post: BlogPost }) {
  const t = useTranslations("Blog");
  const sourceLinks = useSourceLinks();
  const routes = useBlogRoutes();
  return (
    <BlogArticle.Sources heading={t("sourcesToggle")} sources={sourceLinks(articleSourceIds(post))}>
      <p className="mt-[16px] text-[13px] font-normal leading-[1.5]">{t("commercialNote")}</p>
      <Link href={routes.editorial} className="mt-[10px] inline-block text-[13px] font-heavy underline underline-offset-4">
        {t("editorialLink")}
      </Link>
    </BlogArticle.Sources>
  );
}

function RelatedPosts({ post }: { post: BlogPost }) {
  const t = useTranslations("Blog");
  return (
    <BlogShell.Container className="pb-[32px] pt-[12px]">
      <section aria-labelledby="related-posts">
        <BlogArticle.Heading id="related-posts" className="mb-[22px]">
          {t("related")}
        </BlogArticle.Heading>
        <div className="grid grid-cols-3 gap-[22px] max-nav:grid-cols-1">
          {relatedPosts(post).map((item) => (
            <PostCard key={item.id} post={item} />
          ))}
        </div>
      </section>
    </BlogShell.Container>
  );
}

export function BlogArticlePage({ post }: { post: BlogPost }) {
  const t = useTranslations("Blog");
  const locale = useBlogLocale();
  const routes = useBlogRoutes();
  const copy = getArticleCopy(post, locale);
  const navigationItems = [
    { id: "quick-answer", label: t("quickAnswer") },
    ...post.sections.map(({ id }) => ({ id, label: getArticleSection(post, id, locale).title })),
  ];
  const shareLabels = {
    heading: t("onThisPage"),
    share: t("shareHeading"),
    copy: t("copyLink"),
    copied: t("copiedLink"),
    error: t("copyError"),
    x: t("shareX"),
    facebook: t("shareFacebook"),
    whatsApp: t("shareWhatsApp"),
  };

  return (
    <BlogShell.Root className="bg-white">
      <BlogStructuredData post={post} />
      <BlogShell.Header route={`/${BLOG_SEGMENT}/${post.slug}`} />
      <BlogArticle.Root>
        <ArticleHero post={post} />
        <BlogShell.Container>
          <BlogArticle.Layout>
            <ArticleNavigation items={navigationItems} title={copy.title} url={`${SITE_URL}${routes.post(post.slug)}`} labels={shareLabels} />
            <div className="min-w-0">
              <QuickAnswer intro={copy.intro} />
              <BlogArticle.Content>
                {post.sections.map((section) => (
                  <ArticleSection key={section.id} post={post} section={section} />
                ))}
              </BlogArticle.Content>
              <ArticleCta />
              <ArticleNotice />
              <ArticleQuestions post={post} />
              <ArticleSources post={post} />
            </div>
          </BlogArticle.Layout>
        </BlogShell.Container>
      </BlogArticle.Root>
      <RelatedPosts post={post} />
    </BlogShell.Root>
  );
}
