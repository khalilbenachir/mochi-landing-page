import Image from "next/image";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { MobileMenu } from "@/features/landing/components/sections/MobileMenu";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "./AppStoreBadges";

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
    <header className="relative z-10 ml-[calc(55*var(--u))] mr-[calc(49*var(--u))] flex h-[calc(36*var(--u))] items-center max-poster:mx-0 max-poster:h-[72px] max-nav:h-[68px]">
      <a
        href={homeHref}
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
            href={`${sectionBase}${item.href}`}
            className="text-white text-[calc(14.5*var(--u))] font-[850] no-underline hover:text-white hover:underline hover:underline-offset-4 max-poster:text-[15px]"
          >
            {navigation(item.key)}
          </a>
        ))}
      </nav>
      <LocaleSwitcher variant="dropdown" className="ml-auto max-nav:hidden" />
      <div className="ml-[calc(10*var(--u))] max-poster:ml-[12px] max-nav:hidden"><AppStoreBadge compact /></div>
      <MobileMenu label={navigation("openMenu")} navLabel={navigation("mobileLabel")}>
        {MOBILE_NAV.map((item) => (
          <a
            key={item.href}
            href={`${sectionBase}${item.href}`}
            className="px-[14px] py-3 border-b border-hero-menu-link-border text-hero-menu-link-text font-[900] no-underline"
          >
            {navigation(item.key)}
          </a>
        ))}
        <LocaleSwitcher variant="list" className="mt-2 mb-[2px]" />
        <AppStoreBadge dark className="mt-2 justify-center" />
      </MobileMenu>
    </header>
  );
}
