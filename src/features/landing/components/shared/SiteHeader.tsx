import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { blogPath } from "@/features/blog/locales";
import { CALCULATOR_SLUG, OVULATION_CALCULATOR_SLUG } from "@/features/calculator/content/calculate";
import { localeRoutePath, type AppLocale } from "@/i18n/routing";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { AppStoreBadge } from "./AppStoreBadges";
import { MobileMenu } from "./MobileMenu";
import { PosterStage } from "./PosterStage";

type NavKey = "blog" | "calculator" | "features" | "faq";
type MenuLink = { key: string; href: string; label: string; current?: "page" };

/**
 * One navigation for every language: only labels (the shared `Navigation` namespace) and
 * targets are localized. Section links point at the locale's home page. Blog resolves to the
 * locale's own blog once published, otherwise to the fallback blog.
 * Desktop and mobile share the same links and order.
 */
const NAV = ["blog", "calculator", "features", "faq"] as const satisfies readonly NavKey[];

type SiteHeaderProps = {
  /** Brand link target; `#top` on the home page. */
  homeHref?: string;
  /** Prefix for section anchors; empty on the home page, the locale home elsewhere. */
  sectionBase?: string;
  /** Current page under the locale, kept when switching language (e.g. `/privacy`). */
  localeRoute?: string;
  activePage?: "blog" | "calculator" | "ovulation";
};

/** The calculators listed under "Calculators": a dropdown on desktop, plain rows in the mobile menu. */
const CALCULATOR_LINKS = [
  { key: "periodCalculator", slug: CALCULATOR_SLUG, page: "calculator" },
  { key: "ovulationCalculator", slug: OVULATION_CALCULATOR_SLUG, page: "ovulation" },
] as const;

export function SiteHeader({ homeHref = "#top", sectionBase = "", localeRoute = "", activePage }: SiteHeaderProps) {
  const navigation = useTranslations("Navigation");
  const common = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  const href = (key: NavKey) =>
    key === "blog" ? blogPath(locale) : key === "calculator" ? localeRoutePath(locale, CALCULATOR_SLUG) : `${sectionBase}#${key}`;
  const link = (key: NavKey) => ({ key, href: href(key), label: navigation(key), current: activePage === key ? ("page" as const) : undefined });
  const calculators = CALCULATOR_LINKS.map((item) => ({
    ...item,
    href: localeRoutePath(locale, item.slug),
    label: navigation(item.key),
    current: activePage === item.page ? ("page" as const) : undefined,
  }));
  const onCalculator = calculators.some((item) => item.current);
  const menuLinkClass =
    "group/link rounded-[12px] border-b border-hero-menu-link-border px-[14px] py-[12px] font-black text-hero-menu-link-text [transition:background-color_0.2s_ease,color_0.2s_ease,border-color_0.2s_ease] hover:border-transparent hover:bg-hero-menu-link-hover-bg hover:text-hero-menu-icon has-[+a:hover]:border-transparent focus-visible:bg-hero-menu-link-hover-bg";

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-hero-band text-white">
      <PosterStage spacing="none" className="max-poster:px-[clamp(20px,4vw,40px)]">
        <div className="relative ml-55 mr-49 flex shrink-0 items-center py-6 max-poster:mx-0 max-poster:py-[12px] max-nav:py-[10px]">
        <a
          href={homeHref}
          className="flex shrink-0 items-center gap-6 text-white text-u-25 font-ultra leading-none tracking-[-0.02em] max-poster:gap-[8px] max-poster:text-[26px] max-nav:text-[24px]"
          aria-label={common("brandHome")}
        >
          <Image className="w-35 h-auto max-poster:w-[37px] max-nav:w-[34px]" src={LANDING_ASSETS.faces.headerHappy} alt="" width={256} height={238} priority />
          <span>{common("brand")}</span>
        </a>
        <nav className="absolute left-225 flex gap-45 max-poster:static max-poster:ml-auto max-poster:mr-[28px] max-poster:gap-[28px] max-nav:hidden" aria-label={navigation("mainLabel")}>
          {NAV.map(link).map((item) =>
            item.key === "calculator" ? (
              // Hover or keyboard focus opens the list; the top link still reaches the period calculator without it.
              <div key={item.key} className="group/calc relative">
                <a
                  href={item.href}
                  aria-current={onCalculator ? "page" : undefined}
                  className="text-white text-u-14.5 font-heavy underline-offset-4 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2 max-poster:text-[15px]"
                >
                  {navigation("calculators")}
                </a>
                <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-[14px] opacity-0 transition-[opacity,translate] duration-200 group-hover/calc:visible group-hover/calc:opacity-100 group-focus-within/calc:visible group-focus-within/calc:opacity-100">
                  <ul className="grid w-[240px] gap-[2px] rounded-[20px] bg-white p-[8px] text-ink-navy [box-shadow:0_18px_40px_-12px_var(--color-hero-menu-button-shadow)]">
                    {calculators.map((calculator) => (
                      <li key={calculator.key}>
                        <a
                          href={calculator.href}
                          aria-current={calculator.current}
                          className="block rounded-[14px] px-[14px] py-[11px] text-[15px] font-heavy leading-[1.2] hover:bg-hero-menu-link-hover-bg focus-visible:bg-hero-menu-link-hover-bg aria-[current=page]:bg-hero-menu-link-hover-bg"
                        >
                          {calculator.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <a
                key={item.key}
                href={item.href}
                aria-current={item.current}
                className="text-white text-u-14.5 font-heavy underline-offset-4 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2 max-poster:text-[15px]"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <LocaleSwitcher variant="dropdown" route={localeRoute} className="ml-auto max-nav:hidden" />
        {/*
          Between the nav and poster breakpoints the links, locale menu and this badge don't
          fit in every locale (French needs ~120px more at 761px). The hero's full App Store badge
          sits just below, so the header drops its copy there; the mobile menu carries its own.
        */}
        <div className="ml-10 max-poster:hidden"><AppStoreBadge compact /></div>
        <MobileMenu label={navigation("openMenu")} navLabel={navigation("mobileLabel")}>
          {/* The hovered row turns into a pill: its own divider and the one above it hide. */}
          {NAV.flatMap((key): MenuLink[] => (key === "calculator" ? calculators : [link(key)])).map((item) => (
            <a key={item.key} href={item.href} aria-current={item.current} className={menuLinkClass}>
              <span className="inline-block [transition:translate_0.25s_var(--ease-smooth)] group-hover/link:translate-x-[6px] motion-reduce:group-hover/link:translate-none">
                {item.label}
              </span>
            </a>
          ))}
          <LocaleSwitcher variant="list" route={localeRoute} className="mt-[8px] mb-[2px]" />
          <AppStoreBadge dark className="mt-[8px] justify-center" />
        </MobileMenu>
        </div>
      </PosterStage>
    </header>
  );
}
