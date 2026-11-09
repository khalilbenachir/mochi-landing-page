import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { localeRoutePath, type AppLocale } from "@/i18n/routing";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "./AppStoreBadges";
import { FitHeader } from "./FitHeader";
import { MobileMenu } from "./MobileMenu";

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

export function SiteHeader({ homeHref = "#top", sectionBase = "", localeRoute = "" }: { homeHref?: string; sectionBase?: string; localeRoute?: string }) {
  const navigation = useTranslations("Navigation");
  const common = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  // Privacy opens the full privacy page on every route; the other links target home sections.
  const href = (item: (typeof NAV)[number] | (typeof MOBILE_NAV)[number]) =>
    item.key === "privacy" ? localeRoutePath(locale, "privacy") : `${sectionBase}${item.href}`;

  return (
    // A grid, not absolute positioning: the nav gets its own column from the poster's x=225 and can
    // never slide under the language menu. If its links still don't fit (long locale, translated
    // page), FitHeader collapses the bar to the burger menu.
    <FitHeader className="relative z-10 ml-55 mr-49 grid shrink-0 grid-cols-[calc(225*var(--spacing))_minmax(0,1fr)_auto_auto] items-center py-6 max-poster:mx-0 max-poster:grid-cols-[auto_minmax(0,1fr)_auto] max-poster:py-[12px] max-nav:flex max-nav:py-[10px]">
      <a
        href={homeHref}
        className="flex shrink-0 items-center gap-6 text-white text-u-25 font-ultra leading-none tracking-[-0.02em] max-poster:gap-[8px] max-poster:text-[26px] max-nav:text-[24px]"
        aria-label={common("brandHome")}
      >
        <Image className="w-42 h-auto max-poster:w-[44px] max-nav:w-[40px]" src={LANDING_ASSETS.faces.headerHappy} alt="" width={256} height={207} priority />
        <span>{common("brand")}</span>
      </a>
      <nav data-fit-nav className="flex min-w-0 overflow-hidden max-poster:mx-[28px] max-poster:justify-end-safe max-nav:hidden group-data-collapsed/header:invisible" aria-label={navigation("mainLabel")}>
        {NAV.map((item, index) => [
          // Spacers instead of `gap`: they shrink from the maquette's 45 units down to 18 before
          // the links stop fitting and the header falls back to the burger.
          index > 0 && <span key={`${item.href}-gap`} aria-hidden="true" className="min-w-18 flex-[0_1_calc(45*var(--spacing))] max-poster:min-w-[16px] max-poster:basis-[28px]" />,
          <a
            key={item.href}
            href={href(item)}
            className="shrink-0 whitespace-nowrap text-white text-u-14.5 font-heavy hover:underline hover:underline-offset-4 max-poster:text-[15px]"
          >
            {navigation(item.key)}
          </a>,
        ])}
      </nav>
      <LocaleSwitcher variant="dropdown" route={localeRoute} className="ml-16 max-poster:ml-0 max-nav:hidden group-data-collapsed/header:invisible" />
      {/*
        Between the nav and poster breakpoints the four links, locale menu and this badge don't
        fit in every locale (French needs ~120px more at 761px). The hero's full App Store badge
        sits just below, so the header drops its copy there; the mobile menu carries its own.
      */}
      <div className="ml-10 max-poster:hidden group-data-collapsed/header:invisible"><AppStoreBadge compact /></div>
      <MobileMenu
        label={navigation("openMenu")}
        navLabel={navigation("mobileLabel")}
        className="group-data-collapsed/header:absolute group-data-collapsed/header:top-1/2 group-data-collapsed/header:right-0 group-data-collapsed/header:z-30 group-data-collapsed/header:block group-data-collapsed/header:-translate-y-1/2"
      >
        {MOBILE_NAV.map((item) => (
          <a
            key={item.href}
            href={href(item)}
            // The hovered row turns into a pill: its own divider and the one above it hide.
            className="group/link rounded-[12px] border-b border-hero-menu-link-border px-[14px] py-[12px] font-black text-hero-menu-link-text [transition:background-color_0.2s_ease,color_0.2s_ease,border-color_0.2s_ease] hover:border-transparent hover:bg-hero-menu-link-hover-bg hover:text-hero-menu-icon has-[+a:hover]:border-transparent focus-visible:bg-hero-menu-link-hover-bg"
          >
            <span className="inline-block [transition:translate_0.25s_var(--ease-smooth)] group-hover/link:translate-x-[6px] motion-reduce:group-hover/link:translate-none">
              {navigation(item.key)}
            </span>
          </a>
        ))}
        <LocaleSwitcher variant="list" route={localeRoute} className="mt-[8px] mb-[2px]" />
        <AppStoreBadge dark className="mt-[8px] justify-center" />
      </MobileMenu>
    </FitHeader>
  );
}
