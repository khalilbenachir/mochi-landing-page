import { Rays } from "@/features/landing/components/shared/decor";
import { cn } from "@/lib/utils";

type LegalSummaryHeadingProps = {
  id: string;
  title: string;
  decoration: "paired" | "single";
};

/** Shared legal-page typography; decoration controls only rays, spacing and alignment. */
export function LegalSummaryHeading({ id, title, decoration }: LegalSummaryHeadingProps) {
  const paired = decoration === "paired";

  return (
    <h2 id={id} className={cn(
      "flex items-center gap-12 text-u-28 font-max leading-[0.98] tracking-[-0.015em] max-poster:text-[clamp(30px,5vw,40px)] max-nav:mb-[22px] max-nav:gap-[8px] max-phone:text-[28px]",
      paired ? "mb-13 max-nav:justify-center" : "mb-15",
    )}>
      <Rays shape="burst" className={paired ? "w-32 text-sun max-nav:w-[26px]" : "w-40 flex-none text-terms-rays max-nav:w-[28px]"} />
      <span className={paired ? undefined : "min-w-0 wrap-anywhere"}>{title}</span>
      {paired ? <Rays shape="burst" flip className="w-32 text-sun max-nav:w-[26px]" /> : null}
    </h2>
  );
}
