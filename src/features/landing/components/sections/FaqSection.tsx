import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { getLandingFaqItems } from "@/features/landing/content/faq";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { FaqAccordion } from "./FaqAccordion";

/** Section 7: the FAQ, the same questions as the FAQPage structured data. */
export async function FaqSection() {
  const locale = await getLocale();
  const [t, items] = await Promise.all([getTranslations("FAQ"), getLandingFaqItems(locale)]);

  return (
    <section id="faq" className="relative overflow-hidden bg-faq-band text-ink-navy">
      <PosterStage className="grid grid-cols-[calc(261*var(--spacing))_calc(717*var(--spacing))] max-poster:px-[clamp(16px,4vw,40px)] max-poster:grid-cols-1">
        <div className="relative flex flex-col items-start justify-start max-poster:mx-auto max-poster:w-full max-poster:max-w-[640px] max-poster:items-center max-poster:justify-center">
          <h2 className="ml-47 mt-12 text-ink-navy text-u-40 font-max leading-[0.96] tracking-[-0.015em] max-poster:m-0 max-poster:text-center max-poster:text-[clamp(36px,6.4vw,50px)] max-phone:text-[34px]">
            <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span> <span className="block max-poster:inline">{t("title3")}</span>
          </h2>
          <div className="relative mb-12 ml-56 mt-32 w-130 shrink-0 max-poster:hidden" aria-hidden="true">
            <Image className="h-auto w-full" src={LANDING_ASSETS.faqMochi} alt="" width={480} height={735} sizes="14vw" />
          </div>
        </div>

        <FaqAccordion items={items} />
      </PosterStage>
    </section>
  );
}
