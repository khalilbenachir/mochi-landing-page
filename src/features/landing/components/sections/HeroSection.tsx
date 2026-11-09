import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { Petal, Rays, Sparkle } from "@/features/landing/components/shared/decor";
import { FreeSticker } from "@/features/landing/components/shared/FreeSticker";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";

/** Mascot art for the hero. Swap this one path to change the illustration. */
const HERO_MASCOT = { src: LANDING_ASSETS.heroMochi, width: 1400, height: 1120 } as const;

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-hero-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]"
    >
      <PosterStage bleed="bottom" className="pt-6 max-poster:pt-0 max-poster:px-[clamp(20px,4vw,40px)]">
        <SiteHeader />

        <div className="mt-14 grid pl-58 grid-cols-[calc(390*var(--spacing))_1fr] max-poster:mt-0 max-poster:block max-poster:pl-0">
          <div className="relative z-5 self-center max-poster:max-w-[640px] max-poster:mx-auto max-poster:mt-[18px] max-poster:text-center max-nav:mt-[10px]">
            <h1 className="text-white text-u-41 font-max leading-[0.95] tracking-[-0.015em] [text-shadow:0_calc(2*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:text-[clamp(42px,8.4vw,66px)] max-phone:text-[40px]">
              <span className="block whitespace-nowrap">{t("title1")}</span> <span className="block whitespace-nowrap">{t("title2")}</span> <span className="block whitespace-nowrap">{t("title3")}</span>
            </h1>
            <p className="mt-8 w-332 text-u-[13.6] font-demibold leading-[1.27] max-poster:w-auto max-poster:max-w-[520px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-nav:text-[16px] max-phone:text-[15px]">{t("body")}</p>
            <div className="flex items-center gap-12 mt-13 max-poster:justify-center max-poster:mt-[20px] max-nav:flex-wrap">
              <AppStoreBadge className="max-poster:h-[58px] max-phone:h-[54px] max-phone:ps-[18px] max-phone:pe-[22px]" />
              <FreeSticker
                className="w-66 max-poster:w-[78px]"
                blobClassName="[filter:drop-shadow(0_calc(2*var(--spacing))_0_var(--color-hero-sticker-shadow))]"
              />
            </div>
          </div>

          <div className="relative pointer-events-none max-poster:mt-[12px] max-poster:h-[clamp(300px,56vw,470px)] max-phone:h-[300px]">
            <Petal className="absolute z-1 text-hero-petal -left-68 top-198 w-30 -rotate-35 max-poster:left-[2%] max-poster:top-[64%] max-poster:w-[28px]" />
            <Rays shape="hero" className="absolute z-4 -left-43 top-78 w-48 text-sun max-poster:left-[calc(50%-min(44vw,340px))] max-poster:top-[18%] max-poster:w-[44px]" />
            <Image
              className="absolute z-2 -left-56 top-46 w-340 h-auto max-w-none max-poster:left-1/2 max-poster:top-auto max-poster:bottom-[-14%] max-poster:w-[min(66vw,520px)] max-poster:-translate-x-[72%] max-phone:bottom-[-10%] max-phone:w-[76vw] max-phone:-translate-x-[70%]"
              src={HERO_MASCOT.src}
              alt={t("mascotAlt")}
              width={HERO_MASCOT.width}
              height={HERO_MASCOT.height}
              priority
              sizes="(max-width: 1099px) 70vw, 33vw"
            />
            <Sparkle className="absolute z-4 text-white left-232 top-23 w-30 max-poster:left-[calc(50%+min(4vw,30px))] max-poster:top-[4%] max-poster:w-[30px]" />
            <Sparkle className="absolute z-4 text-white left-261 top-52 w-22 max-poster:left-[calc(50%+min(8vw,64px))] max-poster:top-[13%] max-poster:w-[20px]" />
            <Image
              className="relative z-3 ml-280 -mb-[calc(var(--section-space)+44*var(--spacing))] block w-246 h-auto max-w-none max-poster:absolute max-poster:ml-0 max-poster:mb-0 [filter:drop-shadow(0_calc(10*var(--spacing))_calc(14*var(--spacing))_var(--color-hero-phone-shadow))] max-poster:left-1/2 max-poster:top-[8%] max-poster:w-[min(38vw,300px)] max-poster:translate-x-[28%] max-phone:w-[41vw] max-phone:translate-x-[16%]"
              src={LANDING_ASSETS.heroPhone}
              alt={t("phoneAlt")}
              width={1024}
              height={1536}
              priority
              sizes="(max-width: 1099px) 42vw, 23vw"
            />
            <Petal className="absolute z-4 text-hero-petal left-552 top-142 w-22 rotate-40 max-poster:left-auto max-poster:right-[2%] max-poster:top-[42%] max-poster:w-[22px] max-phone:hidden" />
            <Petal className="absolute z-4 text-hero-petal left-516 top-164 w-30 -rotate-20 max-poster:left-auto max-poster:right-[6%] max-poster:top-[56%] max-poster:w-[28px] max-phone:hidden" />
            <Petal className="absolute z-4 text-hero-petal left-514 top-218 w-28 rotate-25 max-poster:left-auto max-poster:right-[1%] max-poster:top-[74%] max-poster:w-[26px] max-phone:right-[2%] max-phone:top-[80%]" />
          </div>
        </div>
      </PosterStage>
    </section>
  );
}
