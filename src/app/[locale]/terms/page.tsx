import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { legalPageMetadata } from "@/features/legal/metadata";
import { TermsPage } from "@/features/terms/components/TermsPage";
import { routing, type AppLocale } from "@/i18n/routing";

type TermsPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return legalPageMetadata(locale, "terms");
}

export default async function TermsOfUsePage({ params }: TermsPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <TermsPage />;
}
