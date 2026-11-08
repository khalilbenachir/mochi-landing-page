"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { cn } from "@/lib/utils";

const BAR = "block h-[3px] w-[22px] rounded-[3px] bg-hero-menu-icon [transition:transform_0.3s_var(--ease-smooth),opacity_0.2s_ease]";

/**
 * Burger menu for narrow viewports. The panel fades and scales from the button, the
 * icon morphs into a cross, and the menu closes on link tap, outside tap or Escape.
 */
export function MobileMenu({ label, navLabel, children }: { label: string; navLabel: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useDismiss(rootRef, open, (reason) => {
    setOpen(false);
    if (reason === "escape") buttonRef.current?.focus();
  });

  return (
    <div ref={rootRef} data-open={open ? "" : undefined} className="group hidden! max-nav:relative max-nav:z-30 max-nav:ml-auto max-nav:block!">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="grid h-[48px] w-[48px] cursor-pointer place-content-center gap-[5px] rounded-[15px] bg-white transition-transform duration-250 ease-smooth active:duration-100 active:[transform:scale(0.92)]"
      >
        <i className={cn(BAR, "group-data-open:[transform:translateY(8px)_rotate(45deg)]")} />
        <i className={cn(BAR, "group-data-open:opacity-0 group-data-open:[transform:scaleX(0)]")} />
        <i className={cn(BAR, "group-data-open:[transform:translateY(-8px)_rotate(-45deg)]")} />
      </button>
      <nav
        id={panelId}
        aria-label={navLabel}
        onClick={(event) => {
          if ((event.target as Element).closest("a")) setOpen(false);
        }}
        className="invisible absolute right-0 top-[56px] grid w-[min(290px,calc(100vw-40px))] origin-top-right overflow-hidden rounded-[20px] bg-white p-2 opacity-0 [box-shadow:0_20px_50px_var(--color-hero-mobile-menu-nav-shadow)] [transform:translateY(-8px)_scale(0.96)] [transition:opacity_0.18s_ease,transform_0.22s_ease,visibility_0s_linear_0.22s] group-data-open:visible group-data-open:opacity-100 group-data-open:[transform:none] group-data-open:[transition:opacity_0.22s_ease,transform_0.32s_var(--ease-smooth),visibility_0s]"
      >
        {children}
      </nav>
    </div>
  );
}
