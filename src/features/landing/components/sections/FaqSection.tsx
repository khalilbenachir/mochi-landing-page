import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { FAQ_IDS } from "@/features/landing/content/landing";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { FaqAccordion } from "@/features/landing/components/sections/FaqAccordion";

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M10 4 7 15" /><path d="M24 8 15 19" /><path d="M33 22 20 26" />
      </g>
    </svg>
  );
}

/** Section 7: the FAQ, the same questions as the FAQPage structured data. */
export function FaqSection() {
  const t = useTranslations("FAQ");

  return (
    <section id="faq" className="relative overflow-hidden bg-faq-band text-ink-navy">
      <PosterStage className="grid [grid-template-columns:calc(261*var(--u))_calc(717*var(--u))] max-poster:px-[clamp(16px,4vw,40px)] max-poster:[grid-template-columns:1fr]">
        <div className="relative max-poster:mx-auto max-poster:flex max-poster:min-h-0 max-poster:w-full max-poster:max-w-[640px] max-poster:items-start max-poster:justify-center">
          <h2 className="ml-[calc(47*var(--u))] mt-[calc(12*var(--u))] mb-0 mr-0 text-ink-navy text-[calc(40*var(--u))] font-[1000] leading-[0.96] tracking-[-0.015em] max-poster:m-0 max-poster:text-center max-poster:text-[clamp(36px,6.4vw,50px)] max-phone:text-[34px]">
            <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span> <span className="relative block w-fit max-poster:inline">
              {t("title3")}
              <Rays className="absolute left-[calc(100%+10.36*var(--u))] top-[calc(7.2*var(--u))] w-[calc(36*var(--u))] text-sun-ray max-poster:hidden" />
              <span className="absolute left-[calc(100%+46.36*var(--u))] top-[calc(35.2*var(--u))] text-faq-question-text text-[calc(38*var(--u))] font-[1000] leading-none [transform:rotate(12deg)] max-poster:hidden" aria-hidden="true">?</span>
            </span>
          </h2>
          <div className="absolute bottom-[calc(-1*var(--section-space))] left-[calc(64*var(--u))] w-[calc(140*var(--u))] max-poster:static max-poster:w-0" aria-hidden="true">
            <Image className="h-auto w-full max-poster:hidden" src={LANDING_ASSETS.faces.wondering} alt="" width={460} height={368} sizes="14vw" />
            <svg className="absolute bottom-[calc(10*var(--u))] right-[calc(-6*var(--u))] w-[calc(38*var(--u))] [filter:drop-shadow(0_calc(1*var(--u))_0_var(--color-faq-heart-shadow))] [transform:rotate(-8deg)] max-poster:hidden" viewBox="0 0 24 24"><path className="fill-faq-heart" d="M12 21.2C5.4 16.6 2 13 2 8.8 2 5.7 4.4 3.4 7.3 3.4c2 0 3.6 1 4.7 2.6 1.1-1.6 2.7-2.6 4.7-2.6 2.9 0 5.3 2.3 5.3 5.4 0 4.2-3.4 7.8-10 12.4Z" /></svg>
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
