import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/features/landing/components/shared/Button";
import { PosterStage } from "@/features/landing/components/shared/PosterStage";
import { cn } from "@/lib/utils";

type LegalContactBannerRootProps = {
  headingId: string;
  children: ReactNode;
};

function LegalContactBannerRoot({ headingId, children }: LegalContactBannerRootProps) {
  return (
    <section aria-labelledby={headingId}>
      <PosterStage.Root>
        <PosterStage.Content spacing="none" className="px-20 pb-25 max-nav:px-[20px] max-nav:pb-[28px]">
          <div className="relative flex min-h-130 items-center gap-26 rounded-u-26 bg-policy-cream px-25 max-nav:flex-col max-nav:gap-[18px] max-nav:px-[22px] max-nav:pt-[24px] max-nav:pb-[28px]">
            {children}
          </div>
        </PosterStage.Content>
      </PosterStage.Root>
    </section>
  );
}

function LegalContactBannerArtwork({ src }: { src: string }) {
  return <Image src={src} width={600} height={400} alt="" sizes="(max-width: 760px) 180px, 21vw" className="-mb-10 -ml-5 w-196 self-end max-nav:order-2 max-nav:mx-auto max-nav:mb-[-28px] max-nav:w-[180px] max-nav:self-center" />;
}

function LegalContactBannerContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex min-h-85 flex-1 flex-col justify-center border-l border-ink-navy/30 pl-26 max-nav:min-h-0 max-nav:border-0 max-nav:pl-0 max-nav:text-center", className)} {...props} />;
}

function LegalContactBannerTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("text-u-29.5 font-max leading-[0.96] tracking-[-0.015em] max-poster:text-[34px] max-phone:text-[31px]", className)} {...props} />;
}

function LegalContactBannerDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("mt-8 wrap-anywhere text-center text-u-[13.6] font-demibold leading-[1.27] max-poster:text-[17px] max-nav:mt-[12px] max-phone:text-[15px]", className)} {...props} />;
}

function LegalContactBannerAction(props: ComponentProps<"a">) {
  return (
    <Button asChild variant="flat" className="h-49 bg-brand-coral px-28 text-u-17 font-ultra text-white hover:bg-mochi-pink-ink max-poster:text-[18px] max-nav:h-[48px] max-nav:px-[28px]">
      <a {...props} />
    </Button>
  );
}

/** Presentation only: owning pages compose translated content and the contact destination. */
export const LegalContactBanner = {
  Root: LegalContactBannerRoot,
  Artwork: LegalContactBannerArtwork,
  Content: LegalContactBannerContent,
  Title: LegalContactBannerTitle,
  Description: LegalContactBannerDescription,
  Action: LegalContactBannerAction,
};
