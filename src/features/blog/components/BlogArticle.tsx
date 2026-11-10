import type { ComponentProps, ReactNode } from "react";
import { Rays } from "@/features/landing/components/shared/decor";
import type { SourceLink } from "@/lib/editorial-sources";
import { cn } from "@/lib/utils";

function Root({ className, ...props }: ComponentProps<"article">) {
  return <article className={cn("w-full", className)} {...props} />;
}

function Header({ className, ...props }: ComponentProps<"header">) {
  return <header className={cn("min-w-0", className)} {...props} />;
}

function Meta({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-[18px] flex flex-wrap items-center gap-x-[10px] gap-y-[6px] text-[13px] font-semibold leading-[1.4] text-ink-slate", className)}
      {...props}
    />
  );
}

function Layout({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-[230px_minmax(0,1fr)] items-start gap-[30px] py-[30px] max-nav:grid-cols-1 max-nav:gap-[22px] max-phone:py-[22px]",
        className,
      )}
      {...props}
    />
  );
}

function Heading({ className, children, ...props }: ComponentProps<"h2">) {
  return (
    <h2 className={cn("relative text-pretty text-[31px] font-max leading-[1.1] tracking-[-0.025em] text-ink-navy max-phone:text-[27px]", className)} {...props}>
      <Rays shape="privacy" aria-hidden="true" className="absolute -left-[23px] top-[3px] w-[19px] -rotate-12 text-sun max-phone:hidden" />
      {children}
    </h2>
  );
}

function Content({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full text-[17px] font-normal leading-[1.6] text-ink-slate [&_section]:mt-[26px] [&_section]:scroll-mt-[24px] [&_h2]:mb-[12px] [&_p+p]:mt-[12px] [&_ul]:my-[14px] [&_ul]:list-disc [&_ul]:space-y-[8px] [&_ul]:pl-[24px] [&_ul>li]:pl-[3px] [&_li]:marker:text-mochi-pink-ink",
        className,
      )}
      {...props}
    />
  );
}

/** Per-section citations: a labelled paragraph, not a landmark, so screen-reader landmark menus stay short. */
function SectionSources({ label, sources }: { label: string; sources: SourceLink[] }) {
  return (
    <p className="mt-[10px] flex flex-wrap gap-x-[14px] gap-y-[6px] text-[12px] leading-[1.4]">
      <span className="sr-only">{label}:</span>
      {sources.map(({ href, label: text }) => (
        <a key={href} href={href} className="text-blog-link underline underline-offset-4">
          {text}
        </a>
      ))}
    </p>
  );
}

function Sources({ heading, sources, children }: { heading: string; sources: SourceLink[]; children?: ReactNode }) {
  return (
    <details className="mt-[26px] rounded-[15px] border border-blog-border bg-landing-canvas px-[18px] py-[14px]">
      <summary className="cursor-pointer">
        <h2 id="article-sources" className="inline text-[17px] font-heavy text-ink-navy">
          {heading}
        </h2>
      </summary>
      <ul className="mt-[16px] grid gap-[10px] text-[13px] font-semibold leading-[1.4]">
        {sources.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="rounded-[3px] text-blog-link underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-mochi-pink-ink"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      {children}
    </details>
  );
}

export const BlogArticle = { Root, Header, Meta, Layout, Heading, Content, SectionSources, Sources };
