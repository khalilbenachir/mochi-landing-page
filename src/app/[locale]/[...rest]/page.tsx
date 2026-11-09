import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";

type CatchAllPageProps = {
  params: Promise<{ locale: AppLocale; rest: string[] }>;
};

export async function generateMetadata({ params }: CatchAllPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
