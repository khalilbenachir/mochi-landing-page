import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { getLandingFaqItems } from "@/features/landing/content/faq";
import { Heart, Rays } from "@/features/landing/components/shared/decor";
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
          <div className="relative mb-12 ml-40 mt-52 w-170 shrink-0 max-poster:hidden" aria-hidden="true">
            <Image className="h-auto w-full" src={LANDING_ASSETS.faces.wondering} alt="" width={460} height={368} sizes="14vw" />
            <Heart className="absolute bottom-10 -right-6 w-38 [filter:drop-shadow(0_calc(1*var(--spacing))_0_var(--color-faq-heart-shadow))] -rotate-8 text-faq-heart" />
            <Rays shape="faq" className="absolute left-140 -top-12 w-34 text-sun-ray" />
            <span className="absolute left-165 top-6 text-faq-question-text text-u-38 font-max leading-none rotate-12">?</span>
          </div>
        </div>

        <FaqAccordion items={items} />
      </PosterStage>
    </section>
  );
}
