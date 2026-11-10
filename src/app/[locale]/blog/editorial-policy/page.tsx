import { setRequestLocale } from "next-intl/server";
import { EditorialPolicyPage } from "@/features/blog/components/EditorialPolicyPage";
import { editorialMetadata, requireBlogLocale } from "@/features/blog/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return editorialMetadata(requireBlogLocale((await params).locale));
}

export default async function Page({ params }: Props) {
  setRequestLocale(requireBlogLocale((await params).locale));
  return <EditorialPolicyPage />;
}
