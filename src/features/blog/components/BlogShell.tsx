import type { ComponentProps } from "react";
import { SiteHeader } from "@/features/landing/components/shared/SiteHeader";
import { localePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useBlogLocale } from "../i18n";

function Root({ className, ...props }: ComponentProps<"main">) {
  return <main id="top" className={cn("flex-1 bg-journal-canvas text-ink-navy", className)} {...props} />;
}

/** The shared site header, pointed at this locale's home; `route` keeps the page when switching language. */
function Header({ route }: { route: string }) {
  const home = localePath(useBlogLocale());
  return <SiteHeader homeHref={home} sectionBase={home} localeRoute={route} activePage="blog" />;
}

function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1100px] px-[48px] max-nav:px-[24px] max-phone:px-[20px]", className)} {...props} />;
}

export const BlogShell = { Root, Header, Container };
