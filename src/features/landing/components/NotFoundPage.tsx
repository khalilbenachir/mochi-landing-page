import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { localePath } from "@/i18n/routing";

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

export function NotFoundPage() {
  const locale = useLocale();
  const t = useTranslations("NotFound");
  const homeHref = localePath(locale);

  return (
    <main className="flex flex-1 flex-col bg-hero-band text-white">
      <section className="relative flex-1 overflow-hidden bg-hero-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:content-[''] min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]">
        <PosterStage
          spacing="none"
          className="relative z-1 flex min-h-[calc(100dvh-62*var(--u))] flex-col pt-[calc(6*var(--u))] pb-[calc(32*var(--u))] max-poster:min-h-[720px] max-poster:px-[clamp(20px,4vw,40px)] max-poster:pt-0 max-poster:pb-[44px] max-phone:min-h-[700px]"
        >
          <SiteHeader homeHref={homeHref} sectionBase={homeHref} />

          <div className="relative flex flex-1 flex-col items-center justify-center px-[calc(40*var(--u))] pt-[calc(16*var(--u))] text-center max-poster:px-0 max-poster:pt-[18px] max-phone:pt-[10px]">
            <Petal className="absolute left-[calc(94*var(--u))] top-[calc(174*var(--u))] w-[calc(28*var(--u))] text-hero-petal [transform:rotate(-35deg)] max-poster:left-[4%] max-poster:top-[32%] max-poster:w-[26px]" />
            <Petal className="absolute right-[calc(88*var(--u))] top-[calc(130*var(--u))] w-[calc(24*var(--u))] text-hero-petal [transform:rotate(38deg)] max-poster:right-[4%] max-poster:top-[25%] max-poster:w-[22px]" />

            <div
              data-testid="not-found-art"
              className="relative flex h-[calc(250*var(--u))] w-[calc(720*var(--u))] max-w-full items-end justify-center max-poster:h-[clamp(190px,37vw,310px)] max-poster:w-[min(100%,820px)] max-phone:h-[180px]"
            >
              <span
                data-not-found-digit
                aria-hidden="true"
                className="relative z-1 -mr-[calc(15*var(--u))] text-[calc(250*var(--u))] font-[1000] leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--u))_0_var(--color-hero-title-shadow)] max-poster:-mr-[10px] max-poster:text-[clamp(150px,32vw,260px)] max-phone:-mr-[7px] max-phone:text-[124px]"
              >
                4
              </span>

              <div className="relative z-2 mb-[calc(-4*var(--u))] w-[calc(280*var(--u))] flex-none max-poster:mb-[-5px] max-poster:w-[clamp(175px,33vw,280px)] max-phone:w-[150px]">
                <span
                  aria-hidden="true"
                  className="absolute -top-[calc(42*var(--u))] left-1/2 z-3 text-[calc(70*var(--u))] font-[1000] leading-none text-island-band [text-shadow:0_calc(3*var(--u))_0_white] [transform:translateX(-50%)_rotate(8deg)] max-poster:-top-[45px] max-poster:text-[58px] max-phone:-top-[36px] max-phone:text-[46px]"
                >
                  ?
                </span>
                <Rays className="absolute -left-[calc(20*var(--u))] top-[calc(22*var(--u))] z-3 w-[calc(42*var(--u))] text-sun max-poster:-left-[24px] max-poster:top-[32px] max-poster:w-[38px] max-phone:-left-[17px] max-phone:top-[28px] max-phone:w-[30px]" />
                <Sparkle className="absolute -right-[calc(12*var(--u))] top-[calc(12*var(--u))] z-3 w-[calc(34*var(--u))] text-white max-poster:-right-[18px] max-poster:top-[20px] max-poster:w-[32px] max-phone:-right-[12px] max-phone:top-[18px] max-phone:w-[24px]" />
                <Image
                  className="relative h-auto w-full [filter:drop-shadow(0_calc(9*var(--u))_calc(10*var(--u))_var(--color-hero-title-shadow))]"
                  src={LANDING_ASSETS.notFoundMascot}
                  alt={t("mascotAlt")}
                  width={1254}
                  height={1254}
                  priority
                  sizes="(max-width: 480px) 150px, (max-width: 1099px) 33vw, 28vw"
                />
              </div>

              <span
                data-not-found-digit
                aria-hidden="true"
                className="relative z-1 -ml-[calc(8*var(--u))] text-[calc(250*var(--u))] font-[1000] leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--u))_0_var(--color-hero-title-shadow)] max-poster:-ml-[6px] max-poster:text-[clamp(150px,32vw,260px)] max-phone:-ml-[4px] max-phone:text-[124px]"
              >
                4
              </span>
            </div>

            <h1
              data-testid="not-found-title"
              className="m-0 mt-[calc(22*var(--u))] max-w-[calc(850*var(--u))] text-[calc(51*var(--u))] font-[1000] leading-[0.96] tracking-[-0.02em] text-white [text-shadow:0_calc(3*var(--u))_0_var(--color-hero-title-shadow)] max-poster:mt-[28px] max-poster:flex max-poster:min-h-[1.92em] max-poster:max-w-[820px] max-poster:items-center max-poster:justify-center max-poster:text-[clamp(38px,7vw,62px)] max-phone:mt-[24px] max-phone:text-[38px]"
            >
              <span className="sr-only">{t("code")}: </span>
              {t("title")}
            </h1>
            <p
              data-testid="not-found-body"
              className="m-0 mt-[calc(10*var(--u))] max-w-[calc(900*var(--u))] text-[calc(17*var(--u))] font-[700] leading-[1.35] max-poster:mt-[14px] max-poster:flex max-poster:min-h-[2.7em] max-poster:max-w-[900px] max-poster:items-center max-poster:justify-center max-poster:text-[18px] max-nav:max-w-[650px] max-phone:min-h-[4.05em] max-phone:text-[16px]"
            >
              {t("body")}
            </p>

            <div
              data-testid="not-found-actions"
              className="mt-[calc(20*var(--u))] flex items-center justify-center gap-[calc(14*var(--u))] max-poster:mt-[24px] max-poster:gap-[14px] max-nav:flex-wrap max-phone:w-full max-phone:flex-col"
            >
              <Button
                asChild
                variant="unstyled"
                size="unstyled"
                className="h-[calc(49*var(--u))] rounded-full bg-white px-[calc(32*var(--u))] text-[calc(17*var(--u))] font-[950] text-ink-navy no-underline [box-shadow:0_calc(3*var(--u))_0_var(--color-hero-badge-shadow)] transition-[transform,box-shadow] duration-250 ease-smooth hover:text-ink-navy hover:[transform:translateY(-2px)] hover:[box-shadow:0_calc(3*var(--u)+2px)_0_var(--color-hero-badge-shadow)] active:duration-100 active:[transform:translateY(1px)] active:[box-shadow:0_calc(3*var(--u)-1px)_0_var(--color-hero-badge-shadow)] focus-visible:ring-white focus-visible:ring-offset-hero-band motion-reduce:hover:[transform:none] motion-reduce:active:[transform:none] max-poster:h-[58px] max-poster:px-[32px] max-poster:text-[18px] max-phone:w-[min(100%,310px)]"
              >
                <Link data-testid="not-found-home" href={homeHref}>{t("home")}</Link>
              </Button>
              <AppStoreBadge className="max-poster:h-[58px] max-phone:w-[min(100%,310px)] max-phone:justify-center max-phone:[padding-inline:18px_22px]" />
            </div>
          </div>
        </PosterStage>
      </section>
    </main>
  );
}
