import { setRequestLocale } from "next-intl/server";
import { LandingPage } from "@/features/landing/components/LandingPage";
import type { AppLocale } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingPage />;
}
