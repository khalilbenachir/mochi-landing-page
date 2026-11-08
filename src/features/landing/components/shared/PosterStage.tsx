import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The maquette's poster coordinate system. On wide screens `--u` is 1/grid of the stage
 * width, so every `calc(N*var(--u))` coordinate scales as one poster; below the poster
 * breakpoint the stage becomes normal flow and `--u` is 1px. Sections pass their
 * aspect ratio and small-screen padding through `className`.
 */
const posterStage = cva(
  "relative mx-auto @container max-poster:@container-normal max-poster:aspect-auto max-poster:[--u:1px]",
  {
    variants: {
      grid: {
        "1024": "w-[min(100%,1440px)] [--u:calc(100cqw/1024)]",
        "800": "w-[min(100%,1200px)] [--u:calc(100cqw/800)]",
      },
    },
    defaultVariants: { grid: "1024" },
  },
);

export function PosterStage({ grid, className, ...props }: ComponentProps<"div"> & VariantProps<typeof posterStage>) {
  return <div className={cn(posterStage({ grid }), className)} {...props} />;
}
