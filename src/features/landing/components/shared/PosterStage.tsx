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
const posterRoot = cva("relative mx-auto @container max-poster:@container-normal", {
  variants: {
    grid: {
      "1024": "w-[min(100%,1320px)]",
      "800": "w-[min(100%,1100px)]",
    },
  },
  defaultVariants: { grid: "1024" },
});

const posterContent = cva("relative max-poster:[--spacing:1px]", {
  variants: {
    grid: {
      "1024": "[--spacing:calc(100cqw/1024)] [--section-space:calc(96*var(--spacing))]",
      "800": "[--spacing:calc(100cqw/800)] [--section-space:calc(90*var(--spacing))]",
    },
    /** `section` pads the band top and bottom; `none` leaves it flush (the footer). */
    spacing: {
      section:
        "py-(--section-space) max-poster:[--section-space:112px] max-phone:[--section-space:88px]",
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

type PosterStageRootProps = ComponentProps<"div"> & VariantProps<typeof posterRoot>;
type PosterStageContentProps = ComponentProps<"div"> & VariantProps<typeof posterContent>;

function PosterStageRoot({ grid, className, ...props }: PosterStageRootProps) {
  return <div className={cn(posterRoot({ grid }), className)} {...props} />;
}

function PosterStageContent({ grid, spacing, bleed, className, ...props }: PosterStageContentProps) {
  return <div className={cn(posterContent({ grid, spacing, bleed }), className)} {...props} />;
}

function PosterStageShorthand({
  grid,
  spacing,
  bleed,
  className,
  ...props
}: PosterStageRootProps & PosterStageContentProps) {
  return (
    <PosterStageRoot grid={grid}>
      <PosterStageContent grid={grid} spacing={spacing} bleed={bleed} className={className} {...props} />
    </PosterStageRoot>
  );
}

/** Compound API for layouts that need to compose the frame and its content explicitly. */
export const PosterStage = Object.assign(PosterStageShorthand, {
  Root: PosterStageRoot,
  Content: PosterStageContent,
});
