import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { localeRoutePath, type AppLocale } from "@/i18n/routing";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "./AppStoreBadges";
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
    <header className="relative z-10 ml-55 mr-49 flex shrink-0 items-center py-6 max-poster:mx-0 max-poster:py-[12px] max-nav:py-[10px]">
      <a
        href={homeHref}
        className="flex shrink-0 items-center gap-6 text-white text-u-25 font-ultra leading-none tracking-[-0.02em] max-poster:gap-[8px] max-poster:text-[26px] max-nav:text-[24px]"
        aria-label={common("brandHome")}
      >
        <Image className="w-42 h-auto max-poster:w-[44px] max-nav:w-[40px]" src={LANDING_ASSETS.faces.headerHappy} alt="" width={256} height={207} priority />
        <span>{common("brand")}</span>
      </a>
      <nav className="absolute left-225 flex gap-45 max-poster:static max-poster:ml-auto max-poster:mr-[28px] max-poster:gap-[28px] max-nav:hidden" aria-label={navigation("mainLabel")}>
        {NAV.map((item) => (
          <a
            key={item.href}
            href={href(item)}
            className="text-white text-u-14.5 font-heavy hover:underline hover:underline-offset-4 max-poster:text-[15px]"
          >
            {navigation(item.key)}
          </a>
        ))}
      </nav>
      <LocaleSwitcher variant="dropdown" route={localeRoute} className="ml-auto max-nav:hidden" />
      {/*
        Between the nav and poster breakpoints the four links, locale menu and this badge don't
        fit in every locale (French needs ~120px more at 761px). The hero's full App Store badge
        sits just below, so the header drops its copy there; the mobile menu carries its own.
      */}
      <div className="ml-10 max-poster:hidden"><AppStoreBadge compact /></div>
      <MobileMenu label={navigation("openMenu")} navLabel={navigation("mobileLabel")}>
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
    </header>
  );
}
