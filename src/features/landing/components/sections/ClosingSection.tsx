import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

/** "Say hi to Mochi" closing band, rendered by the locale layout above the footer on every page. */
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
        <Image className="absolute z-1 left-560 bottom-0 h-auto w-370 max-w-none max-poster:relative max-poster:left-auto max-poster:bottom-auto max-poster:mt-[22px] max-poster:w-[min(86vw,420px)]" src={LANDING_ASSETS.closingMochi} alt={t("imageAlt")} width={1100} height={750} sizes="(max-width: 1099px) 86vw, 37vw" />
      </PosterStage>
    </section>
  );
}
