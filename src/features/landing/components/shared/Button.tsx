import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** White pill that lifts on hover; `pill` and `flat` differ only in how they press. */
const PILL = "rounded-full bg-white text-ink-black transition-[translate,scale,box-shadow] hover:-translate-y-[2px] active:duration-100";

/** The landing's call-to-action looks. Size and type come from the caller's `className`. */
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-extrabold duration-250 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-none motion-reduce:active:translate-none motion-reduce:active:scale-none",
  {
    variants: {
      variant: {
        /** Presses down into its drop shadow (hero, 404). */
        pill: cn(PILL, "[box-shadow:0_calc(3*var(--spacing))_0_var(--color-hero-badge-shadow)] hover:[box-shadow:0_calc(3*var(--spacing)+2px)_0_var(--color-hero-badge-shadow)] active:translate-y-[1px] active:[box-shadow:0_calc(3*var(--spacing)-1px)_0_var(--color-hero-badge-shadow)]"),
        /** No shadow; presses in by scaling (header badge, mobile menu). */
        flat: cn(PILL, "active:translate-y-0 active:scale-96"),
        /** Dark App Store tile (closing band, footer). */
        store: "rounded-u-12 bg-closing-store-bg text-white transition-transform hover:-translate-y-[2px] active:translate-y-0 active:scale-97 active:duration-100 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-white focus-visible:outline-offset-3 max-poster:rounded-[14px]",
      },
    },
    defaultVariants: { variant: "pill" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return <Component className={cn(buttonVariants({ variant }), className)} {...props} />;
}
