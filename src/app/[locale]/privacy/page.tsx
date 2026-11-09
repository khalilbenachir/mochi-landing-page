import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { legalPageMetadata } from "@/features/legal/metadata";
import { PrivacyPage } from "@/features/privacy/components/PrivacyPage";
import { routing, type AppLocale } from "@/i18n/routing";

type PrivacyPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return legalPageMetadata(locale, "privacy");
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <PrivacyPage />;
}
