import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { Button } from "@/components/ui/Button";
import { APP_STORE_URL } from "@/features/landing/content/landing";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";
import { AppleLogo, FreeSticker } from "./HeroSection";

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

/** Black App Store badge. The classes go through Button's className so Button's conflicting base classes are merged away. */
const STORE_BADGE = {
  band: {
    root: "[--u:inherit] gap-[calc(8*var(--u))] h-[calc(45*var(--u))] pl-[calc(15*var(--u))] pr-[calc(18*var(--u))] rounded-[calc(12*var(--u))] bg-closing-store-bg text-white no-underline transition-[transform] duration-200 ease-[var(--spring,ease)] hover:text-white hover:[transform:translateY(-2px)] focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-white focus-visible:outline-offset-3 motion-reduce:transition-none motion-reduce:hover:[transform:none] max-poster:h-[56px] max-poster:gap-[10px] max-poster:pl-[16px] max-poster:pr-[18px] max-poster:rounded-[14px]",
    apple: "h-[calc(28*var(--u))] w-[calc(24*var(--u))] flex-none max-poster:h-[30px] max-poster:w-[26px]",
    small: "text-[calc(10.4*var(--u))] font-[700] max-poster:text-[11px]",
    strong: "mt-[calc(1*var(--u))] text-[calc(21*var(--u))] font-[900] tracking-[-0.01em] max-poster:text-[22px]",
  },
  footer: {
    root: "[--u:inherit] gap-[calc(8*var(--u))] h-[calc(51*var(--u))] pl-[calc(17*var(--u))] pr-[calc(22*var(--u))] rounded-[calc(12*var(--u))] bg-closing-store-bg text-white no-underline transition-[transform] duration-200 ease-[var(--spring,ease)] hover:text-white hover:[transform:translateY(-2px)] focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-white focus-visible:outline-offset-3 motion-reduce:transition-none motion-reduce:hover:[transform:none] max-poster:h-[50px] max-poster:gap-[10px] max-poster:pl-[16px] max-poster:pr-[18px] max-poster:rounded-[14px] max-phone:hidden",
    apple: "h-[calc(28*var(--u))] w-[calc(24*var(--u))] flex-none",
    small: "text-[calc(11.5*var(--u))] font-[700] max-poster:text-[11px]",
    strong: "mt-[calc(1*var(--u))] text-[calc(23*var(--u))] font-[900] tracking-[-0.01em] max-poster:text-[22px]",
  },
} as const;

function StoreBadge({ variant }: { variant: keyof typeof STORE_BADGE }) {
  const t = useTranslations("Common");
  const badge = STORE_BADGE[variant];

  return (
    <Button asChild variant="unstyled" size="unstyled" className={badge.root}>
      <a href={APP_STORE_URL} aria-label={t("appStoreAria")}>
        <AppleLogo className={badge.apple} />
        <span className="grid text-left leading-none"><small className={badge.small}>{t("downloadOn")}</small><strong className={badge.strong}>{t("appStore")}</strong></span>
      </a>
    </Button>
  );
}

/** "Say hi to Mochi" and the site footer, drawn as one poster like the maquette. */
export function ClosingSection() {
  const t = useTranslations("Closing");
  const common = useTranslations("Common");

  return (
    <>
      <section id="get" className="relative overflow-hidden bg-closing-band text-white">
        <PosterStage bleed="bottom" className="grid items-center pl-[calc(56*var(--u))] [grid-template-columns:calc(410*var(--u))_auto] max-poster:grid-cols-1 max-poster:justify-items-center max-poster:px-[clamp(16px,4vw,40px)] max-poster:text-center">
          <div className="relative z-2 max-w-[calc(355*var(--u))] max-poster:max-w-none">
            <h2 className="poster:text-balance m-0 text-white text-[calc(45*var(--u))] font-[1000] leading-none tracking-[-0.015em] max-poster:text-[clamp(38px,7vw,52px)] max-phone:text-[38px]">{t("title")}</h2>
            <p className="poster:text-balance mt-[calc(5*var(--u))] mb-0 mx-0 text-[calc(16.6*var(--u))] font-[650] leading-[1.3] max-poster:max-w-[460px] max-poster:mt-[12px] max-poster:mx-auto max-poster:text-[17px] max-phone:text-[15px]">
              <span className="block max-poster:inline">{t("body1")}</span> <span className="block max-poster:inline">{t("body2")}</span>
            </p>
          </div>
          <Rays className={cn(RAYS, "left-[calc(409*var(--u))] top-[calc(26*var(--u))] w-[calc(36*var(--u))]")} />
          <div className="relative z-3 flex items-center max-poster:mt-[22px]">
            <StoreBadge variant="band" />
            <FreeSticker className="relative block w-[calc(82*var(--u))] ml-[calc(-8*var(--u))] mt-[calc(-16*var(--u))] max-poster:w-[84px] max-poster:mt-[-16px] [&>svg+svg]:hidden [&>svg:first-child]:block [&>svg:first-child]:w-full [&>svg:first-child]:h-auto" />
          </div>
          <Rays className={cn(RAYS, "left-[calc(705*var(--u))] top-[calc(28*var(--u))] w-[calc(38*var(--u))]")} flip />
          <Image className="absolute z-1 left-[calc(722*var(--u))] bottom-[calc(-7*var(--u))] h-auto w-[calc(202*var(--u))] max-w-none max-poster:relative max-poster:left-auto max-poster:bottom-auto max-poster:mb-[-40px] max-poster:mt-[14px] max-poster:w-[min(70vw,340px)]" src={LANDING_ASSETS.closingMochi} alt={t("imageAlt")} width={900} height={648} sizes="(max-width: 1099px) 60vw, 19vw" />
          <svg className="absolute z-2 left-[calc(914*var(--u))] top-[calc(33*var(--u))] w-[calc(42*var(--u))] [transform:rotate(14deg)] max-poster:hidden" viewBox="0 0 24 24" aria-hidden="true">
            <path className="stroke-white" fill="none" strokeWidth="2.4" strokeLinejoin="round" d="M12 20.2C5.9 16 3 12.6 3 8.9 3 6.2 5.1 4.2 7.6 4.2c1.8 0 3.3.9 4.4 2.4 1.1-1.5 2.6-2.4 4.4-2.4 2.5 0 4.6 2 4.6 4.7 0 3.7-2.9 7.1-9 11.3Z" />
          </svg>
        </PosterStage>
      </section>

      <footer className="relative bg-mochi-pink">
        <PosterStage spacing="none">
          <div className="flex h-[calc(62*var(--u))] items-center justify-between pl-[calc(196*var(--u))] pr-[calc(203*var(--u))] rounded-[calc(22*var(--u))_calc(22*var(--u))_0_0] bg-white max-poster:relative max-poster:z-2 max-poster:h-auto max-poster:flex-wrap max-poster:justify-center max-poster:[gap:16px_28px] max-poster:px-[20px] max-poster:py-[22px] max-poster:rounded-[24px_24px_0_0]">
            <a href="#top" className="flex items-center gap-[calc(20*var(--u))] text-ink-black no-underline max-poster:gap-[14px]" aria-label={common("backToTop")}>
              <Image className="h-[calc(50*var(--u))] w-[calc(50*var(--u))] rounded-[calc(13*var(--u))] max-poster:h-[46px] max-poster:w-[46px] max-poster:rounded-[12px]" src={LANDING_ASSETS.appIcon} alt="" width={256} height={256} />
              <i className="h-[calc(26*var(--u))] w-[calc(1.5*var(--u))] bg-closing-brand-divider" aria-hidden="true" />
              <b className="text-[calc(24.5*var(--u))] font-[1000] tracking-[-0.02em] max-poster:text-[20px]">{t("brand")}</b>
            </a>
            <StoreBadge variant="footer" />
          </div>
        </PosterStage>
      </footer>
    </>
  );
}
