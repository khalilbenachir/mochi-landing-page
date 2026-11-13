import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/features/landing/components/shared/Button";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { Petal } from "@/features/landing/components/shared/decor";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { blogPath } from "@/features/blog/locales";
import { localePath, type AppLocale } from "@/i18n/routing";

export function NotFoundPage() {
  const locale = useLocale();
  const t = useTranslations("NotFound");
  const homeHref = localePath(locale);
  const navigation = useTranslations("Navigation");
  const shortcuts = [
    { key: "blog", href: blogPath(locale as AppLocale) },
    { key: "flavors", href: `${homeHref}#flavors` },
    { key: "privacy", href: `${homeHref}#privacy` },
    { key: "faq", href: `${homeHref}#faq` },
  ] as const;

  return (
    <main className="flex flex-1 flex-col bg-hero-band text-white">
      <SiteHeader homeHref={homeHref} sectionBase={homeHref} />
      <section className="relative flex-1 overflow-hidden bg-hero-band text-white min-wide:before:absolute min-wide:before:inset-0 min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]">
        <PosterStage
          spacing="none"
          className="relative z-1 flex min-h-[calc(100dvh-62*var(--spacing))] flex-col pb-32 max-poster:min-h-[720px] max-poster:px-[clamp(20px,4vw,40px)] max-poster:pb-[44px] max-phone:min-h-[700px]"
        >
          <div className="relative flex flex-1 flex-col items-center justify-center px-40 pt-16 text-center max-poster:px-0 max-poster:pt-[18px] max-phone:pt-[10px]">
            <Petal className="absolute left-94 top-174 w-28 text-hero-petal -rotate-35 max-poster:left-[4%] max-poster:top-[32%] max-poster:w-[26px]" />
            <Petal className="absolute right-88 top-130 w-24 text-hero-petal rotate-38 max-poster:right-[4%] max-poster:top-[25%] max-poster:w-[22px]" />

            <div
              data-testid="not-found-art"
              className="relative flex h-250 w-640 max-w-full items-center justify-center max-poster:h-[clamp(190px,34vw,280px)] max-poster:w-[min(100%,820px)] max-phone:h-[180px]"
            >
              <span
                data-not-found-digit
                aria-hidden="true"
                className="relative z-1 text-u-210 font-max leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:text-[clamp(130px,28vw,225px)] max-phone:text-[110px]"
              >
                4
              </span>

              <div className="relative z-2 mx-6 mb-6 size-210 flex-none max-poster:mx-[4px] max-poster:mb-[6px] max-poster:size-[clamp(150px,27vw,220px)] max-phone:size-[128px]">
                {/* The "0" is a magnifying glass: a lens ring with Mochi searching inside, and its handle. */}
                <span aria-hidden="true" className="absolute top-[80%] left-[80%] h-[15%] w-[34%] origin-left rotate-45 rounded-full bg-white [box-shadow:0_calc(7*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:[box-shadow:0_6px_0_var(--color-hero-title-shadow)]" />
                <span aria-hidden="true" className="absolute inset-0 rounded-full border-[length:calc(16*var(--spacing))] border-white bg-white/25 [box-shadow:0_calc(7*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:border-[clamp(11px,2vw,16px)] max-poster:[box-shadow:0_6px_0_var(--color-hero-title-shadow)]" />
                <span aria-hidden="true" className="absolute top-[18%] left-[20%] h-[22%] w-[9%] rotate-35 rounded-full bg-white/70" />
                <Image
                  className="absolute inset-[13%] h-auto w-[74%] animate-float"
                  src={LANDING_ASSETS.notFoundMascot}
                  alt={t("mascotAlt")}
                  width={1254}
                  height={1254}
                  priority
                  sizes="(max-width: 480px) 100px, (max-width: 1099px) 22vw, 16vw"
                />
                <span aria-hidden="true" className="absolute -top-14 -right-26 z-3 grid size-50 rotate-12 place-items-center rounded-full bg-island-band text-u-30 font-max leading-none text-white [box-shadow:0_calc(4*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:-top-[12px] max-poster:-right-[22px] max-poster:size-[44px] max-poster:text-[26px] max-phone:size-[34px] max-phone:text-[20px]">
                  ?
                </span>
              </div>

              <span
                data-not-found-digit
                aria-hidden="true"
                className="relative z-1 text-u-210 font-max leading-[0.78] tracking-[-0.08em] text-white [text-shadow:0_calc(7*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:text-[clamp(130px,28vw,225px)] max-phone:text-[110px]"
              >
                4
              </span>
            </div>

            <h1
              data-testid="not-found-title"
              className="mt-22 max-w-850 text-u-44 font-max leading-[0.96] tracking-[-0.02em] text-white [text-shadow:0_calc(3*var(--spacing))_0_var(--color-hero-title-shadow)] max-poster:mt-[28px] max-poster:flex max-poster:min-h-[1.92em] max-poster:max-w-[820px] max-poster:items-center max-poster:justify-center max-poster:text-[clamp(34px,6vw,54px)] max-phone:mt-[24px] max-phone:text-[34px]"
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
                className="h-42 px-26 text-u-15 font-ultra text-ink-navy focus-visible:ring-white focus-visible:ring-offset-hero-band max-poster:h-[48px] max-poster:px-[24px] max-poster:text-[16px] max-phone:w-[min(100%,260px)]"
              >
                <Link data-testid="not-found-home" href={homeHref}>{t("home")}</Link>
              </Button>
              <AppStoreBadge className="h-42 gap-6 ps-18 pe-22 [&_svg]:h-26 [&_svg]:w-22 [&_small]:text-u-9.5 [&_strong]:text-u-18 max-poster:h-[48px] max-phone:w-[min(100%,260px)] max-phone:[&_strong]:text-[17px]" />
            </div>

            <ul className="mt-22 flex flex-wrap items-center justify-center gap-8 max-poster:mt-[26px] max-poster:gap-[8px]">
              <li className="text-u-12 font-black uppercase tracking-[0.08em] text-white/80 max-poster:w-full max-poster:text-[12px]">{t("suggestions")}</li>
              {shortcuts.map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="inline-flex h-32 items-center rounded-full border-2 border-white/60 px-14 text-u-12.5 font-ultra text-white transition-colors hover:bg-white hover:text-hero-band focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white max-poster:h-[36px] max-poster:px-[16px] max-poster:text-[14px]">
                    {navigation(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </PosterStage>
      </section>
    </main>
  );
}
