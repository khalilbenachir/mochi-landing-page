import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { FREE_FEATURE_IDS, PLUS_FEATURE_IDS, PLUS_PRICE } from "@/features/landing/content/landing";
import { CheckBadge, HeartOutline } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

const PLAN = "relative z-2 pb-14 pl-16 pr-18 pt-13 rounded-u-12 max-poster:[--spacing:calc(min(100vw-32px,420px)/262)] max-poster:w-262";
const PLAN_TITLE = "mb-10 flex items-center gap-5 text-u-19.5 font-max tracking-[-0.02em] whitespace-nowrap";
const PLAN_ITEM = "flex items-start gap-10 text-u-11 font-extrabold leading-[1.2]";

/** "Free to download. Mochi Plus is optional." with the two plan cards. */
export function PlansSection() {
  const t = useTranslations("Plans");
  const common = useTranslations("Common");

  return (
    <section id="plus" className="relative overflow-visible bg-plans-band text-ink-navy">
      <PosterStage grid="800" className="grid grid-cols-[calc(281*var(--spacing))_calc(223*var(--spacing))_calc(268*var(--spacing))] max-poster:grid-cols-1 max-poster:justify-items-center max-poster:px-[clamp(16px,4vw,40px)]">
        <h2 className="poster:text-balance relative z-2 ml-31 self-start text-u-26.5 font-max leading-[1.2] tracking-[-0.02em] max-poster:ml-0 max-poster:text-center max-poster:text-[clamp(36px,6.4vw,50px)] max-phone:text-[34px]">
          <span className="block max-poster:inline">{t("title1")}</span> <span className="block max-poster:inline">{t("title2")}</span> <span className="block max-poster:inline">{t("title3")}</span>
        </h2>
        <HeartOutline className="absolute left-222 bottom-[calc(var(--section-space)*0.45)] w-32 rotate-10 text-brand-coral max-poster:hidden" strokeWidth={2.6} />
        <div className="absolute left-96 bottom-[calc(var(--section-space)*0.2)] w-100 max-poster:hidden" aria-hidden="true">
          <Image className="h-auto w-full" src={LANDING_ASSETS.freeMochi} alt="" width={420} height={352} sizes="12vw" />
        </div>

        <div className={cn(PLAN, "w-223 bg-white [box-shadow:0_calc(3*var(--spacing))_calc(10*var(--spacing))_var(--color-plans-free-shadow)] max-poster:mt-[24px]")}>
          <h3 className={PLAN_TITLE}>{t("freeName")} — <span className="inline-grid h-22 place-items-center rounded-full bg-brand-coral px-12 text-u-15 text-white">{t("freeLabel")}</span></h3>
          <ul className="grid gap-6">{FREE_FEATURE_IDS.map((id) => <li key={id} className={PLAN_ITEM}><CheckBadge className="-mt-1 size-15" />{t(`freeFeatures.${id}`)}</li>)}</ul>
        </div>

        <div className="absolute z-3 left-[calc(752*var(--spacing)-64*var(--spacing))] top-[calc(var(--section-space)-67*var(--spacing))] w-128 max-poster:[--spacing:calc(min(100vw-32px,420px)/262)] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:mt-[22px] max-poster:-mb-[calc(37*var(--spacing))] max-poster:w-144" aria-hidden="true">
          <Image className="h-auto w-full" src={LANDING_ASSETS.plusMochi} alt="" width={480} height={377} sizes="(max-width: 1099px) 40vw, 12vw" />
        </div>
        <div className={cn(PLAN, "ml-6 w-262 bg-plans-plus-bg max-poster:ml-0 text-white")}>
          <h3 className={PLAN_TITLE}>{t("plusName")} — <span className="inline-grid h-22 place-items-center rounded-u-7 bg-white px-10 text-u-12.5 text-plans-price-pill-text">{PLUS_PRICE ?? common("optional")}</span></h3>
          <ul className="grid gap-8 pr-52">{PLUS_FEATURE_IDS.map((id) => <li key={id} className={PLAN_ITEM}><CheckBadge className="-mt-1 size-15" />{t(`plusFeatures.${id}`)}</li>)}</ul>
        </div>
      </PosterStage>
    </section>
  );
}
