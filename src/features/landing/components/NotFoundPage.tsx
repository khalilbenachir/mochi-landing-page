import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/features/landing/components/shared/Button";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { Petal, Rays, Sparkle } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { localePath } from "@/i18n/routing";

export function NotFoundPage() {
  const locale = useLocale();
  const t = useTranslations("NotFound");
  const homeHref = localePath(locale);

  return (
    <main className="flex flex-1 flex-col bg-hero-band text-white">
      <section className="relative flex-1 overflow-hidden bg-hero-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]">
        <PosterStage
          spacing="none"
          className="relative z-1 flex min-h-[calc(100dvh-62*var(--spacing))] flex-col pt-6 pb-32 max-poster:min-h-[720px] max-poster:px-[clamp(20px,4vw,40px)] max-poster:pt-0 max-poster:pb-[44px] max-phone:min-h-[700px]"
        >
          <SiteHeader homeHref={homeHref} sectionBase={homeHref} />

          <div className="relative flex flex-1 flex-col items-center justify-center px-40 pt-16 text-center max-poster:px-0 max-poster:pt-[18px] max-phone:pt-[10px]">
            <Petal className="absolute left-94 top-174 w-28 text-hero-petal -rotate-35 max-poster:left-[4%] max-poster:top-[32%] max-poster:w-[26px]" />
            <Petal className="absolute right-88 top-130 w-24 text-hero-petal rotate-38 max-poster:right-[4%] max-poster:top-[25%] max-poster:w-[22px]" />

            <div
              data-testid="not-found-art"
              className="relative flex h-250 w-720 max-w-full items-end justify-center max-poster:h-[clamp(190px,37vw,310px)] max-poster:w-[min(100%,820px)] max-phone:h-[180px]"
            >
              <span
                data-not-found-digit
                aria-hidden="true"
                className="relative z-1 -mr-15 text-u-250 font-max leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:-mr-[10px] max-poster:text-[clamp(150px,32vw,260px)] max-phone:-mr-[7px] max-phone:text-[124px]"
              >
                4
              </span>

              <div className="relative z-2 -mb-4 w-280 flex-none max-poster:mb-[-5px] max-poster:w-[clamp(175px,33vw,280px)] max-phone:w-[150px]">
                <span
                  aria-hidden="true"
                  className="absolute -top-42 left-1/2 z-3 text-u-70 font-max leading-none text-island-band [text-shadow:0_calc(3*var(--spacing))_0_white] -translate-x-1/2 rotate-8 max-poster:-top-[45px] max-poster:text-[58px] max-phone:-top-[36px] max-phone:text-[46px]"
                >
                  ?
                </span>
                <Rays shape="hero" className="absolute -left-20 top-22 z-3 w-42 text-sun max-poster:-left-[24px] max-poster:top-[32px] max-poster:w-[38px] max-phone:-left-[17px] max-phone:top-[28px] max-phone:w-[30px]" />
                <Sparkle className="absolute -right-12 top-12 z-3 w-34 text-white max-poster:-right-[18px] max-poster:top-[20px] max-poster:w-[32px] max-phone:-right-[12px] max-phone:top-[18px] max-phone:w-[24px]" />
                <Image
                  className="relative h-auto w-full [filter:drop-shadow(0_calc(9*var(--spacing))_calc(10*var(--spacing))_var(--color-hero-title-shadow))]"
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
                className="relative z-1 -ml-8 text-u-250 font-max leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:-ml-[6px] max-poster:text-[clamp(150px,32vw,260px)] max-phone:-ml-[4px] max-phone:text-[124px]"
              >
                4
              </span>
            </div>

            <h1
              data-testid="not-found-title"
              className="mt-22 max-w-850 text-u-51 font-max leading-[0.96] tracking-[-0.02em] text-white [text-shadow:0_calc(3*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:mt-[28px] max-poster:flex max-poster:min-h-[1.92em] max-poster:max-w-[820px] max-poster:items-center max-poster:justify-center max-poster:text-[clamp(38px,7vw,62px)] max-phone:mt-[24px] max-phone:text-[38px]"
            >
              <span className="sr-only">{t("code")}: </span>
              {t("title")}
            </h1>
            <p
              data-testid="not-found-body"
              className="mt-10 max-w-900 text-u-17 font-bold leading-[1.35] max-poster:mt-[14px] max-poster:flex max-poster:min-h-[2.7em] max-poster:max-w-[900px] max-poster:items-center max-poster:justify-center max-poster:text-[18px] max-nav:max-w-[650px] max-phone:min-h-[4.05em] max-phone:text-[16px]"
            >
              {t("body")}
            </p>

            <div
              data-testid="not-found-actions"
              className="mt-20 flex items-center justify-center gap-14 max-poster:mt-[24px] max-poster:gap-[14px] max-nav:flex-wrap max-phone:w-full max-phone:flex-col"
            >
              <Button
                asChild
                variant="pill"
                className="h-49 px-32 text-u-17 font-ultra text-ink-navy focus-visible:ring-white focus-visible:ring-offset-hero-band max-poster:h-[58px] max-poster:px-[32px] max-poster:text-[18px] max-phone:w-[min(100%,310px)]"
              >
                <Link data-testid="not-found-home" href={homeHref}>{t("home")}</Link>
              </Button>
              <AppStoreBadge className="max-poster:h-[58px] max-phone:w-[min(100%,310px)] max-phone:justify-center max-phone:ps-[18px] max-phone:pe-[22px]" />
            </div>
          </div>
        </PosterStage>
      </section>
    </main>
  );
}
