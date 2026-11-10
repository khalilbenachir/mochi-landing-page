import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { StoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { HeartOutline, Rays } from "@/features/landing/components/shared/decor";
import { FreeSticker } from "@/features/landing/components/shared/FreeSticker";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

const RAYS = "absolute z-2 text-sun max-poster:hidden";

/** "Say hi to Mochi" closing band. The shared app footer is rendered by the locale layout. */
export function ClosingSection() {
  const t = useTranslations("Closing");

  return (
    <section id="get" className="relative overflow-hidden bg-closing-band text-white">
      <PosterStage bleed="bottom" className="grid items-center pl-56 grid-cols-[calc(410*var(--spacing))_auto] max-poster:grid-cols-1 max-poster:justify-items-center max-poster:px-[clamp(16px,4vw,40px)] max-poster:text-center">
        <div className="relative z-2 w-full">
          <h2 className="poster:text-balance text-white text-u-45 font-max leading-none tracking-[-0.015em] max-poster:text-[clamp(38px,7vw,52px)] max-phone:text-[38px]">{t("title")}</h2>
          <p className="poster:text-balance mt-5 text-u-[16.6] font-demibold leading-[1.3] max-poster:max-w-[460px] max-poster:mt-[12px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">
            <span className="block max-poster:inline">{t("body1")}</span> <span className="block max-poster:inline">{t("body2")}</span>
          </p>
        </div>
        <Rays shape="closing" className={cn(RAYS, "left-409 top-[calc(var(--section-space)-24*var(--spacing))] w-40")} />
        <div className="relative z-3 flex items-center max-poster:mt-[22px]">
          <StoreBadge placement="band" />
          <FreeSticker className="w-82 -ml-8 -mt-16 max-poster:w-[84px] max-poster:mt-[-16px]" rays={false} />
        </div>
        <Rays shape="closing" className={cn(RAYS, "left-705 top-[calc(var(--section-space)-24*var(--spacing))] w-40")} flip />
        <Image className="absolute z-1 left-780 top-1/2 -translate-y-1/2 h-auto w-220 max-w-none max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:translate-y-0 max-poster:mb-0 max-poster:mt-[14px] max-poster:w-[min(70vw,340px)]" src={LANDING_ASSETS.closingMochi} alt={t("imageAlt")} width={900} height={648} sizes="(max-width: 1099px) 60vw, 19vw" />
        <HeartOutline className="absolute z-2 left-940 top-[calc(var(--section-space)-36*var(--spacing))] w-42 rotate-14 text-white max-poster:hidden" strokeWidth={2.4} />
      </PosterStage>
    </section>
  );
}
