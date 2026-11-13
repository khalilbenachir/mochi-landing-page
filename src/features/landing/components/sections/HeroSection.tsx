import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { Petal } from "@/features/landing/components/shared/decor";
import { FreeSticker } from "@/features/landing/components/shared/FreeSticker";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

/** Hero art: Mochi on a cloud with its flavor friends. Swap this one path to change the illustration. */
const HERO_MASCOT = { src: LANDING_ASSETS.heroArt, width: 1200, height: 972 } as const;

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-hero-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]"
    >
      <PosterStage bleed="bottom" className="pt-0 max-poster:px-[clamp(20px,4vw,40px)]">
        <div className="mt-48 grid pl-58 grid-cols-[calc(390*var(--spacing))_1fr] max-poster:mt-[32px] max-poster:block max-poster:pl-0">
          <div className="relative z-5 self-center max-poster:max-w-[640px] max-poster:mx-auto max-poster:mt-[18px] max-poster:text-center max-nav:mt-[10px]">
            <h1 className="text-white text-u-41 font-max leading-[0.95] tracking-[-0.015em] [text-shadow:0_calc(2*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:text-[clamp(42px,8.4vw,66px)] max-phone:text-[clamp(32px,10.25vw,40px)]">
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

          <div className="relative h-400 pointer-events-none max-poster:mt-[12px] max-poster:h-[clamp(320px,74vw,520px)]">
            <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(closest-side,var(--color-hero-glow),transparent)]" aria-hidden="true" />
            <Petal className="absolute z-1 text-hero-petal left-0 top-300 w-30 -rotate-35 animate-drift max-poster:left-[4%] max-poster:top-[70%] max-poster:w-[28px]" />
            <div className="absolute z-2 left-1/2 top-1/2 h-[94%] -translate-x-1/2 -translate-y-1/2 aspect-[1200/972]">
              <Image
                className="h-full w-auto max-w-none animate-float"
                src={HERO_MASCOT.src}
                alt={t("mascotAlt")}
                width={HERO_MASCOT.width}
                height={HERO_MASCOT.height}
                priority
                sizes="(max-width: 1099px) 92vw, 45vw"
              />
              <p className="absolute z-3 left-[1%] top-[13%] -rotate-8 rounded-full bg-white px-15 py-8 text-u-15 font-max text-hero-band [box-shadow:0_calc(4*var(--spacing))_calc(12*var(--spacing))_var(--color-hero-bubble-shadow)] after:absolute after:right-[22%] after:-bottom-5 after:size-12 after:rotate-45 after:rounded-u-2 after:bg-white max-poster:px-[14px] max-poster:py-[7px] max-poster:text-[clamp(13px,3.4vw,18px)] max-poster:after:size-[12px] max-poster:after:-bottom-[5px]">
                {t("hello")}
              </p>
            </div>
            <Petal className="absolute z-4 text-hero-petal right-10 top-60 w-24 rotate-40 animate-drift [animation-delay:-2s] max-poster:right-[3%] max-poster:top-[12%] max-poster:w-[22px]" />
            <Petal className="absolute z-4 text-hero-petal right-30 bottom-50 w-28 rotate-25 animate-drift [animation-delay:-4.5s] max-poster:right-[5%] max-poster:bottom-[10%] max-poster:w-[26px]" />
          </div>
        </div>
      </PosterStage>
    </section>
  );
}
