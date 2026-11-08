import Image from "next/image";
import { useTranslations } from "next-intl";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { Button } from "@/components/ui/Button";
import { APP_STORE_URL } from "@/features/landing/content/landing";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { MobileMenu } from "@/features/landing/components/sections/MobileMenu";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#features", key: "features" },
  { href: "#flavors", key: "flavors" },
  { href: "#privacy", key: "privacy" },
  { href: "#faq", key: "faq" },
] as const;

const MOBILE_NAV = [
  ...NAV.slice(0, 3),
  { href: "#plus", key: "plus" as const },
  NAV[3],
] as const;

/** Mascot art for the hero. Swap this one path to change the illustration. */
export const HERO_MASCOT = { src: LANDING_ASSETS.heroMochi, width: 1400, height: 1120 } as const;

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

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
  // Longer words (GRATUIT) get a smaller size and a fixed run so they stay inside the blob.
  const long = label.length > 5;

  return (
    <span className={className} aria-label={t("free")}>
      <svg viewBox="0 0 100 64" aria-hidden="true">
        <path className="fill-sun" d="M14 12c6-6 14-3 19-7 6-4 13-5 19-1 6-3 14-2 19 2 7 0 13 4 15 10 6 4 8 11 5 17 2 7-1 13-7 16-3 6-10 9-17 8-6 4-14 4-20 1-7 2-14 0-18-5-7-1-12-6-12-13-5-5-5-12 0-17-1-5 2-9 7-11Z" />
        <text className="fill-ink-black" x="50" y={long ? 39 : 41} textAnchor="middle" fontSize={long ? 16 : 24} fontWeight="1000" fontFamily="inherit" transform="rotate(-9 50 34)" textLength={long ? 64 : undefined} lengthAdjust={long ? "spacingAndGlyphs" : undefined}>{label}</text>
      </svg>
      <Rays className="absolute right-[calc(-20*var(--u))] top-[calc(4*var(--u))] w-[calc(22*var(--u))] text-sun [transform:scaleX(-1)_rotate(10deg)]" />
    </span>
  );
}

const appStoreBadge = cva(
  "inline-flex items-center gap-[calc(8*var(--u))] h-[calc(49*var(--u))] [padding-inline:calc(22*var(--u))_calc(26*var(--u))] rounded-full bg-white text-ink-black no-underline [box-shadow:0_calc(3*var(--u))_0_var(--color-hero-badge-shadow)] transition-[transform,box-shadow] duration-250 ease-smooth hover:text-ink-black hover:[transform:translateY(-2px)] hover:[box-shadow:0_calc(3*var(--u)+2px)_0_var(--color-hero-badge-shadow)] active:duration-100 active:[transform:translateY(1px)] active:[box-shadow:0_calc(3*var(--u)-1px)_0_var(--color-hero-badge-shadow)] motion-reduce:hover:[transform:none] motion-reduce:active:[transform:none]",
  {
    variants: {
      compact: {
        true: "gap-[calc(5*var(--u))] h-[calc(29*var(--u))] [padding-inline:calc(14*var(--u))_calc(16*var(--u))] [box-shadow:none] hover:[box-shadow:none] active:[box-shadow:none] active:[transform:translateY(0)_scale(0.96)] text-[calc(10.5*var(--u))] font-black max-poster:h-[34px] max-poster:text-[12px]",
        false: "",
      },
      dark: {
        true: "bg-ink-black text-white [box-shadow:none] hover:text-white hover:[box-shadow:none] active:[box-shadow:none] active:[transform:translateY(0)_scale(0.98)]",
        false: "",
      },
    },
    defaultVariants: { compact: false, dark: false },
  },
);

const appleLogo = cva("flex-none", {
  variants: {
    compact: {
      true: "w-[calc(15*var(--u))] h-[calc(17*var(--u))]",
      false: "w-[calc(26*var(--u))] h-[calc(30*var(--u))]",
    },
  },
});

export function AppStoreBadge({ compact = false, dark = false, className }: { compact?: boolean; dark?: boolean; className?: string }) {
  const t = useTranslations("Common");

  return (
    <Button asChild variant="unstyled" size="unstyled" className={cn(appStoreBadge({ compact, dark }), className)}>
      <a href={APP_STORE_URL} aria-label={t("appStoreAria")}>
        <AppleLogo className={appleLogo({ compact })} />
        {compact ? (
          <span>{t("download")}</span>
        ) : (
          <span className="grid text-left leading-none">
            <small className="text-[calc(11*var(--u))] font-[800]">{t("downloadOn")}</small>
            <strong className="mt-[calc(1*var(--u))] text-[calc(21*var(--u))] font-[950] tracking-[-0.02em] max-phone:text-[19px]">{t("appStore")}</strong>
          </span>
        )}
      </a>
    </Button>
  );
}

function Header() {
  const navigation = useTranslations("Navigation");
  const common = useTranslations("Common");

  return (
    <header className="relative z-10 ml-[calc(55*var(--u))] mr-[calc(49*var(--u))] flex h-[calc(36*var(--u))] items-center max-poster:mx-0 max-poster:h-[72px] max-nav:h-[68px]">
      <a
        href="#top"
        className="flex items-center gap-[calc(6*var(--u))] text-white text-[calc(25*var(--u))] font-[950] tracking-[-0.02em] no-underline hover:text-white max-poster:gap-[8px] max-poster:text-[26px] max-nav:text-[24px]"
        aria-label={common("brandHome")}
      >
        <Image className="w-[calc(42*var(--u))] h-auto max-poster:w-[44px] max-nav:w-[40px]" src={LANDING_ASSETS.faces.happy} alt="" width={58} height={46} priority />
        <span>{common("brand")}</span>
      </a>
      <nav className="absolute left-[calc(225*var(--u))] flex gap-[calc(45*var(--u))] max-poster:static max-poster:ml-auto max-poster:mr-[28px] max-poster:gap-[28px] max-nav:hidden" aria-label={navigation("mainLabel")}>
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-white text-[calc(14.5*var(--u))] font-[850] no-underline hover:text-white hover:underline hover:underline-offset-4 max-poster:text-[15px]"
          >
            {navigation(item.key)}
          </a>
        ))}
      </nav>
      <LocaleSwitcher className="ml-auto max-nav:hidden" />
      <div className="ml-[calc(10*var(--u))] max-poster:ml-[12px] max-nav:hidden"><AppStoreBadge compact /></div>
      <MobileMenu label={navigation("openMenu")} navLabel={navigation("mobileLabel")}>
        {MOBILE_NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-[14px] py-3 border-b border-hero-menu-link-border text-hero-menu-link-text font-[900] no-underline"
          >
            {navigation(item.key)}
          </a>
        ))}
        <LocaleSwitcher className="mt-2 mx-auto mb-[2px] border-hero-locale-mobile-border bg-hero-locale-mobile-bg [&_a]:text-ink-navy [&_a:hover]:text-ink-navy [&_a[aria-current=page]]:bg-brand-coral [&_a[aria-current=page]]:text-white" />
        <AppStoreBadge dark className="mt-2 justify-center" />
      </MobileMenu>
    </header>
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
        <Header />

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
