import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { Petal } from "@/features/landing/components/shared/decor";
import { FreeSticker } from "@/features/landing/components/shared/FreeSticker";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

/** Hero art: Mochi on a cloud with its flavor friends, rising under the centered headline. Swap this one path to change it. */
const HERO_MASCOT = { src: LANDING_ASSETS.heroArt, width: 1200, height: 972 } as const;

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]"
    >
      <PosterStage bleed="bottom" className="pt-0 max-poster:px-[clamp(20px,4vw,40px)]">
        <div className="relative mt-34 text-center max-poster:mt-[28px]">
          <div className="absolute inset-x-0 top-60 bottom-0 bg-[radial-gradient(50%_60%_at_50%_70%,var(--color-hero-glow),transparent)]" aria-hidden="true" />
          <Image className="absolute z-1 right-26 top-0 h-auto w-112 animate-float [animation-delay:-3s] max-poster:hidden" src={LANDING_ASSETS.heroBalloon} alt="" width={1000} height={1226} sizes="10vw" />
          <Petal className="absolute z-1 text-hero-petal left-60 top-40 w-30 -rotate-35 animate-drift max-poster:left-[3%] max-poster:top-[30%] max-poster:w-[24px]" />
          <Petal className="absolute z-1 text-hero-petal left-150 top-260 w-24 rotate-25 animate-drift [animation-delay:-3s] max-poster:hidden" />
          <Petal className="absolute z-1 text-hero-petal right-160 top-300 w-28 rotate-40 animate-drift [animation-delay:-5s] max-poster:hidden" />
          <div className="relative z-5">
            <h1 className="text-white text-u-41 font-max leading-[0.95] tracking-[-0.015em] [text-shadow:0_calc(2*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:text-[clamp(38px,8.4vw,60px)] max-phone:text-[clamp(30px,9.6vw,38px)]">
              <span className="block">{t("title1")}</span> <span className="block">{t("title2")} {t("title3")}</span>
            </h1>
            <p className="mx-auto mt-8 w-420 text-u-[13.6] font-demibold leading-[1.27] max-poster:w-auto max-poster:max-w-[520px] max-poster:mt-[14px] max-poster:text-[17px] max-nav:text-[16px] max-phone:text-[15px]">{t("body")}</p>
            <div className="flex items-center justify-center gap-12 mt-13 max-poster:mt-[20px] max-nav:flex-wrap">
              <AppStoreBadge className="max-poster:h-[58px] max-phone:h-[54px] max-phone:ps-[18px] max-phone:pe-[22px]" />
              <FreeSticker className="w-66 max-poster:w-[78px]" blobClassName="[filter:drop-shadow(0_calc(2*var(--spacing))_0_var(--color-hero-sticker-shadow))]" />
            </div>
          </div>
          <div className="relative z-2 mx-auto mt-10 w-500 aspect-[1200/972] -mb-[calc(var(--section-space)+110*var(--spacing))] pointer-events-none max-poster:w-[min(92vw,560px)] max-poster:mt-[18px] max-poster:-mb-[18%]">
            <Image className="h-full w-full animate-float" src={HERO_MASCOT.src} alt={t("mascotAlt")} width={HERO_MASCOT.width} height={HERO_MASCOT.height} priority sizes="(max-width: 1099px) 92vw, 50vw" />
            <p className="absolute z-3 left-[0%] top-[14%] -rotate-8 rounded-full bg-white px-15 py-8 text-u-15 font-max text-hero-band [box-shadow:0_calc(4*var(--spacing))_calc(12*var(--spacing))_var(--color-hero-bubble-shadow)] after:absolute after:right-[22%] after:-bottom-5 after:size-12 after:rotate-45 after:rounded-u-2 after:bg-white max-poster:px-[14px] max-poster:py-[7px] max-poster:text-[clamp(13px,3.4vw,18px)] max-poster:after:size-[12px] max-poster:after:-bottom-[5px]">{t("hello")}</p>
          </div>
        </div>
      </PosterStage>
    </section>
  );
}
