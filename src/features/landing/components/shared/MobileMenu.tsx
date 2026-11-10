"use client";

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { useDismiss } from "@/lib/use-dismiss";
import { cn } from "@/lib/utils";

const BAR =
  "block h-[3px] rounded-[3px] bg-hero-menu-icon [transition:width_0.35s_var(--ease-smooth),translate_0.35s_var(--ease-smooth),rotate_0.35s_var(--ease-smooth),scale_0.3s_var(--ease-smooth),opacity_0.2s_ease]";

/**
 * Each panel row slides up in turn when the menu opens, and all leave together. Rows 1-7 get
 * their own delay; any row past that shares the last step, so adding an
 * item never makes it pop in ahead of the others. Inline `--i` indices aren't allowed in features.
 */
const STAGGER =
  "*:opacity-0 *:translate-y-[6px] *:[transition:opacity_0.15s_ease,translate_0.15s_ease] group-data-open:*:opacity-100 group-data-open:*:translate-none group-data-open:*:[transition:opacity_0.3s_ease,translate_0.4s_var(--ease-smooth)] group-data-open:[&>:nth-child(1)]:delay-[40ms] group-data-open:[&>:nth-child(2)]:delay-[70ms] group-data-open:[&>:nth-child(3)]:delay-[100ms] group-data-open:[&>:nth-child(4)]:delay-[130ms] group-data-open:[&>:nth-child(5)]:delay-[160ms] group-data-open:[&>:nth-child(6)]:delay-[190ms] group-data-open:[&>:nth-child(n+7)]:delay-[220ms]";

/** How long the pointer may be away (e.g. crossing the gap to the panel) before a hover-opened menu closes. */
const HOVER_CLOSE_DELAY = 220;

/**
 * A click this soon after hover opened the menu is the same "open it" gesture (the pointer
 * arrived and clicked), so it pins the menu. A later click lands on the visible cross: close.
 */
const HOVER_CLICK_WINDOW = 300;

type MenuState = "closed" | "hover" | "pinned";

/**
 * Burger menu for narrow viewports. With a mouse it opens on hover and closes when the
 * pointer leaves; a click pins it open (or closes a pinned menu). On touch and keyboard it
 * toggles on tap/Enter. It also closes on link tap, outside tap or Escape.
 */
export function MobileMenu({ label, navLabel, children }: { label: string; navLabel: string; children: ReactNode }) {
  const [state, setState] = useState<MenuState>("closed");
  const open = state !== "closed";
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoverOpenedAt = useRef(0);
  const panelId = useId();

  const cancelClose = () => clearTimeout(closeTimer.current);
  useEffect(() => cancelClose, []);

  useDismiss(rootRef, open, (reason) => {
    cancelClose();
    setState("closed");
    if (reason === "escape") buttonRef.current?.focus();
  });

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    if (state === "closed") hoverOpenedAt.current = performance.now();
    setState((current) => (current === "closed" ? "hover" : current));
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setState((current) => (current === "hover" ? "closed" : current));
    }, HOVER_CLOSE_DELAY);
  };

  return (
    <div
      ref={rootRef}
      data-open={open ? "" : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="group hidden max-nav:relative max-nav:z-30 max-nav:ml-auto max-nav:block"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          cancelClose();
          const justHovered = performance.now() - hoverOpenedAt.current < HOVER_CLICK_WINDOW;
          setState((current) => (current === "closed" || (current === "hover" && justHovered) ? "pinned" : "closed"));
        }}
        className="group/burger grid size-[48px] cursor-pointer place-content-center justify-items-end gap-[5px] rounded-[15px] bg-white [box-shadow:0_4px_14px_var(--color-hero-menu-button-shadow)] [transition:translate_0.3s_var(--ease-smooth),scale_0.25s_var(--ease-smooth),box-shadow_0.3s_var(--ease-smooth),border-radius_0.35s_var(--ease-smooth)] hover:-translate-y-[2px] motion-reduce:hover:translate-none hover:[box-shadow:0_10px_24px_var(--color-hero-menu-button-shadow)] active:scale-92 active:duration-100 motion-reduce:active:scale-none group-data-open:rounded-[24px] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-white"
      >
        <i className={cn(BAR, "w-[22px] group-hover/burger:w-[14px] group-data-open:w-[22px] group-data-open:translate-y-[8px] group-data-open:rotate-45")} />
        <i className={cn(BAR, "w-[16px] group-hover/burger:w-[22px] group-data-open:opacity-0 group-data-open:scale-x-0")} />
        <i className={cn(BAR, "w-[10px] group-hover/burger:w-[18px] group-data-open:w-[22px] group-data-open:-translate-y-[8px] group-data-open:-rotate-45")} />
      </button>
      <nav
        id={panelId}
        aria-label={navLabel}
        onClick={(event) => {
          if ((event.target as Element).closest("a")) {
            cancelClose();
            setState("closed");
          }
        }}
        className={cn(
          // An invisible strip above the panel keeps the pointer "inside" while it crosses the gap.
          // No overflow-hidden here: it would clip that strip. Rows keep inside the rounded corners.
          "invisible absolute right-0 top-[56px] grid w-[min(290px,calc(100vw-40px))] origin-top-right rounded-[22px] bg-white p-[8px] opacity-0 [box-shadow:0_20px_50px_var(--color-hero-mobile-menu-nav-shadow)] -translate-y-[10px] scale-94 [transition:opacity_0.18s_ease,translate_0.22s_ease,scale_0.22s_ease,visibility_0s_linear_0.22s] before:absolute before:inset-x-0 before:-top-[10px] before:h-[10px] before:content-[''] group-data-open:visible group-data-open:opacity-100 group-data-open:translate-none group-data-open:scale-100 group-data-open:[transition:opacity_0.22s_ease,translate_0.4s_var(--ease-smooth),scale_0.4s_var(--ease-smooth),visibility_0s]",
          STAGGER,
        )}
      >
        {children}
      </nav>
    </div>
  );
}
