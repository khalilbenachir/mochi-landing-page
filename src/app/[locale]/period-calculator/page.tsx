import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CalculatorPage } from "@/features/calculator/components/CalculatorPage";
import { calculatorMetadata } from "@/features/calculator/metadata";
import { routing, type AppLocale } from "@/i18n/routing";

type PeriodCalculatorPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: PeriodCalculatorPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return calculatorMetadata(locale);
}

export default async function PeriodCalculatorPage({ params }: PeriodCalculatorPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <CalculatorPage locale={locale} />;
}
