import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { BLOG_ART_SIZE } from "../content/catalog";

const card = cva("group/card relative min-w-0 rounded-[24px] border border-blog-border bg-white p-[12px] [box-shadow:0_3px_8px_var(--color-blog-shadow)]", {
  variants: {
    variant: {
      featured: "grid grid-cols-[1fr_1.35fr] items-center gap-[28px] p-[20px] max-nav:gap-[20px] max-nav:grid-cols-1 max-phone:p-[12px]",
      standard: "flex h-full flex-col",
    },
  },
  defaultVariants: { variant: "standard" },
});
function Root({ variant = "standard", className, ...props }: ComponentProps<"article"> & VariantProps<typeof card>) {
  return <article data-variant={variant} className={cn(card({ variant }), className)} {...props} />;
}
function Media({ src, alt, tone, contain = false, priority = false }: { src: string; alt: string; tone?: string; contain?: boolean; priority?: boolean }) {
  return (
    <div className={cn("aspect-[2/1] overflow-hidden rounded-[18px] group-data-[variant=featured]/card:aspect-[1.5]", tone)}>
      <Image
        src={src}
        alt={alt}
        {...BLOG_ART_SIZE}
        priority={priority}
        sizes="(max-width: 480px) calc(100vw - 66px), (max-width: 1099px) 44vw, 440px"
        className={cn("h-full w-full", contain ? "object-contain" : "object-cover")}
      />
    </div>
  );
}
function Content({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col items-start px-[8px] pb-[7px] pt-[10px] group-data-[variant=featured]/card:pr-[8px] max-phone:group-data-[variant=featured]/card:px-[6px]",
        className,
      )}
      {...props}
    />
  );
}
function Category({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-block rounded-full bg-mochi-pink-ink px-[13px] py-[4px] text-[13px] font-heavy leading-[1.15] text-white", className)}
      {...props}
    />
  );
}
function Title({ href, children, as: Heading = "h3" }: { href: string; children: React.ReactNode; as?: "h2" | "h3" }) {
  return (
    <Heading className="mt-[8px] text-pretty text-[24px] font-max leading-[1.08] tracking-[-0.025em] text-ink-navy group-data-[variant=featured]/card:text-[40px] max-poster:group-data-[variant=featured]/card:text-[34px] max-phone:text-[25px] max-phone:group-data-[variant=featured]/card:text-[31px]">
      <Link
        href={href}
        className="underline-offset-4 after:absolute after:inset-0 after:rounded-[24px] hover:underline focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-mochi-pink-ink"
      >
        {children}
      </Link>
    </Heading>
  );
}
function Meta({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("mt-auto flex w-full flex-wrap items-center gap-[8px] pt-[16px] text-[14px] font-semibold text-ink-slate", className)} {...props} />
  );
}
function Action({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "relative z-10 ml-auto inline-flex min-h-[44px] items-center justify-center rounded-full bg-mochi-pink-ink px-[24px] text-[17px] font-heavy text-white transition-colors hover:bg-ink-navy focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-mochi-pink-ink",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
export const BlogCard = { Root, Media, Content, Category, Title, Meta, Action };
