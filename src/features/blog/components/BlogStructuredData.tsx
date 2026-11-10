import { useTranslations } from "next-intl";
import { SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { BLOG_POSTS, type BlogPost } from "../content/catalog";
import { getArticleCopy } from "../content/copy";
import { useBlogLocale, useBlogRoutes } from "../i18n";

const PUBLISHER = { "@type": "Organization", name: SITE_NAME, url: SITE_URL } as const;

/** Absolute URLs for the request locale's blog. */
function useBlogUrls() {
  const routes = useBlogRoutes();
  return {
    blog: `${SITE_URL}${routes.index}`,
    author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}${routes.editorial}` } as const,
    post: (post: BlogPost) => `${SITE_URL}${routes.post(post.slug)}`,
  };
}

function JsonLd({ graph }: { graph: object[] }) {
  const data = { "@context": "https://schema.org", "@graph": graph };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Article page: the post, its breadcrumb, and the same questions shown in its visible FAQ. */
export function BlogStructuredData({ post }: { post: BlogPost }) {
  const t = useTranslations("Blog");
  const locale = useBlogLocale();
  const urls = useBlogUrls();
  const copy = getArticleCopy(post, locale);
  const url = urls.post(post);
  return (
    <JsonLd
      graph={[
        {
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          headline: copy.title,
          description: copy.description,
          image: `${SITE_URL}${post.image}`,
          datePublished: post.publishedAt,
          inLanguage: locale,
          articleSection: t(`categories.${post.category}`),
          isPartOf: { "@id": `${urls.blog}#blog` },
          author: urls.author,
          publisher: PUBLISHER,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: t("navigation"), item: urls.blog },
            { "@type": "ListItem", position: 2, name: copy.title, item: url },
          ],
        },
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          url,
          inLanguage: locale,
          mainEntity: Object.values(copy.faq).map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        },
      ]}
    />
  );
}

/** Blog index: the Blog and an ordered list of its posts, in the order the page shows them. */
export function BlogIndexStructuredData() {
  const t = useTranslations("Blog");
  const locale = useBlogLocale();
  const urls = useBlogUrls();
  return (
    <JsonLd
      graph={[
        {
          "@type": "Blog",
          "@id": `${urls.blog}#blog`,
          url: urls.blog,
          name: t("title"),
          description: t("description"),
          inLanguage: locale,
          publisher: PUBLISHER,
          blogPost: BLOG_POSTS.map((post) => {
            const copy = getArticleCopy(post, locale);
            return {
              "@type": "BlogPosting",
              "@id": `${urls.post(post)}#article`,
              url: urls.post(post),
              headline: copy.title,
              description: copy.description,
              image: `${SITE_URL}${post.image}`,
              datePublished: post.publishedAt,
              author: urls.author,
            };
          }),
        },
        {
          "@type": "ItemList",
          "@id": `${urls.blog}#posts`,
          numberOfItems: BLOG_POSTS.length,
          itemListElement: BLOG_POSTS.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: urls.post(post),
            name: getArticleCopy(post, locale).title,
          })),
        },
      ]}
    />
  );
}
