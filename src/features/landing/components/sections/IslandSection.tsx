import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { IslandCountdown } from "./IslandCountdown";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 44" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5">
        <path d="M8 4 14 16" /><path d="M20 12 28 22" /><path d="M16 34 32 31" />
      </g>
    </svg>
  );
}

export function StatusIcons({ className = "absolute right-[calc(36*var(--u))] top-[calc(37*var(--u))] h-auto w-[calc(64*var(--u))] max-phone:right-[calc(46*var(--u))]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 14" aria-hidden="true">
      <g fill="currentColor">
        <rect x="0" y="9" width="3" height="4" rx="1" /><rect x="5" y="6.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="4" width="3" height="9" rx="1" /><rect x="15" y="1.5" width="3" height="11.5" rx="1" />
        <path d="M31 13 28.2 10.1a4 4 0 0 1 5.6 0Z" />
        <path d="M24.6 6.6a9 9 0 0 1 12.8 0l-1.8 1.8a6.5 6.5 0 0 0-9.2 0Z" />
        <path d="M21.4 3.4a13.5 13.5 0 0 1 19.2 0l-1.6 1.6a11.2 11.2 0 0 0-16 0Z" />
        <rect x="47" y="2" width="19" height="10" rx="3" />
        <rect x="67.2" y="5" width="1.8" height="4" rx=".9" />
      </g>
    </svg>
  );
}

function Drop() {
  return (
    <svg className="h-[55%] w-[55%]" viewBox="0 0 24 24" aria-hidden="true">
      <path className="fill-white" d="M12 2.5c-.3 0-.6.2-.8.5C9.6 5.4 5.5 10.9 5.5 14.8a6.5 6.5 0 0 0 13 0c0-3.9-4.1-9.4-5.7-11.8-.2-.3-.5-.5-.8-.5Z" />
    </svg>
  );
}

/** Section 2: the pad change reminder, shown live in a Dynamic Island. */
export function IslandSection() {
  const t = useTranslations("Island");

  return (
    <section id="features" className="relative overflow-hidden bg-island-band text-white">
      <PosterStage bleed="bottom" className="grid px-[calc(58*var(--u))] [grid-template-columns:calc(320*var(--u))_1fr] max-poster:block max-poster:px-[clamp(20px,4vw,40px)]">
        <div className="relative z-3 self-center max-poster:max-w-[640px] max-poster:mx-auto max-poster:text-center">
          <h2 className="poster:text-balance m-0 max-w-[calc(295*var(--u))] text-white text-[calc(31*var(--u))] max-poster:max-w-none font-[1000] leading-[0.95] tracking-[-0.015em] max-poster:text-[clamp(38px,7vw,54px)] max-phone:text-[36px]">
            <span className="block">{t("title1")}</span> <span className="block">{t("title2")}</span> <span className="block">{t("title3")}</span>
          </h2>
          <p className="mt-[calc(7*var(--u))] mb-0 mx-0 w-[calc(290*var(--u))] text-[calc(12.6*var(--u))] font-[650] leading-[1.27] max-poster:w-auto max-poster:max-w-[520px] max-poster:mt-[14px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">{t("body")}</p>
        </div>

        <Rays className="absolute z-2 text-sun left-[calc(358*var(--u))] top-[calc(46*var(--u))] w-[calc(38*var(--u))] max-poster:hidden" />

        <div
          className="relative z-1 ml-[calc(47*var(--u))] -mb-[calc(var(--section-space)+60*var(--u))] mt-[calc(12*var(--u))] self-end h-[calc(200*var(--u))] w-[calc(512*var(--u))] p-[calc(11*var(--u))] border-solid border-island-phone-border [border-width:calc(4*var(--u))_calc(4*var(--u))_0] rounded-[calc(92*var(--u))_calc(92*var(--u))_0_0] bg-island-phone-bg [box-shadow:0_0_0_calc(1*var(--u))_var(--color-island-phone-shadow),0_calc(10*var(--u))_calc(30*var(--u))_var(--color-island-phone-shadow-2)] max-poster:[--u:calc(min(100vw-24px,620px)/512)] max-poster:mx-auto max-poster:mt-[30px] max-poster:mb-0 max-poster:h-[calc(150*var(--u))] max-phone:[--u:calc((100vw+40px)/512)] max-phone:mx-[-40px] max-phone:h-[calc(130*var(--u))]"
          role="img"
          aria-label={t("phoneLabel")}
        >
          <div className="relative h-full overflow-hidden rounded-[calc(78*var(--u))_calc(78*var(--u))_0_0] bg-[linear-gradient(180deg,var(--color-island-screen-top)_0%,var(--color-island-screen)_55%,var(--color-island-screen-bottom)_100%)] text-island-screen-text">
            <span className="absolute left-[calc(63*var(--u))] top-[calc(33*var(--u))] text-[calc(15*var(--u))] font-[900] tracking-[-0.01em] max-phone:left-[calc(70*var(--u))]">9:41</span>
            <div
              className="absolute z-2 left-[calc(123*var(--u))] top-[calc(16*var(--u))] flex h-[calc(54*var(--u))] w-[calc(238*var(--u))] items-center pl-[calc(9*var(--u))] pr-[calc(7*var(--u))] rounded-[999px] bg-black text-white [box-shadow:0_calc(3*var(--u))_calc(8*var(--u))_var(--color-island-notch-shadow)] max-phone:left-[50%] max-phone:[transform:translateX(-50%)]"
              aria-hidden="true"
            >
              <Image className="h-auto w-[calc(56*var(--u))] flex-none" src={LANDING_ASSETS.islandMochi} alt="" width={220} height={150} />
              <span className="grid flex-1 justify-items-center leading-none">
                <small className="text-[calc(11*var(--u))] font-[800]">{t("timerPrefix")}</small>
                <IslandCountdown className="mt-[calc(3*var(--u))] text-[calc(22*var(--u))] font-[900] tracking-[0.01em] tabular-nums" label={t("countdownLabel")} />
              </span>
              <span className="grid h-[calc(40*var(--u))] w-[calc(40*var(--u))] flex-none place-items-center rounded-[50%] bg-island-drop"><Drop /></span>
            </div>
            <StatusIcons />
            <i className="absolute z-0 rounded-[50%] bg-island-cloud-bg left-[calc(-30*var(--u))] top-[calc(118*var(--u))] h-[calc(140*var(--u))] w-[calc(220*var(--u))]" />
            <i className="absolute z-0 rounded-[50%] bg-island-cloud-alt-bg right-[calc(-40*var(--u))] top-[calc(100*var(--u))] h-[calc(160*var(--u))] w-[calc(260*var(--u))]" />
          </div>
        </div>

        <Rays className="absolute z-2 text-sun left-[calc(944*var(--u))] top-[calc(50*var(--u))] w-[calc(40*var(--u))] max-poster:hidden" />
      </PosterStage>
    </section>
  );
}
