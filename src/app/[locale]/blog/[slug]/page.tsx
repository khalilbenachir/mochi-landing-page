import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogArticlePage } from "@/features/blog/components/BlogArticlePage";
import { BLOG_POSTS, findBlogPost } from "@/features/blog/content/catalog";
import { BLOG_LOCALES } from "@/features/blog/locales";
import { articleMetadata, requireBlogLocale } from "@/features/blog/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return BLOG_LOCALES.flatMap((locale) => BLOG_POSTS.map(({ slug }) => ({ locale, slug })));
}

async function resolve(params: Props["params"]) {
  const { locale, slug } = await params;
  const blogLocale = requireBlogLocale(locale);
  const post = findBlogPost(slug);
  if (!post) notFound();
  return { locale: blogLocale, post };
}

export async function generateMetadata({ params }: Props) {
  const { locale, post } = await resolve(params);
  return articleMetadata(post, locale);
}

export default async function Page({ params }: Props) {
  const { locale, post } = await resolve(params);
  setRequestLocale(locale);
  return <BlogArticlePage post={post} />;
}
