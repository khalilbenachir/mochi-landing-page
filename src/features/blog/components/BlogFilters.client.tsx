"use client";

import { createContext, useContext, useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ALL_CATEGORIES } from "../content/filters";

const PARAM = "category";

/** `resultText` is formatted on the server (ICU plurals), so the client never handles message syntax. */
type FilterOption = { id: string; label: string; resultText: string };
type FilterState = { selected: string; select: (value: string) => void; options: FilterOption[]; label: string };
const FilterContext = createContext<FilterState | null>(null);

function useFilter() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("BlogFilters parts must be inside BlogFilters.Root");
  return context;
}

/**
 * The page stays statically rendered with every card in the HTML, so all guides are crawlable
 * and readable without JavaScript. The selection is mirrored to `?category=` so a filtered
 * view can be shared and survives reloads.
 */
export function Root({ options, label, children }: { options: FilterOption[]; label: string; children: ReactNode }) {
  const [selected, setSelected] = useState(ALL_CATEGORIES);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(PARAM);
    if (requested && options.some((option) => option.id === requested)) setSelected(requested);
  }, [options]);

  function select(value: string) {
    setSelected(value);
    const url = new URL(window.location.href);
    if (value === ALL_CATEGORIES) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, value);
    window.history.replaceState(window.history.state, "", url);
  }

  return <FilterContext.Provider value={{ selected, select, options, label }}>{children}</FilterContext.Provider>;
}

export function Tabs() {
  const { selected, select, options, label } = useFilter();
  const resultText = options.find((option) => option.id === selected)?.resultText ?? "";
  return (
    <div className="py-[24px] max-phone:py-[20px]">
      <div role="group" aria-label={label} className="flex flex-wrap justify-between gap-[12px] max-nav:justify-start max-phone:gap-[8px]">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected === option.id}
            onClick={() => select(option.id)}
            className="min-h-[44px] cursor-pointer rounded-full border border-blog-border bg-white px-[24px] py-[9px] text-[16px] font-heavy leading-[1.2] text-ink-navy [box-shadow:0_2px_3px_var(--color-blog-shadow)] hover:border-mochi-pink-ink aria-pressed:border-ink-navy aria-pressed:bg-ink-navy aria-pressed:text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink max-phone:px-[16px] max-phone:text-[14px]"
          >
            {option.label}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {resultText}
      </p>
    </div>
  );
}

export function Featured({ children }: { children: ReactNode }) {
  const { selected } = useFilter();
  return (
    <div hidden={selected !== ALL_CATEGORIES} className="mb-[24px]">
      {children}
    </div>
  );
}

export function Grid({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-3 gap-[22px] max-poster:grid-cols-2 max-nav:gap-[16px] max-nav:grid-cols-1", className)} {...props} />;
}

/** `hideWhenAll` marks the grid copy of the featured post, which the Featured slot shows instead. */
export function Item({ category, children, hideWhenAll = false }: { category: string; children: ReactNode; hideWhenAll?: boolean }) {
  const { selected } = useFilter();
  const hidden = selected === ALL_CATEGORIES ? hideWhenAll : selected !== category;
  return <div hidden={hidden}>{children}</div>;
}
