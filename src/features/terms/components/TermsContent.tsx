"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { Rays } from "@/features/landing/components/shared/decor";
import { cn } from "@/lib/utils";
import { TERMS_SECTION_IDS, type TermsSectionId } from "../content/terms";
import { TermsIcon, TermsSummaryIcon } from "./TermsIcon";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = () => window.location.hash;
const getServerHash = () => "";

function sectionFromHash(hash: string) {
  try {
    const id = decodeURIComponent(hash.slice(1));
    return TERMS_SECTION_IDS.find((candidate) => candidate === id);
  } catch {
    return undefined;
  }
}

const TermsContentContext = createContext<TermsSectionId | null>(null);

function useSelectedSection() {
  const selected = useContext(TermsContentContext);
  if (!selected) throw new Error("TermsContent components must be rendered inside TermsContent.Root");
  return selected;
}

/** All text stays server-rendered and visible; hydration adds hash highlighting and focus only. */
function TermsContentRoot({ children }: { children: ReactNode }) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const target = sectionFromHash(hash);
  const selected: TermsSectionId = target ?? "using";

  // `hash` is a dependency on purpose: re-selecting the current section re-focuses its heading.
  useEffect(() => {
    if (!target) return;
    const section = document.getElementById(target);
    section?.scrollIntoView({ block: "start" });
    section?.querySelector("h2")?.focus({ preventScroll: true });
  }, [hash, target]);

  return (
    <TermsContentContext.Provider value={selected}>
      <div className="grid grid-cols-[278fr_660fr] items-start gap-28 max-nav:grid-cols-1 max-nav:gap-[28px]">{children}</div>
    </TermsContentContext.Provider>
  );
}

function TermsContentNavigation({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="sticky top-20 rounded-u-26 border border-policy-border bg-white p-12 pb-26 [box-shadow:0_4px_14px_var(--color-policy-shadow)] max-nav:static max-nav:p-[14px]">
      <h2 className="px-10 pt-1 pb-16 text-u-21.5 font-max leading-[1.12] tracking-[-0.01em] max-poster:text-[24px] max-nav:pb-[12px] max-phone:text-[22px]">{label}</h2>
      <nav aria-label={label} className="grid max-nav:grid-cols-2 max-phone:gap-x-[8px]">{children}</nav>
    </aside>
  );
}

function TermsContentNavigationLink({ id, children }: { id: TermsSectionId; children: ReactNode }) {
  const selected = useSelectedSection();
  return (
    <a href={`#${id}`} aria-current={selected === id ? "location" : undefined} className={cn("group flex min-h-47 items-center gap-20 rounded-u-13 px-18 py-10 text-u-14.5 font-heavy leading-[1.25] tracking-[-0.01em] text-ink-navy hover:bg-policy-pink focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-2 max-poster:text-[15px] max-nav:gap-[10px] max-nav:px-[10px]", selected === id && "bg-policy-pink text-mochi-pink-ink")}>
      <TermsIcon id={id} className="size-28 flex-none max-nav:size-[24px]" />
      <span className={cn("flex min-h-27 min-w-0 flex-1 items-center wrap-anywhere", selected !== id && "border-b border-policy-border pb-6")}>{children}</span>
    </a>
  );
}

function TermsContentArticle(props: ComponentProps<"article">) {
  return <article className="grid min-w-0 gap-30 pb-4 text-u-[13.6] font-demibold leading-[1.4] max-poster:text-[17px] max-nav:gap-[28px] max-phone:text-[15px]" {...props} />;
}

function TermsContentSection({ id, ...props }: Omit<ComponentProps<"section">, "id"> & { id: TermsSectionId }) {
  return <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24" {...props} />;
}

function TermsContentHeading({ id, children }: { id: `${TermsSectionId}-title`; children: ReactNode }) {
  return (
    <h2 id={id} tabIndex={-1} className="relative mb-6 flex items-start gap-10 text-u-29.5 font-max leading-[0.96] tracking-[-0.015em] text-ink-navy max-poster:text-[clamp(34px,6vw,50px)] max-nav:mb-[12px] max-nav:gap-[6px] max-phone:text-[31px]">
      <Rays shape="burst" className="-mt-3 -ml-5 w-40 flex-none text-sun max-nav:-mt-[2px] max-nav:w-[28px]" />
      <span className="min-w-0 wrap-anywhere">{children}</span>
    </h2>
  );
}

function TermsContentText({ detail = false, className, ...props }: ComponentProps<"p"> & { detail?: boolean }) {
  return <p className={cn("pl-14 max-nav:pl-0", detail && "mt-11 max-nav:mt-[12px]", className)} {...props} />;
}

function TermsContentCallout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-20 flex items-center gap-24 rounded-u-22 bg-terms-callout px-26 py-17 text-u-[14.6] font-heavy leading-[1.3] tracking-[-0.01em] max-poster:text-[17px] max-nav:gap-[18px] max-nav:px-[20px] max-nav:py-[20px] max-phone:text-[15px]">
      <TermsSummaryIcon id="warning" className="size-62 flex-none max-nav:size-[46px]" />
      <p className="border-l border-ink-navy/40 pl-24 max-nav:pl-[18px]">{children}</p>
    </div>
  );
}

function TermsContentLink(props: ComponentProps<"a">) {
  return <a className="mt-12 ml-14 inline-block max-w-full wrap-anywhere font-heavy text-mochi-pink-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-coral max-nav:ml-0" {...props} />;
}

function TermsContentContactLink({ children, ...props }: ComponentProps<"a">) {
  return (
    <a className="mt-20 inline-flex max-w-full items-center gap-10 rounded-full bg-brand-coral px-24 py-13 wrap-anywhere font-black text-white hover:bg-mochi-pink-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-coral" {...props}>
      <TermsIcon id="contact" className="size-22 flex-none" />{children}
    </a>
  );
}

export {
  TermsContentRoot as Root,
  TermsContentNavigation as Navigation,
  TermsContentNavigationLink as NavigationLink,
  TermsContentArticle as Article,
  TermsContentSection as Section,
  TermsContentHeading as Heading,
  TermsContentText as Text,
  TermsContentCallout as Callout,
  TermsContentLink as Link,
  TermsContentContactLink as ContactLink,
};
