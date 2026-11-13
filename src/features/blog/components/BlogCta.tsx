import Image from "next/image";
import type { ComponentProps } from "react";
import { AppStoreBadge } from "@/features/landing/components/shared/AppStoreBadges";
import { Button } from "@/features/landing/components/shared/Button";
import { cn } from "@/lib/utils";
function Root({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("overflow-hidden bg-island-band text-white [--spacing:1px]", className)} {...props} />;
}
function Content({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-[170px] max-w-[1100px] items-center gap-[30px] px-[48px] py-[28px] pr-[230px] max-nav:flex-col max-nav:items-start max-nav:gap-[18px] max-nav:pl-[24px] max-nav:pr-[150px] max-phone:pl-[20px] max-phone:pr-[20px]",
        className,
      )}
      {...props}
    />
  );
}
function Title({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("max-w-[420px] text-pretty text-[34px] font-max leading-[1.08] tracking-[-0.02em] max-phone:text-[29px]", className)} {...props} />;
}
function Description({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("mt-[8px] max-w-[430px] text-[17px] font-medium leading-[1.35]", className)} {...props} />;
}
function Action(props: ComponentProps<"a">) {
  return (
    <Button asChild variant="flat" className="min-h-[46px] px-[24px] text-[16px] font-heavy">
      <a {...props} />
    </Button>
  );
}
function Store() {
  return <AppStoreBadge dark className="shrink-0 max-nav:w-full max-nav:justify-center" />;
}
function Artwork({
  src = "/blog-art/companion-mochi.webp",
  width = 600,
  height = 530,
  className,
}: {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt=""
      sizes="(max-width: 760px) 135px, 190px"
      className={cn("absolute -bottom-[12px] right-[22px] h-auto w-[190px] max-nav:right-[4px] max-nav:bottom-0 max-nav:w-[135px] max-phone:hidden", className)}
    />
  );
}
export const BlogCta = { Root, Content, Title, Description, Action, Store, Artwork };
