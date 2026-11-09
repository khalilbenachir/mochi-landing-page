import { useLocale, useTranslations } from "next-intl";
import { LOCALE_META, localeSwitchPath, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LocaleMenu, type LocaleOption } from "./LocaleMenu";

type LocaleSwitcherProps = {
  /** `dropdown` for the header; `list` for inline use inside another menu (no nested popover). */
  variant?: "dropdown" | "list";
  className?: string;
};

const OPTIONS: readonly LocaleOption[] = routing.locales.map((locale) => ({
  locale,
  name: LOCALE_META[locale].name,
  short: LOCALE_META[locale].short,
  href: localeSwitchPath(locale),
}));

export function LocaleSwitcher({ variant = "dropdown", className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const current = OPTIONS.find((option) => option.locale === locale) ?? OPTIONS[0]!;

  if (variant === "dropdown") {
    return (
      <LocaleMenu
        current={current}
        options={OPTIONS}
        label={t("label")}
        triggerLabel={t("change", { language: current.name })}
        className={className}
      />
    );
  }

  return (
    <nav aria-label={t("label")} className={cn("grid gap-[6px]", className)}>
      <p className="px-[6px] text-[12px] font-black uppercase tracking-[0.06em] text-ink-navy/60" aria-hidden="true">
        {t("label")}
      </p>
      <ul className="grid grid-cols-2 gap-[6px]">
        {OPTIONS.map((option) => {
          const active = option.locale === current.locale;
          return (
            <li key={option.locale} className="grid">
              <a
                href={option.href}
                hrefLang={option.locale}
                lang={option.locale}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "grid min-h-[40px] place-items-center rounded-[12px] px-[8px] py-[6px] text-center text-[13px] font-heavy leading-[1.15] text-ink-navy bg-hero-locale-mobile-bg",
                  active && "bg-brand-coral text-white",
                )}
              >
                {option.name}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
