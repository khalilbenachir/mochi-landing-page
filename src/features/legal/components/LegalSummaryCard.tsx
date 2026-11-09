import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const card = cva(
  "flex flex-col items-center rounded-u-26 bg-white px-18 pt-12 pb-15 text-center focus-visible:outline-3 focus-visible:outline-offset-4 max-nav:px-[12px] max-nav:py-[18px]",
  {
    variants: {
      prominence: {
        compact:
          "min-h-180 [box-shadow:0_5px_10px_var(--color-policy-shadow)] focus-visible:outline-policy-purple max-nav:min-h-[184px]",
        featured:
          "min-h-191 [box-shadow:0_5px_10px_var(--color-flavors-card-shadow)] focus-visible:outline-ink-navy max-nav:min-h-[202px]",
      },
    },
    defaultVariants: { prominence: "compact" },
  },
);

const iconFrame = cva("relative mb-6 flex items-center justify-center max-nav:mb-[10px]", {
  variants: {
    prominence: {
      compact: "h-48 max-nav:h-[40px]",
      featured: "h-64 max-nav:h-[54px]",
    },
  },
  defaultVariants: { prominence: "compact" },
});

const title = cva("w-full max-w-190 whitespace-pre-line wrap-anywhere font-max tracking-[-0.01em]", {
  variants: {
    prominence: {
      compact: "text-u-18 leading-[1.12] max-poster:text-[18px]",
      featured: "text-u-20 leading-[1.06] max-poster:text-[21px] max-phone:text-[18px]",
    },
  },
  defaultVariants: { prominence: "compact" },
});

const description = cva("w-full max-w-200 wrap-anywhere font-demibold max-nav:mt-[10px] max-phone:text-[14px]", {
  variants: {
    prominence: {
      compact: "mt-7 text-u-12 leading-[1.27] max-poster:text-[15px]",
      featured: "mt-8 text-u-[13.6] leading-[1.22] max-poster:text-[17px]",
    },
  },
  defaultVariants: { prominence: "compact" },
});

type LegalSummaryCardProps = VariantProps<typeof card> & {
  href: string;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
};

/** Shared legal summary link; prominence preserves each page's established visual hierarchy. */
export function LegalSummaryCard({ href, icon, title: titleContent, description: descriptionContent, prominence }: LegalSummaryCardProps) {
  return (
    <a href={href} className={card({ prominence })}>
      <span className={iconFrame({ prominence })}>{icon}</span>
      <h3 className={title({ prominence })}>{titleContent}</h3>
      <p className={description({ prominence })}>{descriptionContent}</p>
    </a>
  );
}
