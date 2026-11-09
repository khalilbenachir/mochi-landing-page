import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";

/** Mascot art for the hero. Swap this one path to change the illustration. */
export const HERO_MASCOT = { src: LANDING_ASSETS.heroMochi, width: 1400, height: 1120 } as const;

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path fill="currentColor" d="M20 0c1.6 10.2 9.8 18.4 20 20-10.2 1.6-18.4 9.8-20 20-1.6-10.2-9.8-18.4-20-20C10.2 18.4 18.4 10.2 20 0Z" />
    </svg>
  );
}

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5">
        <path d="M25 4 21 15" /><path d="M36 13 27 19" /><path d="M4 22 16 24" />
      </g>
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 4.2 10.4 1.1C6 1.4 3.4 5.8 4 11.2 4.6 17 8.4 21.4 12 23c3.6-1.6 7.4-6 8-11.8.6-5.4-2-9.8-6.4-10.1Z" />
    </svg>
  );
}

export function FreeSticker({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const label = t("free").toUpperCase();
  // The blob fits about 64 units of text: scale the size down with the word length
  // (FREE 24, GRATIS 19, GRATUIT 16) and pin longer words to that run so no locale spills out.
  const long = label.length > 5;
  const fontSize = Math.max(13, Math.min(24, Math.round(112 / label.length)));

  return (
    <span className={className} role="img" aria-label={t("free")}>
      <svg viewBox="0 0 100 64" aria-hidden="true">
        <path className="fill-sun" d="M14 12c6-6 14-3 19-7 6-4 13-5 19-1 6-3 14-2 19 2 7 0 13 4 15 10 6 4 8 11 5 17 2 7-1 13-7 16-3 6-10 9-17 8-6 4-14 4-20 1-7 2-14 0-18-5-7-1-12-6-12-13-5-5-5-12 0-17-1-5 2-9 7-11Z" />
        <text className="fill-ink-black" x="50" y={Math.round(33 + fontSize * 0.35)} textAnchor="middle" fontSize={fontSize} fontWeight="1000" fontFamily="inherit" transform="rotate(-9 50 34)" textLength={long ? 64 : undefined} lengthAdjust={long ? "spacingAndGlyphs" : undefined}>{label}</text>
      </svg>
      <Rays className="absolute right-[calc(-20*var(--u))] top-[calc(4*var(--u))] w-[calc(22*var(--u))] text-sun [transform:scaleX(-1)_rotate(10deg)]" />
    </span>
  );
}

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-hero-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:content-[''] min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]"
    >
      <PosterStage bleed="bottom" className="pt-[calc(6*var(--u))] max-poster:pt-0 max-poster:px-[clamp(20px,4vw,40px)]">
        <SiteHeader />

        <div className="mt-[calc(14*var(--u))] grid pl-[calc(58*var(--u))] [grid-template-columns:calc(390*var(--u))_1fr] max-poster:mt-0 max-poster:block max-poster:pl-0">
        <div className="relative z-5 self-center max-poster:max-w-[640px] max-poster:mx-auto max-poster:mt-[18px] max-poster:text-center max-nav:mt-[10px]">
          <h1 className="m-0 text-white text-[calc(41*var(--u))] font-[1000] leading-[0.95] tracking-[-0.015em] [text-shadow:0_calc(2*var(--u))_0_var(--color-hero-title-shadow)] max-poster:text-[clamp(42px,8.4vw,66px)] max-phone:text-[40px]">
            <span className="block whitespace-nowrap">{t("title1")}</span> <span className="block whitespace-nowrap">{t("title2")}</span> <span className="block whitespace-nowrap">{t("title3")}</span>
          </h1>
          <p className="mt-[calc(8*var(--u))] mb-0 mx-0 w-[calc(332*var(--u))] text-[calc(13.6*var(--u))] font-[650] leading-[1.27] max-poster:w-auto max-poster:max-w-[520px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-nav:text-[16px] max-phone:text-[15px]">{t("body")}</p>
          <div className="flex items-center gap-[calc(12*var(--u))] mt-[calc(13*var(--u))] max-poster:justify-center max-poster:mt-[20px] max-nav:flex-wrap">
            <AppStoreBadge className="max-poster:h-[58px] max-phone:h-[54px] max-phone:[padding-inline:18px_22px]" />
            <FreeSticker className="relative block w-[calc(66*var(--u))] max-poster:w-[78px] [&>svg:first-child]:block [&>svg:first-child]:w-full [&>svg:first-child]:h-auto [&>svg:first-child]:[filter:drop-shadow(0_calc(2*var(--u))_0_var(--color-hero-sticker-shadow))]" />
          </div>
        </div>

        <div className="relative pointer-events-none max-poster:mt-[12px] max-poster:h-[clamp(300px,56vw,470px)] max-phone:h-[300px]" aria-hidden="false">
          <Petal className="absolute z-1 text-hero-petal left-[calc(-68*var(--u))] top-[calc(198*var(--u))] w-[calc(30*var(--u))] [transform:rotate(-35deg)] max-poster:left-[2%] max-poster:top-[64%] max-poster:w-[28px]" />
          <Rays className="absolute z-4 left-[calc(-43*var(--u))] top-[calc(78*var(--u))] w-[calc(48*var(--u))] text-sun max-poster:left-[calc(50%-min(44vw,340px))] max-poster:top-[18%] max-poster:w-[44px]" />
          <Image
            className="absolute z-2 left-[calc(-56*var(--u))] top-[calc(46*var(--u))] w-[calc(340*var(--u))] h-auto max-w-none max-poster:left-[50%] max-poster:top-auto max-poster:bottom-[-14%] max-poster:w-[min(66vw,520px)] max-poster:[transform:translateX(-72%)] max-phone:bottom-[-10%] max-phone:w-[76vw] max-phone:[transform:translateX(-70%)]"
            src={HERO_MASCOT.src}
            alt={t("mascotAlt")}
            width={HERO_MASCOT.width}
            height={HERO_MASCOT.height}
            priority
            sizes="(max-width: 1099px) 70vw, 33vw"
          />
          <Sparkle className="absolute z-4 text-white left-[calc(232*var(--u))] top-[calc(23*var(--u))] w-[calc(30*var(--u))] max-poster:left-[calc(50%+min(4vw,30px))] max-poster:top-[4%] max-poster:w-[30px]" />
          <Sparkle className="absolute z-4 text-white left-[calc(261*var(--u))] top-[calc(52*var(--u))] w-[calc(22*var(--u))] max-poster:left-[calc(50%+min(8vw,64px))] max-poster:top-[13%] max-poster:w-[20px]" />
          <Image
            className="relative z-3 ml-[calc(280*var(--u))] -mb-[calc(var(--section-space)+44*var(--u))] block w-[calc(246*var(--u))] h-auto max-w-none max-poster:absolute max-poster:ml-0 max-poster:mb-0 [filter:drop-shadow(0_calc(10*var(--u))_calc(14*var(--u))_var(--color-hero-phone-shadow))] max-poster:left-[50%] max-poster:top-[8%] max-poster:w-[min(38vw,300px)] max-poster:[transform:translateX(28%)] max-phone:w-[41vw] max-phone:[transform:translateX(16%)]"
            src={LANDING_ASSETS.heroPhone}
            alt={t("phoneAlt")}
            width={1024}
            height={1536}
            priority
            sizes="(max-width: 1099px) 42vw, 23vw"
          />
          <Petal className="absolute z-4 text-hero-petal left-[calc(552*var(--u))] top-[calc(142*var(--u))] w-[calc(22*var(--u))] [transform:rotate(40deg)] max-poster:left-auto max-poster:right-[2%] max-poster:top-[42%] max-poster:w-[22px] max-phone:hidden" />
          <Petal className="absolute z-4 text-hero-petal left-[calc(516*var(--u))] top-[calc(164*var(--u))] w-[calc(30*var(--u))] [transform:rotate(-20deg)] max-poster:left-auto max-poster:right-[6%] max-poster:top-[56%] max-poster:w-[28px] max-phone:hidden" />
          <Petal className="absolute z-4 text-hero-petal left-[calc(514*var(--u))] top-[calc(218*var(--u))] w-[calc(28*var(--u))] [transform:rotate(25deg)] max-poster:left-auto max-poster:right-[1%] max-poster:top-[74%] max-poster:w-[26px] max-phone:right-[2%] max-phone:top-[80%]" />
        </div>
        </div>
      </PosterStage>
    </section>
  );
}
