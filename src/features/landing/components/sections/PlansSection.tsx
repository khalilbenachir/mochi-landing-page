import Image from "next/image";
import { useTranslations } from "next-intl";
import { FLAVOR_CARD_ASSETS, LANDING_ASSETS } from "@/features/landing/content/assets";
import { FREE_FEATURE_IDS, PLUS_FEATURE_IDS, PLUS_PRICE } from "@/features/landing/content/landing";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

function Rays({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={cn(className, flip && "[transform:scaleX(-1)]")} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M24 4 28 15" /><path d="M8 13 18 20" /><path d="M5 30 17 29" />
      </g>
    </svg>
  );
}

function Check() {
  return (
    <svg className="mt-[calc(-1*var(--u))] h-[calc(15*var(--u))] w-[calc(15*var(--u))] flex-none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="fill-brand-coral" cx="12" cy="12" r="11" />
      <path className="stroke-white" d="M7 12.5l3.2 3.2L17 9" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path className="stroke-brand-coral" fill="none" strokeWidth="2.6" strokeLinejoin="round" d="M12 20.2C5.9 16 3 12.6 3 8.9 3 6.2 5.1 4.2 7.6 4.2c1.8 0 3.3.9 4.4 2.4 1.1-1.5 2.6-2.4 4.4-2.4 2.5 0 4.6 2 4.6 4.7 0 3.7-2.9 7.1-9 11.3Z" />
    </svg>
  );
}

const RAYS = "absolute z-2 text-sun-ray max-poster:hidden";
const PLAN = "relative z-2 pb-[calc(14*var(--u))] pl-[calc(16*var(--u))] pr-[calc(18*var(--u))] pt-[calc(13*var(--u))] rounded-[calc(12*var(--u))] max-poster:[--u:calc(min(100vw-32px,420px)/262)] max-poster:w-[calc(262*var(--u))]";
const PLAN_TITLE = "mt-0 mx-0 mb-[calc(10*var(--u))] flex items-center gap-[calc(5*var(--u))] text-[calc(19.5*var(--u))] font-[1000] tracking-[-0.02em] whitespace-nowrap";
const PLAN_ITEM = "flex items-start gap-[calc(10*var(--u))] text-[calc(11*var(--u))] font-[800] leading-[1.2]";

/** "Free to download. Mochi Plus is optional." with the two plan cards. */
export function PlansSection() {
  const t = useTranslations("Plans");
  const common = useTranslations("Common");

  return (
    <section id="plus" className="relative overflow-visible bg-plans-band text-ink-navy">
      <PosterStage grid="800" className="grid [grid-template-columns:calc(281*var(--u))_calc(223*var(--u))_calc(268*var(--u))] max-poster:grid-cols-1 max-poster:justify-items-center max-poster:px-[clamp(16px,4vw,40px)]">
        <h2 className="poster:text-balance relative z-2 my-0 mr-0 ml-[calc(31*var(--u))] self-start text-[calc(26.5*var(--u))] font-[1000] leading-[1.2] tracking-[-0.02em] max-poster:ml-0 max-poster:text-center max-poster:text-[clamp(36px,6.4vw,50px)] max-phone:text-[34px]">
          <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span> <span className="block max-poster:inline">{t("title3")}</span>
        </h2>
        <Rays className={cn(RAYS, "left-[calc(208*var(--u))] top-[calc(69*var(--u))] w-[calc(26*var(--u))]")} flip />
        <Heart className="absolute left-[calc(222*var(--u))] bottom-[calc(24*var(--u))] w-[calc(28*var(--u))] [transform:rotate(10deg)] max-poster:hidden" />
        <div className="absolute left-[calc(102*var(--u))] bottom-0 h-[calc(45*var(--u))] w-[calc(104*var(--u))] overflow-hidden max-poster:hidden" aria-hidden="true">
          <Image className="h-auto w-full" src={LANDING_ASSETS.predictMochi} alt="" width={368} height={264} sizes="12vw" />
        </div>

        <div className={cn(PLAN, "w-[calc(223*var(--u))] bg-white [box-shadow:0_calc(3*var(--u))_calc(10*var(--u))_var(--color-plans-free-shadow)] max-poster:mt-[24px]")}>
          <h3 className={PLAN_TITLE}>{t("freeName")} — <span className="inline-grid h-[calc(22*var(--u))] place-items-center rounded-[999px] bg-brand-coral px-[calc(12*var(--u))] text-[calc(15*var(--u))] text-white">{t("freeLabel")}</span></h3>
          <ul className="m-0 grid list-none gap-[calc(6*var(--u))] p-0">{FREE_FEATURE_IDS.map((id) => <li key={id} className={PLAN_ITEM}><Check />{t(`freeFeatures.${id}`)}</li>)}</ul>
        </div>

        <div className="absolute z-1 left-[calc(553*var(--u))] top-[calc(var(--section-space)-48*var(--u))] flex w-[calc(146*var(--u))] max-poster:[--u:calc(min(100vw-32px,420px)/262)] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:mb-[calc(-12*var(--u))] max-poster:mt-[22px]" aria-hidden="true">
          <Rays className={cn(RAYS, "left-[calc(-22*var(--u))] top-[calc(6*var(--u))] w-[calc(20*var(--u))]")} />
          <Image className="h-auto w-[50%]" src={FLAVOR_CARD_ASSETS.chocolate} alt="" width={380} height={262} sizes="8vw" />
          <Image className="ml-[calc(-2*var(--u))] h-auto w-[50%]" src={FLAVOR_CARD_ASSETS.hojicha} alt="" width={380} height={262} sizes="8vw" />
          <Rays className={cn(RAYS, "right-[calc(-26*var(--u))] top-[calc(8*var(--u))] w-[calc(20*var(--u))]")} flip />
        </div>
        <div className={cn(PLAN, "ml-[calc(6*var(--u))] w-[calc(262*var(--u))] bg-plans-plus-bg max-poster:ml-0 text-white")}>
          <h3 className={PLAN_TITLE}>{t("plusName")} — <span className="inline-grid h-[calc(22*var(--u))] place-items-center rounded-[calc(7*var(--u))] bg-white px-[calc(10*var(--u))] text-[calc(12.5*var(--u))] text-plans-price-pill-text">{PLUS_PRICE ?? common("optional")}</span></h3>
          <ul className="m-0 grid list-none gap-[calc(8*var(--u))] p-0 pr-[calc(52*var(--u))]">{PLUS_FEATURE_IDS.map((id) => <li key={id} className={PLAN_ITEM}><Check />{t(`plusFeatures.${id}`)}</li>)}</ul>
        </div>
      </PosterStage>
    </section>
  );
}
