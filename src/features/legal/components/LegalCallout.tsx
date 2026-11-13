import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const callout = cva(
  "relative mt-24 flex items-center gap-18 rounded-u-26 border-2 py-14 pr-32 pl-16 text-u-[14.6] font-heavy leading-[1.3] tracking-[-0.01em] max-poster:text-[17px] max-nav:gap-[14px] max-nav:py-[16px] max-nav:pr-[18px] max-nav:pl-[12px] max-phone:text-[15px]",
  {
    variants: {
      tone: {
        pink: "border-mochi-pink-ink/15 bg-policy-pink",
        cream: "border-ink-navy/10 bg-terms-callout",
      },
    },
    defaultVariants: { tone: "pink" },
  },
);

type LegalCalloutProps = VariantProps<typeof callout> & { icon: ReactNode; children: ReactNode };

/** Highlighted note inside a legal section: a Mochi icon popping out of the left edge, then the message. */
export function LegalCallout({ tone, icon, children }: LegalCalloutProps) {
  return (
    <div className={callout({ tone })}>
      <span className="-my-10 flex-none -rotate-6 max-nav:-my-[6px]">{icon}</span>
      <p className="min-w-0">{children}</p>
    </div>
  );
}

/** Icon size shared by every legal callout. */
export const LEGAL_CALLOUT_ICON = "size-86 max-nav:size-[64px]";
