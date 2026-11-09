import { cva } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { APP_STORE_URL } from "@/features/landing/content/landing";
import { cn } from "@/lib/utils";

export function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

const appStoreBadge = cva(
  "inline-flex items-center gap-[calc(8*var(--u))] h-[calc(49*var(--u))] [padding-inline:calc(22*var(--u))_calc(26*var(--u))] rounded-full bg-white text-ink-black no-underline [box-shadow:0_calc(3*var(--u))_0_var(--color-hero-badge-shadow)] transition-[transform,box-shadow] duration-250 ease-smooth hover:text-ink-black hover:[transform:translateY(-2px)] hover:[box-shadow:0_calc(3*var(--u)+2px)_0_var(--color-hero-badge-shadow)] active:duration-100 active:[transform:translateY(1px)] active:[box-shadow:0_calc(3*var(--u)-1px)_0_var(--color-hero-badge-shadow)] motion-reduce:hover:[transform:none] motion-reduce:active:[transform:none]",
  {
    variants: {
      compact: {
        true: "gap-[calc(5*var(--u))] h-[calc(29*var(--u))] [padding-inline:calc(14*var(--u))_calc(16*var(--u))] [box-shadow:none] hover:[box-shadow:none] active:[box-shadow:none] active:[transform:translateY(0)_scale(0.96)] text-[calc(10.5*var(--u))] font-black max-poster:h-[34px] max-poster:text-[12px]",
        false: "",
      },
      dark: {
        true: "bg-ink-black text-white [box-shadow:none] hover:text-white hover:[box-shadow:none] active:[box-shadow:none] active:[transform:translateY(0)_scale(0.98)]",
        false: "",
      },
    },
    defaultVariants: { compact: false, dark: false },
  },
);

const appleLogo = cva("flex-none", {
  variants: {
    compact: {
      true: "w-[calc(15*var(--u))] h-[calc(17*var(--u))]",
      false: "w-[calc(26*var(--u))] h-[calc(30*var(--u))]",
    },
  },
});

export function AppStoreBadge({ compact = false, dark = false, className }: { compact?: boolean; dark?: boolean; className?: string }) {
  const t = useTranslations("Common");

  return (
    <Button asChild variant="unstyled" size="unstyled" className={cn(appStoreBadge({ compact, dark }), className)}>
      <a href={APP_STORE_URL} aria-label={t("appStoreAria")}>
        <AppleLogo className={appleLogo({ compact })} />
        {compact ? (
          <span>{t("download")}</span>
        ) : (
          <span className="grid text-left leading-none">
            <small className="text-[calc(11*var(--u))] font-[800]">{t("downloadOn")}</small>
            <strong className="mt-[calc(1*var(--u))] text-[calc(21*var(--u))] font-[950] tracking-[-0.02em] max-phone:text-[19px]">{t("appStore")}</strong>
          </span>
        )}
      </a>
    </Button>
  );
}

const STORE_BADGE = {
  band: {
    root: "[--u:inherit] gap-[calc(8*var(--u))] h-[calc(45*var(--u))] pl-[calc(15*var(--u))] pr-[calc(18*var(--u))] rounded-[calc(12*var(--u))] bg-closing-store-bg text-white no-underline transition-transform duration-250 ease-smooth hover:text-white hover:[transform:translateY(-2px)] active:duration-100 active:[transform:translateY(0)_scale(0.97)] focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-white focus-visible:outline-offset-3 motion-reduce:hover:[transform:none] motion-reduce:active:[transform:none] max-poster:h-[56px] max-poster:gap-[10px] max-poster:pl-[16px] max-poster:pr-[18px] max-poster:rounded-[14px]",
    apple: "h-[calc(28*var(--u))] w-[calc(24*var(--u))] flex-none max-poster:h-[30px] max-poster:w-[26px]",
    small: "text-[calc(10.4*var(--u))] font-[700] max-poster:text-[11px]",
    strong: "mt-[calc(1*var(--u))] text-[calc(21*var(--u))] font-[900] tracking-[-0.01em] max-poster:text-[22px]",
  },
  footer: {
    root: "[--u:inherit] gap-[calc(8*var(--u))] h-[calc(51*var(--u))] pl-[calc(17*var(--u))] pr-[calc(22*var(--u))] rounded-[calc(12*var(--u))] bg-closing-store-bg text-white no-underline transition-transform duration-250 ease-smooth hover:text-white hover:[transform:translateY(-2px)] active:duration-100 active:[transform:translateY(0)_scale(0.97)] focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-white focus-visible:outline-offset-3 motion-reduce:hover:[transform:none] motion-reduce:active:[transform:none] max-poster:h-[50px] max-poster:gap-[10px] max-poster:pl-[16px] max-poster:pr-[18px] max-poster:rounded-[14px] max-phone:hidden",
    apple: "h-[calc(28*var(--u))] w-[calc(24*var(--u))] flex-none",
    small: "text-[calc(11.5*var(--u))] font-[700] max-poster:text-[11px]",
    strong: "mt-[calc(1*var(--u))] text-[calc(23*var(--u))] font-[900] tracking-[-0.01em] max-poster:text-[22px]",
  },
} as const;

export function ClosingStoreBadge({ variant }: { variant: keyof typeof STORE_BADGE }) {
  const t = useTranslations("Common");
  const badge = STORE_BADGE[variant];

  return (
    <Button asChild variant="unstyled" size="unstyled" className={badge.root}>
      <a href={APP_STORE_URL} aria-label={t("appStoreAria")}>
        <AppleLogo className={badge.apple} />
        <span className="grid text-left leading-none"><small className={badge.small}>{t("downloadOn")}</small><strong className={badge.strong}>{t("appStore")}</strong></span>
      </a>
    </Button>
  );
}
