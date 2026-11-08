import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { FAQ_IDS } from "@/features/landing/content/landing";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

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

        <div className="grid content-start gap-[calc(3.5*var(--u))] max-poster:mx-auto max-poster:mb-0 max-poster:mt-[22px] max-poster:w-full max-poster:max-w-[720px] max-poster:gap-[8px]">
          {FAQ_IDS.map((id, index) => (
            <details
              key={id}
              name="faq"
              open={index === 0}
              className="group rounded-[calc(10*var(--u))] bg-white [box-shadow:0_calc(2*var(--u))_calc(4*var(--u))_var(--color-faq-item-shadow)] max-poster:rounded-[14px]"
            >
              <summary className="flex min-h-[calc(19.5*var(--u))] cursor-pointer list-none items-center justify-between pl-[calc(23*var(--u))] pr-[calc(22*var(--u))] group-open:min-h-[calc(26*var(--u))] group-open:pl-[calc(19*var(--u))] focus-visible:rounded-[calc(10*var(--u))] focus-visible:[outline:3px_solid_var(--color-brand-rose)] focus-visible:outline-offset-2 max-poster:min-h-[50px] max-poster:gap-[14px] max-poster:py-[10px] max-poster:pl-[18px] max-poster:pr-[18px] max-poster:group-open:min-h-[50px] max-poster:group-open:pl-[18px] [&::-webkit-details-marker]:hidden">
                <h3 className="m-0 text-[calc(13.6*var(--u))] font-[1000] tracking-[-0.01em] group-open:text-[calc(14.4*var(--u))] max-poster:text-[16px] max-poster:leading-[1.25] max-poster:group-open:text-[16px] max-phone:text-[15px] max-phone:group-open:text-[15px]">{t(`items.${id}.question`)}</h3>
                <span
                  className="relative h-[calc(11*var(--u))] w-[calc(11*var(--u))] flex-none before:absolute before:left-0 before:top-1/2 before:h-[calc(1.8*var(--u))] before:w-full before:rounded-[2px] before:bg-ink-navy before:content-[''] before:[transform:translateY(-50%)] before:[transition:transform_0.2s_ease] after:absolute after:left-0 after:top-1/2 after:h-[calc(1.8*var(--u))] after:w-full after:rounded-[2px] after:bg-ink-navy after:content-[''] after:[transform:translateY(-50%)_rotate(90deg)] after:[transition:transform_0.2s_ease] group-open:after:[transform:translateY(-50%)_rotate(0deg)] max-poster:h-[14px] max-poster:w-[14px] max-poster:before:h-[2px] max-poster:after:h-[2px] motion-reduce:before:[transition:none] motion-reduce:after:[transition:none]"
                  aria-hidden="true"
                />
              </summary>
              <p className="mb-0 mt-[calc(-5*var(--u))] mx-0 max-w-[calc(612*var(--u))] pb-[calc(9*var(--u))] pl-[calc(19*var(--u))] pr-[calc(22*var(--u))] pt-0 text-faq-answer-text text-[calc(12.2*var(--u))] font-[600] leading-[1.26] max-poster:mt-[-2px] max-poster:max-w-none max-poster:pb-[14px] max-poster:pl-[18px] max-poster:pr-[18px] max-poster:text-[15px] max-poster:leading-[1.4] max-phone:text-[14px]">{t(`items.${id}.answer`)}</p>
            </details>
          ))}
        </div>
      </PosterStage>
    </section>
  );
}
