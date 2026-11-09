"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { cn } from "@/lib/utils";

export type LocaleOption = {
  locale: string;
  name: string;
  short: string;
  href: string;
};

type LocaleMenuProps = {
  current: LocaleOption;
  options: readonly LocaleOption[];
  /** Accessible name of the language navigation landmark. */
  label: string;
  /** Accessible name of the trigger, including the current language. */
  triggerLabel: string;
  className?: string;
};

/**
 * Language dropdown (disclosure pattern): a pill trigger that opens a list of language links.
 * Closes on Escape, outside press or link tap; ArrowUp/ArrowDown move between languages.
 */
export function LocaleMenu({ current, options, label, triggerLabel, className }: LocaleMenuProps) {
  const [open, setOpen] = useState(false);
  const [focusOnOpen, setFocusOnOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useDismiss(rootRef, open, (reason) => {
    setOpen(false);
    if (reason === "escape") buttonRef.current?.focus();
  });

  const links = () => Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);

  useEffect(() => {
    if (!open || !focusOnOpen) return;
    const items = links();
    (items.find((item) => item.getAttribute("aria-current")) ?? items[0])?.focus();
    setFocusOnOpen(false);
  }, [open, focusOnOpen]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpen(true);
    setFocusOnOpen(true);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const items = links();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const last = items.length - 1;
    const next =
      event.key === "ArrowDown" ? (index >= last ? 0 : index + 1)
      : event.key === "ArrowUp" ? (index <= 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <nav
      ref={rootRef}
      aria-label={label}
      data-open={open ? "" : undefined}
      className={cn("group relative", className)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onTriggerKeyDown}
        className="inline-flex h-[30px] cursor-pointer items-center gap-[5px] rounded-full border border-white/35 bg-black/10 pl-[9px] pr-[8px] text-xs font-black text-white backdrop-blur-sm transition-colors hover:bg-white/15 group-data-open:bg-white group-data-open:text-mochi-pink-ink"
      >
        <Globe className="size-[15px]" strokeWidth={2.4} aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown
          className="size-[13px] transition-transform duration-250 ease-smooth group-data-open:rotate-180"
          strokeWidth={3}
          aria-hidden="true"
        />
      </button>
      <ul
        ref={listRef}
        id={listId}
        onKeyDown={onListKeyDown}
        onClick={(event) => {
          if ((event.target as Element).closest("a")) setOpen(false);
        }}
        className="invisible absolute right-0 top-[calc(100%+8px)] z-30 grid w-max min-w-[208px] origin-top-right rounded-[18px] bg-white p-[6px] opacity-0 [box-shadow:0_20px_50px_var(--color-hero-mobile-menu-nav-shadow)] -translate-y-[6px] scale-96 [transition:opacity_0.18s_ease,translate_0.22s_ease,scale_0.22s_ease,visibility_0s_linear_0.22s] group-data-open:visible group-data-open:opacity-100 group-data-open:translate-none group-data-open:scale-100 group-data-open:[transition:opacity_0.22s_ease,translate_0.32s_var(--ease-smooth),scale_0.32s_var(--ease-smooth),visibility_0s]"
      >
        {options.map((option) => {
          const active = option.locale === current.locale;
          return (
            <li key={option.locale}>
              <a
                href={option.href}
                hrefLang={option.locale}
                lang={option.locale}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between gap-[16px] rounded-[12px] px-[12px] py-[9px] text-[14px] font-heavy text-ink-navy outline-none transition-colors hover:bg-hero-locale-mobile-bg focus-visible:bg-hero-locale-mobile-bg",
                  active && "text-mochi-pink-ink",
                )}
              >
                <span>{option.name}</span>
                {active ? (
                  <Check className="size-[16px] flex-none" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <span className="text-[11px] font-black text-ink-navy/45" aria-hidden="true">
                    {option.locale.toUpperCase()}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
