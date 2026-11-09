import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { FAQ_IDS } from "@/features/landing/content/landing";
import { Heart, Rays } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { FaqAccordion } from "./FaqAccordion";

/** Section 7: the FAQ, the same questions as the FAQPage structured data. */
export function FaqSection() {
  const t = useTranslations("FAQ");

  return (
    <section id="faq" className="relative overflow-hidden bg-faq-band text-ink-navy">
      <PosterStage className="grid grid-cols-[calc(261*var(--spacing))_calc(717*var(--spacing))] max-poster:px-[clamp(16px,4vw,40px)] max-poster:grid-cols-1">
        <div className="relative max-poster:mx-auto max-poster:flex max-poster:min-h-0 max-poster:w-full max-poster:max-w-[640px] max-poster:items-start max-poster:justify-center">
          <h2 className="ml-47 mt-12 text-ink-navy text-u-40 font-max leading-[0.96] tracking-[-0.015em] max-poster:m-0 max-poster:text-center max-poster:text-[clamp(36px,6.4vw,50px)] max-phone:text-[34px]">
            <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span> <span className="relative block w-fit max-poster:inline">
              {t("title3")}
              <Rays shape="faq" className="absolute left-[calc(100%+10.36*var(--spacing))] top-[calc(7.2*var(--spacing))] w-36 text-sun-ray max-poster:hidden" />
              <span className="absolute left-[calc(100%+46.36*var(--spacing))] top-[calc(35.2*var(--spacing))] text-faq-question-text text-u-38 font-max leading-none rotate-12 max-poster:hidden" aria-hidden="true">?</span>
            </span>
          </h2>
          <div className="absolute -bottom-(--section-space) left-64 w-140 max-poster:static max-poster:w-0" aria-hidden="true">
            <Image className="h-auto w-full max-poster:hidden" src={LANDING_ASSETS.faces.wondering} alt="" width={460} height={368} sizes="14vw" />
            <Heart className="absolute bottom-10 -right-6 w-38 [filter:drop-shadow(0_calc(1*var(--spacing))_0_var(--color-faq-heart-shadow))] -rotate-8 text-faq-heart max-poster:hidden" />
          </div>
        </div>

        <FaqAccordion
          items={FAQ_IDS.map((id) => ({
            id,
            question: t(`items.${id}.question`),
            answer: t(`items.${id}.answer`),
          }))}
        />
      </PosterStage>
    </section>
  );
}
