import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogTopicPage } from "@/features/blog/components/BlogTopicPage";
import { BLOG_TOPICS, isBlogTopic } from "@/features/blog/content/catalog";
import { BLOG_LOCALES } from "@/features/blog/locales";
import { requireBlogLocale, topicMetadata } from "@/features/blog/metadata";

type Props = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  return BLOG_LOCALES.flatMap((locale) => BLOG_TOPICS.map((category) => ({ locale, category })));
}

async function resolve(params: Props["params"]) {
  const { locale, category } = await params;
  const blogLocale = requireBlogLocale(locale);
  if (!isBlogTopic(category)) notFound();
  return { locale: blogLocale, category };
}

export async function generateMetadata({ params }: Props) {
  const { locale, category } = await resolve(params);
  return topicMetadata(category, locale);
}

export default async function Page({ params }: Props) {
  const { locale, category } = await resolve(params);
  setRequestLocale(locale);
  return <BlogTopicPage category={category} />;
}
