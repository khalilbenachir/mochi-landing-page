import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { blogPath } from "@/features/blog/locales";
import { localeRoutePath } from "@/i18n/routing";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "./AppStoreBadges";
import { MobileMenu } from "./MobileMenu";

type NavKey = "features" | "flavors" | "privacy" | "blog" | "plus" | "faq";

/**
 * One navigation for every language: only labels (the shared `Navigation` namespace) and
 * targets are localized. Section links point at the locale's home page; Privacy and Blog are
 * pages. Blog resolves to the locale's own blog once published, otherwise to the fallback blog.
 * Desktop keeps four links so the bar fits in every language; the mobile menu lists everything.
 */
const DESKTOP_NAV = ["features", "privacy", "blog", "faq"] as const satisfies readonly NavKey[];
const MOBILE_NAV = ["features", "flavors", "privacy", "blog", "plus", "faq"] as const satisfies readonly NavKey[];

type SiteHeaderProps = {
  /** Brand link target; `#top` on the home page. */
  homeHref?: string;
  /** Prefix for section anchors; empty on the home page, the locale home elsewhere. */
  sectionBase?: string;
  /** Current page under the locale, kept when switching language (e.g. `/privacy`). */
  localeRoute?: string;
  activePage?: "blog";
};

export function SiteHeader({ homeHref = "#top", sectionBase = "", localeRoute = "", activePage }: SiteHeaderProps) {
  const navigation = useTranslations("Navigation");
  const common = useTranslations("Common");
  const locale = useLocale();
  const href = (key: NavKey) =>
    key === "blog" ? blogPath(locale) : key === "privacy" ? localeRoutePath(locale, "privacy") : `${sectionBase}#${key}`;
  const link = (key: NavKey) => ({ key, href: href(key), label: navigation(key), current: activePage === key ? ("page" as const) : undefined });

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
        {DESKTOP_NAV.map(link).map((item) => (
          <a
            key={item.key}
            href={item.href}
            aria-current={item.current}
            className="text-white text-u-14.5 font-heavy underline-offset-4 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2 max-poster:text-[15px]"
          >
            {item.label}
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
        {MOBILE_NAV.map(link).map((item) => (
          <a
            key={item.key}
            href={item.href}
            aria-current={item.current}
            className="px-[14px] py-[12px] border-b border-hero-menu-link-border text-hero-menu-link-text font-black"
          >
            {item.label}
          </a>
        ))}
        <LocaleSwitcher variant="list" route={localeRoute} className="mt-[8px] mb-[2px]" />
        <AppStoreBadge dark className="mt-[8px] justify-center" />
      </MobileMenu>
    </header>
  );
}
