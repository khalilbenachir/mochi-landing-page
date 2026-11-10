import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { Rays, StatusIcons } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { IslandCountdown } from "./IslandCountdown";

function Drop() {
  return (
    <svg className="size-[55%]" viewBox="0 0 24 24" aria-hidden="true">
      <path className="fill-white" d="M12 2.5c-.3 0-.6.2-.8.5C9.6 5.4 5.5 10.9 5.5 14.8a6.5 6.5 0 0 0 13 0c0-3.9-4.1-9.4-5.7-11.8-.2-.3-.5-.5-.8-.5Z" />
    </svg>
  );
}

/** Section 2: the pad change reminder, shown live in a Dynamic Island. */
export function IslandSection() {
  const t = useTranslations("Island");

  return (
    <section id="features" className="relative overflow-hidden bg-island-band text-white">
      <PosterStage bleed="bottom" className="grid px-58 grid-cols-[calc(320*var(--spacing))_1fr] max-poster:block max-poster:px-[clamp(20px,4vw,40px)]">
        <div className="relative z-3 self-center max-poster:max-w-[640px] max-poster:mx-auto max-poster:text-center">
          <h2 className="poster:text-balance max-w-295 text-white text-u-31 max-poster:max-w-none font-max leading-[0.95] tracking-[-0.015em] max-poster:text-[clamp(38px,7vw,54px)] max-phone:text-[36px]">
            <span className="block">{t("title1")}</span> <span className="block">{t("title2")}</span> <span className="block">{t("title3")}</span>
          </h2>
          <p className="mt-7 w-290 text-u-[12.6] font-demibold leading-[1.27] max-poster:w-auto max-poster:max-w-[520px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
        </div>

        <Rays shape="island" className="absolute z-2 text-sun left-358 top-[calc(var(--section-space)-24*var(--spacing))] w-44 max-poster:hidden" />

        <div
          className="relative z-1 ml-47 -mb-[calc(var(--section-space)+20*var(--spacing))] mt-12 self-end h-260 w-512 p-11 border-island-phone-border [border-width:calc(4*var(--spacing))_calc(4*var(--spacing))_0] rounded-t-[calc(92*var(--spacing))] bg-island-phone-bg [box-shadow:0_0_0_calc(1*var(--spacing))_var(--color-island-phone-shadow),0_calc(10*var(--spacing))_calc(30*var(--spacing))_var(--color-island-phone-shadow-2)] max-poster:[--spacing:calc(min(100vw-24px,620px)/512)] max-poster:mx-auto max-poster:mt-[30px] max-poster:mb-0 max-poster:h-150 max-phone:[--spacing:calc((100vw+40px)/512)] max-phone:mx-[-40px] max-phone:h-130"
          role="img"
          aria-label={t("phoneLabel")}
        >
          <div className="relative h-full overflow-hidden rounded-t-[calc(78*var(--spacing))] bg-[linear-gradient(180deg,var(--color-island-screen-top)_0%,var(--color-island-screen)_55%,var(--color-island-screen-bottom)_100%)] text-island-screen-text">
            <span className="absolute left-63 top-33 text-u-15 font-black tracking-[-0.01em] max-phone:left-70">9:41</span>
            <div
              className="absolute z-2 left-123 top-16 flex h-54 w-238 items-center pl-9 pr-7 rounded-full bg-black text-white [box-shadow:0_calc(3*var(--spacing))_calc(8*var(--spacing))_var(--color-island-notch-shadow)] max-phone:left-1/2 max-phone:-translate-x-1/2"
              aria-hidden="true"
            >
              <Image className="h-auto w-56 flex-none" src={LANDING_ASSETS.islandMochi} alt="" width={220} height={150} />
              <span className="grid flex-1 justify-items-center leading-none">
                <small className="text-u-11 font-extrabold">{t("timerPrefix")}</small>
                <IslandCountdown className="mt-3 text-u-22 font-black tracking-[0.01em] tabular-nums" />
              </span>
              <span className="grid size-40 flex-none place-items-center rounded-full bg-island-drop"><Drop /></span>
            </div>
            <StatusIcons className="absolute right-36 top-37 h-auto w-64 max-phone:right-46" />
            <i className="absolute z-0 rounded-[50%] bg-island-cloud-bg -left-30 top-118 h-140 w-220" />
            <i className="absolute z-0 rounded-[50%] bg-island-cloud-alt-bg -right-40 top-100 h-160 w-260" />
          </div>
        </div>

        <Rays shape="island" className="absolute z-2 text-sun left-944 top-[calc(var(--section-space)-20*var(--spacing))] w-44 max-poster:hidden" />
      </PosterStage>
    </section>
  );
}
