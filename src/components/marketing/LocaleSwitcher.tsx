import { useLocale, useTranslations } from "next-intl";
import { localeSwitchPath, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-full border border-white/35 bg-black/10 p-1 text-xs font-black backdrop-blur-sm",
        className,
      )}
    >
      {routing.locales.map((candidate) => (
        <a
          key={candidate}
          href={localeSwitchPath(candidate)}
          aria-current={locale === candidate ? "page" : undefined}
          aria-label={t(candidate)}
          className={cn(
            "rounded-full px-2 py-1 text-white no-underline transition-colors hover:bg-white/15 hover:text-white",
            locale === candidate && "bg-white text-mochi-pink-ink hover:bg-white hover:text-mochi-pink-ink",
          )}
        >
          {candidate.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
