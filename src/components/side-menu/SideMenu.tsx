"use client";

import { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { cn } from "@/lib/utils";

export type SideMenuItem = { id: string; label: string };

type SideMenuContextValue = {
  items: readonly SideMenuItem[];
  activeIndex: number;
  setActive: (id: string) => void;
  expanded: boolean;
  toggle: () => void;
  bodyId: string;
};

const SideMenuContext = createContext<SideMenuContextValue | null>(null);

function useSideMenu() {
  const context = useContext(SideMenuContext);
  if (!context) throw new Error("SideMenu parts must be rendered inside SideMenu.Root");
  return context;
}

/**
 * Sticky "on this page" menu shared by blog articles and legal pages. Root tracks the section in
 * view (IntersectionObserver on each item's id) and the collapsed state on small screens; the
 * other parts read it, so a page composes only the parts it needs.
 */
function Root({ items, className, children }: { items: readonly SideMenuItem[]; className?: string; children: ReactNode }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.filter((item) => item.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (entry) setActive(entry.target.id);
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    for (const { id } of items) {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    }
    return () => observer.disconnect();
  }, [items]);

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === active));

  return (
    <SideMenuContext.Provider value={{ items, activeIndex, setActive, expanded, toggle: () => setExpanded((value) => !value), bodyId }}>
      <aside className={cn("sticky top-[88px] self-start overflow-hidden rounded-[24px] border border-blog-border bg-white [box-shadow:0_6px_18px_var(--color-blog-shadow)] max-nav:static", className)}>
        {children}
      </aside>
    </SideMenuContext.Provider>
  );
}

function Counter({ className }: { className?: string }) {
  const { items, activeIndex } = useSideMenu();
  return <span className={cn("text-[12px] font-heavy tabular-nums text-mochi-pink-ink", className)} aria-hidden="true">{activeIndex + 1} / {items.length}</span>;
}

/** Mochi and the title; on small screens the same row is the button that opens the menu. */
function Header({ title, children }: { title: string; children?: ReactNode }) {
  const { expanded, toggle, bodyId } = useSideMenu();
  const mochi = <Image src={LANDING_ASSETS.faces.headerHappy} alt="" width={256} height={238} className="h-auto w-[34px] shrink-0 -rotate-6 max-nav:w-[30px]" />;
  return (
    <div className="bg-[linear-gradient(180deg,var(--color-blog-pink),transparent)] px-[18px] pb-[14px] pt-[16px] max-nav:p-[14px]">
      <div className="flex items-center gap-[10px] max-nav:hidden">
        {mochi}
        <h2 className="text-[19px] font-max leading-[1.15] tracking-[-0.02em]">{title}</h2>
      </div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={toggle}
        className="hidden min-h-[44px] w-full cursor-pointer items-center gap-[10px] rounded-[10px] text-left text-[18px] font-max focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink max-nav:flex"
      >
        {mochi}
        <span className="flex-1">{title}</span>
        <Counter className="text-[13px]" />
        <ChevronDown aria-hidden="true" className={cn("size-[20px] transition-[rotate]", expanded && "rotate-180")} />
      </button>
      {children}
    </div>
  );
}

/** One segment per item, filled up to the section in view, with an "n / total" counter. */
function Progress() {
  const { items, activeIndex } = useSideMenu();
  return (
    <div className="mt-[12px] flex items-center gap-[10px]" aria-hidden="true">
      <div className="flex flex-1 gap-[3px]">
        {items.map(({ id }, index) => (
          <span key={id} className={cn("h-[6px] flex-1 rounded-full transition-colors duration-500", index <= activeIndex ? "bg-mochi-pink-ink" : "bg-white")} />
        ))}
      </div>
      <Counter className="max-nav:hidden" />
    </div>
  );
}

/** Everything below the header; collapsed on small screens until the header button opens it. */
function Body({ children }: { children: ReactNode }) {
  const { expanded, bodyId } = useSideMenu();
  return (
    <div id={bodyId} className={cn("px-[18px] pb-[18px] max-nav:px-[14px] max-nav:pb-[14px]", !expanded && "max-nav:hidden")}>
      {children}
    </div>
  );
}

/** Numbered steps on a line: read sections pink, the current one filled, upcoming ones outlined. */
function List({ label }: { label: string }) {
  const { items, activeIndex, setActive } = useSideMenu();
  return (
    <nav aria-label={label} className="mt-[4px]">
      <ol className="relative m-0 grid list-none gap-[2px] p-0 before:absolute before:bottom-[22px] before:left-[13px] before:top-[22px] before:w-[2px] before:rounded-full before:bg-blog-border">
        {items.map(({ id, label: itemLabel }, index) => {
          const state = index < activeIndex ? "read" : index === activeIndex ? "current" : "next";
          return (
            <li key={id} className="relative min-w-0">
              <a
                href={`#${id}`}
                onClick={() => setActive(id)}
                aria-current={state === "current" ? "location" : undefined}
                className={cn(
                  "group flex min-h-[44px] items-center gap-[12px] rounded-[12px] py-[8px] pl-0 pr-[10px] text-[15px] font-heavy leading-[1.25] transition-colors hover:bg-landing-canvas focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mochi-pink-ink",
                  state === "current" && "bg-blog-pink text-mochi-pink-ink hover:bg-blog-pink",
                  state === "read" && "text-ink-navy/70",
                )}
              >
                <span
                  className={cn(
                    "relative z-1 grid size-[28px] shrink-0 place-items-center rounded-full border-2 text-[11px] font-max tabular-nums transition-colors",
                    state === "current" && "border-mochi-pink-ink bg-mochi-pink-ink text-white [box-shadow:0_0_0_4px_var(--color-blog-pink)]",
                    state === "read" && "border-mochi-pink-ink bg-blog-pink text-mochi-pink-ink",
                    state === "next" && "border-blog-border bg-white text-ink-navy/60 group-hover:border-mochi-pink-ink",
                  )}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 wrap-anywhere">{itemLabel}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Named exports so server components can compose it: `import * as SideMenu from "…/SideMenu"`.
export { Root, Header, Progress, Body, List };
