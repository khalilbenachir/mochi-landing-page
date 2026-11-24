import en from "../../../messages/en.json";
import { BLOG_TOPICS, topicPosts } from "@/features/blog/content/catalog";
import { getArticleCopy } from "@/features/blog/content/copy";
import { BLOG_LOCALES, blogRoutes, FALLBACK_BLOG_LOCALE } from "@/features/blog/locales";
import { calculatorPath } from "@/features/calculator/metadata";
import { SITE_ALTERNATE_NAMES, SITE_NAME, SITE_URL } from "@/features/landing/content/landing";
import { localeRoutePath, routing } from "@/i18n/routing";

/**
 * `/llms.txt` (llmstxt.org): a plain-Markdown map of the site for AI assistants and answer engines.
 * Built from the blog catalog and the English messages, so it never drifts from the published pages.
 */
export function buildLlmsTxt() {
  const routes = blogRoutes(FALLBACK_BLOG_LOCALE);
  const url = (path: string) => `${SITE_URL}${path}`;
  const faq = en.FAQ.items;
  const blog = en.Blog;

  const topics = BLOG_TOPICS.map((category) => {
    const topic = blog.topics[category];
    const posts = topicPosts(category).map((post) => {
      const copy = getArticleCopy(post, FALLBACK_BLOG_LOCALE);
      return `- [${copy.title}](${url(routes.post(post.slug))}): ${copy.description}`;
    });
    return [`### ${topic.title}`, "", `[Topic hub: ${topic.title}](${url(routes.topic(category))}): ${topic.intro}`, "", ...posts].join("\n");
  });

  return `# ${SITE_NAME}

> ${SITE_NAME} (also known as ${SITE_ALTERNATE_NAMES.join(", ")}) is a free, private period tracker app for iPhone. It predicts your next period, reminds you when to change your pad, logs moods and symptoms, and turns daily check-ins into a game with 12 collectible Mochi flavors. No account is needed, and cycle data stays on the iPhone unless the user turns on optional encrypted backup.

## Key facts

- ${faq.free.question} ${faq.free.answer}
- ${faq.private.question} ${faq.private.answer}
- ${faq.offline.question} ${faq.offline.answer}
- ${faq.medical.question} ${faq.medical.answer}
- Platform: iPhone (iOS). Languages: English, French, German, Spanish, Brazilian Portuguese, European Portuguese.

## Main pages

- [Home](${url("/")}): what Mochi does, features, privacy and FAQ.
- [Free period calculator](${url(calculatorPath(routing.defaultLocale))}): enter the first day of your last period, cycle length and period length to estimate your next 3 periods, ovulation day and fertile window.
- [Blog](${url(routes.index)}): sourced guides about the menstrual cycle, period care, symptoms and period tracker privacy.
- [Editorial policy](${url(routes.editorial)}): how guides are researched, sourced and updated.
- [Privacy policy](${url(localeRoutePath(routing.defaultLocale, "privacy"))}): what stays on the iPhone and how optional backup works.

## Guides by topic

${topics.join("\n\n")}

## Other languages

Every guide is also published in ${BLOG_LOCALES.filter((locale) => locale !== FALLBACK_BLOG_LOCALE).join(", ")}, at the same path with the language prefix (for example ${url(blogRoutes("fr").index)}).
`;
}
