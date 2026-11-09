import { cva } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { APP_STORE_URL } from "@/features/landing/content/landing";
import { cn } from "@/lib/utils";

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/** Compact and dark badges use the `flat` button (no drop shadow, presses by scaling). */
const appStoreBadge = cva("gap-8 h-49 ps-22 pe-26", {
  variants: {
    compact: {
      true: "gap-5 h-29 ps-14 pe-16 text-u-10.5 font-black max-poster:h-[34px] max-poster:text-[12px]",
      false: "",
    },
    dark: {
      true: "bg-ink-black text-white active:scale-98",
      false: "",
    },
  },
  defaultVariants: { compact: false, dark: false },
});

const appleLogo = cva("flex-none", {
  variants: {
    compact: {
      true: "w-15 h-17",
      false: "w-26 h-30",
    },
  },
});

export function AppStoreBadge({ compact = false, dark = false, className }: { compact?: boolean; dark?: boolean; className?: string }) {
  const t = useTranslations("Common");

  return (
    <Button asChild variant={compact || dark ? "flat" : "pill"} className={cn(appStoreBadge({ compact, dark }), className)}>
      <a href={APP_STORE_URL} aria-label={t("appStoreAria")}>
        <AppleLogo className={appleLogo({ compact })} />
        {compact ? (
          <span>{t("download")}</span>
        ) : (
          <span className="grid text-left leading-none">
            <small className="text-u-11 font-extrabold">{t("downloadOn")}</small>
            <strong className="mt-1 text-u-21 font-ultra tracking-[-0.02em] max-phone:text-[19px]">{t("appStore")}</strong>
          </span>
        )}
      </a>
    </Button>
  );
}

/** The dark App Store tile in two placements: the closing band and the footer. */
const STORE_BADGE = {
  root: cva("gap-8 max-poster:gap-[10px] max-poster:pl-[16px] max-poster:pr-[18px]", {
    variants: {
      placement: {
        band: "h-45 pl-15 pr-18 max-poster:h-[56px]",
        footer: "h-51 pl-17 pr-22 max-poster:h-[50px] max-phone:hidden",
      },
    },
  }),
  apple: cva("h-28 w-24 flex-none", {
    variants: { placement: { band: "max-poster:h-[30px] max-poster:w-[26px]", footer: "" } },
  }),
  small: cva("font-bold max-poster:text-[11px]", {
    variants: { placement: { band: "text-u-[10.4]", footer: "text-u-11.5" } },
  }),
  strong: cva("mt-1 font-black tracking-[-0.01em] max-poster:text-[22px]", {
    variants: { placement: { band: "text-u-21", footer: "text-u-23" } },
  }),
};

export function StoreBadge({ placement }: { placement: "band" | "footer" }) {
  const t = useTranslations("Common");

  return (
    <Button asChild variant="store" className={STORE_BADGE.root({ placement })}>
      <a href={APP_STORE_URL} aria-label={t("appStoreAria")}>
        <AppleLogo className={STORE_BADGE.apple({ placement })} />
        <span className="grid text-left leading-none">
          <small className={STORE_BADGE.small({ placement })}>{t("downloadOn")}</small>
          <strong className={STORE_BADGE.strong({ placement })}>{t("appStore")}</strong>
        </span>
      </a>
    </Button>
  );
}
