import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CalculatorPage } from "@/features/calculator/components/CalculatorPage";
import { calculatorMetadata } from "@/features/calculator/metadata";
import { routing, type AppLocale } from "@/i18n/routing";

type OvulationCalculatorPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: OvulationCalculatorPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return calculatorMetadata(locale, "ovulation");
}

export default async function OvulationCalculatorPage({ params }: OvulationCalculatorPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <CalculatorPage locale={locale} kind="ovulation" />;
}
