import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The maquette's poster coordinate system. The outer frame is the size container; on wide
 * screens the stage sets Tailwind's `--spacing` to 1/grid of its width, so every spacing
 * utility inside (`mt-14`, `w-98`, `-left-68`) and the poster-unit utilities (`text-u-41`,
 * `rounded-u-12`) scale as one poster. Below the poster breakpoint `--spacing` is 1px, so the
 * same numbers read as pixels. Tailwind's default 4px scale therefore does not apply inside a
 * stage: write fixed sizes as `p-[8px]`.
 *
 * Sections lay their content out in normal flow on the inner stage (`className` lands there),
 * so a band is as tall as its content plus the shared section spacing; nothing sets a fixed
 * band height.
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

const posterStage = cva("relative max-poster:[--spacing:1px]", {
  variants: {
    grid: {
      "1024": "[--spacing:calc(100cqw/1024)] [--section-space:calc(28*var(--spacing))]",
      "800": "[--spacing:calc(100cqw/800)] [--section-space:calc(26*var(--spacing))]",
    },
    /** `section` pads the band top and bottom; `none` leaves it flush (the footer). */
    spacing: {
      section:
        "py-(--section-space) max-poster:[--section-space:56px] max-phone:[--section-space:44px]",
      none: "",
    },
    /**
     * `bottom`: below the poster breakpoint the stacked art sits on the band's bottom edge, so
     * the bottom padding goes. On the poster, edge art pulls itself down instead with
     * `-mb-[calc(var(--section-space)+N*var(--spacing))]`, keeping the text column's padding.
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
