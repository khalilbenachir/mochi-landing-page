import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { ClosingStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";
import { FreeSticker } from "./HeroSection";

function Rays({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg className={cn(className, flip && "[transform:scaleX(-1)]")} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M10 4 14 15" /><path d="M25 7 21 19" /><path d="M36 21 25 26" />
      </g>
    </svg>
  );
}

const RAYS = "absolute z-2 text-sun max-poster:hidden";

/** "Say hi to Mochi" closing band. The shared app footer is rendered by the locale layout. */
export function ClosingSection() {
  const t = useTranslations("Closing");

  return (
    <section id="get" className="relative overflow-hidden bg-closing-band text-white">
      <PosterStage bleed="bottom" className="grid items-center pl-[calc(56*var(--u))] [grid-template-columns:calc(410*var(--u))_auto] max-poster:grid-cols-1 max-poster:justify-items-center max-poster:px-[clamp(16px,4vw,40px)] max-poster:text-center">
        <div className="relative z-2 w-full">
          <h2 className="poster:text-balance m-0 text-white text-[calc(45*var(--u))] font-[1000] leading-none tracking-[-0.015em] max-poster:text-[clamp(38px,7vw,52px)] max-phone:text-[38px]">{t("title")}</h2>
          <p className="poster:text-balance mt-[calc(5*var(--u))] mb-0 mx-0 text-[calc(16.6*var(--u))] font-[650] leading-[1.3] max-poster:max-w-[460px] max-poster:mt-[12px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">
            <span className="block max-poster:inline">{t("body1")}</span> <span className="block max-poster:inline">{t("body2")}</span>
          </p>
        </div>
        <Rays className={cn(RAYS, "left-[calc(409*var(--u))] top-[calc(26*var(--u))] w-[calc(36*var(--u))]")} />
        <div className="relative z-3 flex items-center max-poster:mt-[22px]">
          <ClosingStoreBadge variant="band" />
          <FreeSticker className="relative block w-[calc(82*var(--u))] ml-[calc(-8*var(--u))] mt-[calc(-16*var(--u))] max-poster:w-[84px] max-poster:mt-[-16px] [&>svg+svg]:hidden [&>svg:first-child]:block [&>svg:first-child]:w-full [&>svg:first-child]:h-auto" />
        </div>
        <Rays className={cn(RAYS, "left-[calc(705*var(--u))] top-[calc(28*var(--u))] w-[calc(38*var(--u))]")} flip />
        <Image className="absolute z-1 left-[calc(722*var(--u))] bottom-[calc(-7*var(--u))] h-auto w-[calc(202*var(--u))] max-w-none max-poster:relative max-poster:left-auto max-poster:bottom-auto max-poster:mb-[-40px] max-poster:mt-[14px] max-poster:w-[min(70vw,340px)]" src={LANDING_ASSETS.closingMochi} alt={t("imageAlt")} width={900} height={648} sizes="(max-width: 1099px) 60vw, 19vw" />
        <svg className="absolute z-2 left-[calc(914*var(--u))] top-[calc(33*var(--u))] w-[calc(42*var(--u))] [transform:rotate(14deg)] max-poster:hidden" viewBox="0 0 24 24" aria-hidden="true">
          <path className="stroke-white" fill="none" strokeWidth="2.4" strokeLinejoin="round" d="M12 20.2C5.9 16 3 12.6 3 8.9 3 6.2 5.1 4.2 7.6 4.2c1.8 0 3.3.9 4.4 2.4 1.1-1.5 2.6-2.4 4.4-2.4 2.5 0 4.6 2 4.6 4.7 0 3.7-2.9 7.1-9 11.3Z" />
        </svg>
      </PosterStage>
    </section>
  );
}
