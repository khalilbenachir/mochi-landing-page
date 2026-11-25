"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * A titled panel that slides open and closed (0fr → 1fr grid row, same easing as the FAQ).
 * Closed by default; the content stays in the server HTML so its links are still crawled.
 */
export function BlogDisclosure({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div data-open={open ? "" : undefined} className="group/disclosure mt-[26px] rounded-[15px] border border-blog-border bg-landing-canvas">
      <h2 id={id} className="text-[17px] font-heavy text-ink-navy">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-[18px] px-[18px] py-[14px] text-left focus-visible:rounded-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mochi-pink-ink"
        >
          <span>{heading}</span>
          <span
            aria-hidden="true"
            className="relative size-[13px] flex-none before:absolute before:left-0 before:top-1/2 before:h-[2px] before:w-full before:-translate-y-1/2 before:rounded-[2px] before:bg-current after:absolute after:left-0 after:top-1/2 after:h-[2px] after:w-full after:-translate-y-1/2 after:rotate-90 after:rounded-[2px] after:bg-current after:[transition:rotate_0.35s_var(--ease-smooth)] group-data-open/disclosure:after:rotate-0"
          />
        </button>
      </h2>
      <div
        id={panelId}
        role="region"
        aria-labelledby={id}
        className="invisible grid grid-rows-[0fr] opacity-0 [transition:grid-template-rows_0.35s_var(--ease-smooth),opacity_0.2s_ease,visibility_0s_linear_0.35s] group-data-open/disclosure:visible group-data-open/disclosure:grid-rows-[1fr] group-data-open/disclosure:opacity-100 group-data-open/disclosure:[transition:grid-template-rows_0.35s_var(--ease-smooth),opacity_0.3s_ease_0.05s,visibility_0s]"
      >
        <div className="overflow-hidden">
          <div className="px-[18px] pb-[14px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
