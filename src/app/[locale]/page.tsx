import { setRequestLocale } from "next-intl/server";
import { MaquetteLanding } from "@/components/maquette/MaquetteLanding";
import type { AppLocale } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MaquetteLanding />;
}
