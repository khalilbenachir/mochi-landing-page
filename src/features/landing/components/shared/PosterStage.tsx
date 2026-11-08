import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The maquette's poster coordinate system. The outer frame is the size container; on wide
 * screens `--u` is 1/grid of its width, so every `calc(N*var(--u))` coordinate scales as one
 * poster. Below the poster breakpoint `--u` is 1px. Sections lay their content out in normal
 * flow on the inner stage (`className` lands there), so a band is as tall as its content plus
 * the shared section spacing; nothing sets a fixed band height.
 */
const posterFrame = cva("relative mx-auto @container max-poster:@container-normal", {
  variants: {
    grid: {
      "1024": "w-[min(100%,1440px)]",
      "800": "w-[min(100%,1200px)]",
    },
  },
  defaultVariants: { grid: "1024" },
});

const posterStage = cva("relative max-poster:[--u:1px]", {
  variants: {
    grid: {
      "1024": "[--u:calc(100cqw/1024)] [--section-space:calc(28*var(--u))]",
      "800": "[--u:calc(100cqw/800)] [--section-space:calc(26*var(--u))]",
    },
    /** `section` pads the band top and bottom; `none` leaves it flush (the footer). */
    spacing: {
      section:
        "pt-[var(--section-space)] pb-[var(--section-space)] max-poster:[--section-space:56px] max-phone:[--section-space:44px]",
      none: "",
    },
    /**
     * `bottom`: below the poster breakpoint the stacked art sits on the band's bottom edge, so
     * the bottom padding goes. On the poster, edge art pulls itself down instead with
     * `-mb-[calc(var(--section-space)+N*var(--u))]`, keeping the text column's padding.
     */
    bleed: {
      bottom: "max-poster:pb-0",
      none: "",
    },
  },
  defaultVariants: { grid: "1024", spacing: "section", bleed: "none" },
});

export function PosterStage({
  grid,
  spacing,
  bleed,
  className,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof posterStage>) {
  return (
    <div className={posterFrame({ grid })}>
      <div className={cn(posterStage({ grid, spacing, bleed }), className)} {...props} />
    </div>
  );
}
