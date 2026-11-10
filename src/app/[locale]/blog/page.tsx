import { setRequestLocale } from "next-intl/server";
import { BlogIndexPage } from "@/features/blog/components/BlogIndexPage";
import { blogIndexMetadata, requireBlogLocale } from "@/features/blog/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return blogIndexMetadata(requireBlogLocale((await params).locale));
}

export default async function Page({ params }: Props) {
  setRequestLocale(requireBlogLocale((await params).locale));
  return <BlogIndexPage />;
}
