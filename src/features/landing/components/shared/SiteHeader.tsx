import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
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

export function SiteHeader({ homeHref = "#top", sectionBase = "" }: { homeHref?: string; sectionBase?: string }) {
  const navigation = useTranslations("Navigation");
  const common = useTranslations("Common");

  return (
    <header className="relative z-10 ml-55 mr-49 flex h-36 items-center max-poster:mx-0 max-poster:h-[72px] max-nav:h-[68px]">
      <a
        href={homeHref}
        className="flex shrink-0 items-center gap-6 text-white text-u-25 font-ultra tracking-[-0.02em] max-poster:gap-[8px] max-poster:text-[26px] max-nav:text-[24px]"
        aria-label={common("brandHome")}
      >
        <Image className="w-42 h-auto max-poster:w-[44px] max-nav:w-[40px]" src={LANDING_ASSETS.faces.happy} alt="" width={58} height={46} priority />
        <span>{common("brand")}</span>
      </a>
      <nav className="absolute left-225 flex gap-45 max-poster:static max-poster:ml-auto max-poster:mr-[28px] max-poster:gap-[28px] max-nav:hidden" aria-label={navigation("mainLabel")}>
        {NAV.map((item) => (
          <a
            key={item.href}
            href={`${sectionBase}${item.href}`}
            className="text-white text-u-14.5 font-heavy hover:underline hover:underline-offset-4 max-poster:text-[15px]"
          >
            {navigation(item.key)}
          </a>
        ))}
      </nav>
      <LocaleSwitcher variant="dropdown" className="ml-auto max-nav:hidden" />
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
            href={`${sectionBase}${item.href}`}
            className="px-[14px] py-[12px] border-b border-hero-menu-link-border text-hero-menu-link-text font-black"
          >
            {navigation(item.key)}
          </a>
        ))}
        <LocaleSwitcher variant="list" className="mt-[8px] mb-[2px]" />
        <AppStoreBadge dark className="mt-[8px] justify-center" />
      </MobileMenu>
    </header>
  );
}
