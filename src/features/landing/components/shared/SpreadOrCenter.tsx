"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A wrapping row that spreads its children to the edges while they fit on one line and centers
 * them once the row wraps. CSS can't tell a flex row it has wrapped, so a ResizeObserver checks
 * whether the last child starts below the first and sets `data-stacked`; style both states with
 * `data-stacked:` variants.
 */
export function SpreadOrCenter({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stacked, setStacked] = useState(false);

  useLayoutEffect(() => {
    const row = ref.current;
    if (!row) return;
    const measure = () => {
      const items = Array.from(row.children);
      const first = items[0]?.getBoundingClientRect();
      const last = items[items.length - 1]?.getBoundingClientRect();
      // Items are vertically centered, so compare against the first item's bottom, not its top.
      setStacked(Boolean(first && last && last.top >= first.bottom - 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-stacked={stacked ? "" : undefined} className={cn("group/spread flex flex-wrap", className)}>
      {children}
    </div>
  );
}
