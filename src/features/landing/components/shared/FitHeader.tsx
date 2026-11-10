"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Header that falls back to the burger menu whenever its `[data-fit-nav]` links don't fit in their
 * column: a long locale, a wider fallback font, or the browser translating the page. It sets
 * `data-collapsed`; children hide with `group-data-collapsed/header:invisible`, which keeps their
 * space, so the measurement is the same in both states and the header can't flip back and forth.
 */
export function FitHeader({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useLayoutEffect(() => {
    const header = ref.current;
    const nav = header?.querySelector<HTMLElement>("[data-fit-nav]");
    if (!header || !nav) return;

    const measure = () => setCollapsed(nav.scrollWidth > nav.clientWidth + 1);
    measure();

    // Watch the column and every link: links resize when fonts load or text is translated.
    const resize = new ResizeObserver(measure);
    resize.observe(nav);
    for (const link of Array.from(nav.children)) resize.observe(link);
    // Translation tools may also swap the links' text nodes.
    const mutation = new MutationObserver(measure);
    mutation.observe(nav, { subtree: true, childList: true, characterData: true });
    void document.fonts?.ready.then(measure);

    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);

  return (
    <header ref={ref} data-collapsed={collapsed ? "" : undefined} className={cn("group/header", className)}>
      {children}
    </header>
  );
}
