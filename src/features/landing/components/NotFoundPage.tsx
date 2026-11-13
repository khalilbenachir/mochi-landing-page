import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/features/landing/components/shared/Button";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { Petal, Rays } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { localePath } from "@/i18n/routing";

export function NotFoundPage() {
  const locale = useLocale();
  const t = useTranslations("NotFound");
  const homeHref = localePath(locale);

  return (
    <main className="flex flex-1 flex-col bg-island-band text-white">
      <SiteHeader homeHref={homeHref} sectionBase={homeHref} />
      <section className="relative flex-1 overflow-hidden bg-island-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-not-found-vignette))]">
        <PosterStage
          spacing="none"
          className="relative z-1 flex min-h-[calc(100dvh-62*var(--spacing))] flex-col pb-32 max-poster:min-h-[720px] max-poster:px-[clamp(20px,4vw,40px)] max-poster:pb-[44px] max-phone:min-h-[700px]"
        >
          <div className="relative flex flex-1 flex-col items-center justify-center px-40 pt-16 text-center max-poster:px-0 max-poster:pt-[18px] max-phone:pt-[10px]">
            <Petal className="absolute left-94 top-174 w-28 text-hero-petal -rotate-35 max-poster:left-[4%] max-poster:top-[32%] max-poster:w-[26px]" />
            <Petal className="absolute right-88 top-130 w-24 text-hero-petal rotate-38 max-poster:right-[4%] max-poster:top-[25%] max-poster:w-[22px]" />

            <div
              data-testid="not-found-art"
              className="relative flex h-250 w-640 max-w-full items-end justify-center max-poster:h-[clamp(190px,34vw,280px)] max-poster:w-[min(100%,820px)] max-phone:h-[180px]"
            >
              <span
                data-not-found-digit
                aria-hidden="true"
                className="relative z-1 -mr-15 text-u-210 font-max leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--spacing))_0_var(--color-island-phone-shadow-2)] max-poster:-mr-[10px] max-poster:text-[clamp(130px,28vw,225px)] max-phone:-mr-[7px] max-phone:text-[110px]"
              >
                4
              </span>

              <div className="relative z-2 -mb-4 w-220 flex-none max-poster:mb-[-5px] max-poster:w-[clamp(150px,29vw,240px)] max-phone:w-[135px]">
                <span
                  aria-hidden="true"
                  className="absolute -top-32 left-1/2 z-3 text-u-54 font-max leading-none text-sun [text-shadow:0_calc(3*var(--spacing))_0_var(--color-island-phone-shadow-2)] -translate-x-1/2 rotate-8 max-poster:-top-[36px] max-poster:text-[50px] max-phone:-top-[30px] max-phone:text-[40px]"
                >
                  ?
                </span>
                <Rays shape="hero" className="absolute -left-20 top-22 z-3 w-42 text-sun max-poster:-left-[24px] max-poster:top-[32px] max-poster:w-[38px] max-phone:-left-[17px] max-phone:top-[28px] max-phone:w-[30px]" />
                <Image
                  className="relative h-auto w-full [filter:drop-shadow(0_calc(9*var(--spacing))_calc(10*var(--spacing))_var(--color-island-phone-shadow-2))]"
                  src={LANDING_ASSETS.notFoundMascot}
                  alt={t("mascotAlt")}
                  width={1254}
                  height={1254}
                  priority
                  sizes="(max-width: 480px) 135px, (max-width: 1099px) 29vw, 22vw"
                />
              </div>

              <span
                data-not-found-digit
                aria-hidden="true"
                className="relative z-1 -ml-8 text-u-210 font-max leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--spacing))_0_var(--color-island-phone-shadow-2)] max-poster:-ml-[6px] max-poster:text-[clamp(130px,28vw,225px)] max-phone:-ml-[4px] max-phone:text-[110px]"
              >
                4
              </span>
            </div>

            <h1
              data-testid="not-found-title"
              className="mt-22 max-w-850 text-u-44 font-max leading-[0.96] tracking-[-0.02em] text-white [text-shadow:0_calc(3*var(--spacing))_0_var(--color-island-phone-shadow-2)] max-poster:mt-[28px] max-poster:flex max-poster:min-h-[1.92em] max-poster:max-w-[820px] max-poster:items-center max-poster:justify-center max-poster:text-[clamp(34px,6vw,54px)] max-phone:mt-[24px] max-phone:text-[34px]"
            >
              <span className="sr-only">{t("code")}: </span>
              {t("title")}
            </h1>
            <p
              data-testid="not-found-body"
              className="mt-10 max-w-900 text-u-16 font-bold leading-[1.35] max-poster:mt-[14px] max-poster:flex max-poster:min-h-[2.7em] max-poster:max-w-[900px] max-poster:items-center max-poster:justify-center max-poster:text-[17px] max-nav:max-w-[650px] max-phone:min-h-[4.05em] max-phone:text-[16px]"
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
                className="h-42 px-26 text-u-15 font-ultra text-ink-navy focus-visible:ring-white focus-visible:ring-offset-island-band max-poster:h-[48px] max-poster:px-[24px] max-poster:text-[16px] max-phone:w-[min(100%,260px)]"
              >
                <Link data-testid="not-found-home" href={homeHref}>{t("home")}</Link>
              </Button>
              <AppStoreBadge className="h-42 gap-6 ps-18 pe-22 [&_svg]:h-26 [&_svg]:w-22 [&_small]:text-u-9.5 [&_strong]:text-u-18 max-poster:h-[48px] max-phone:w-[min(100%,260px)] max-phone:[&_strong]:text-[17px]" />
            </div>
          </div>
        </PosterStage>
      </section>
    </main>
  );
}
