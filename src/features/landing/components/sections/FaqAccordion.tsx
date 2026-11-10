"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/features/landing/content/faq";

/**
 * Exclusive accordion for the FAQ. Height animates through a 0fr → 1fr grid row so the
 * open and close are both smooth without measuring the DOM. The question's font size
 * changes instantly: animating it would relayout the whole list every frame.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="grid content-start gap-3.5 max-poster:mx-auto max-poster:mb-0 max-poster:mt-[22px] max-poster:w-full max-poster:max-w-[720px] max-poster:gap-[8px]">
      {items.map(({ id, question, answer, sources, sourcesLabel }) => {
        const open = openId === id;
        const buttonId = `${baseId}-${id}-q`;
        const panelId = `${baseId}-${id}-a`;

        return (
          <div
            key={id}
            data-open={open ? "" : undefined}
            className="group rounded-u-10 bg-white [box-shadow:0_calc(2*var(--spacing))_calc(4*var(--spacing))_var(--color-faq-item-shadow)] max-poster:rounded-[14px]"
          >
            <h3 className="text-u-[13.6] font-max tracking-[-0.01em] group-data-open:text-u-[14.4] max-poster:text-[16px] max-poster:leading-[1.25] max-poster:group-data-open:text-[16px] max-phone:text-[15px] max-phone:group-data-open:text-[15px]">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : id)}
                className="flex min-h-28 w-full cursor-pointer items-center justify-between gap-12 py-4 pl-19 pr-22 text-left focus-visible:rounded-u-10 focus-visible:[outline:3px_solid_var(--color-brand-rose)] focus-visible:outline-offset-2 max-poster:min-h-[50px] max-poster:gap-[14px] max-poster:py-[10px] max-poster:px-[18px]"
              >
                <span>{question}</span>
                <span
                  className="relative size-11 flex-none before:absolute before:left-0 before:top-1/2 before:h-[calc(1.8*var(--spacing))] before:w-full before:rounded-[2px] before:bg-ink-navy before:-translate-y-1/2 after:absolute after:left-0 after:top-1/2 after:h-[calc(1.8*var(--spacing))] after:w-full after:rounded-[2px] after:bg-ink-navy after:-translate-y-1/2 after:rotate-90 after:[transition:rotate_0.35s_var(--ease-smooth)] group-data-open:after:rotate-0 max-poster:size-[14px] max-poster:before:h-[2px] max-poster:after:h-[2px]"
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="invisible grid grid-rows-[0fr] opacity-0 [transition:grid-template-rows_0.35s_var(--ease-smooth),opacity_0.2s_ease,visibility_0s_linear_0.35s] group-data-open:visible group-data-open:grid-rows-[1fr] group-data-open:opacity-100 group-data-open:[transition:grid-template-rows_0.35s_var(--ease-smooth),opacity_0.3s_ease_0.05s,visibility_0s]"
            >
              <div className="overflow-hidden">
                <p className="max-w-612 pb-9 pl-19 pr-22 text-faq-answer-text text-u-[12.2] font-semibold leading-[1.26] max-poster:max-w-none max-poster:pb-[14px] max-poster:px-[18px] max-poster:text-[15px] max-poster:leading-[1.4] max-phone:text-[14px]">{answer}</p>
                {sources ? <ul aria-label={sourcesLabel} className="grid gap-[6px] pb-[14px] pl-19 pr-22 text-[12px] font-semibold leading-[1.4] max-poster:px-[18px]">{sources.map(({ href, label }) => <li key={href}><a href={href} className="text-blog-link underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mochi-pink-ink">{label}</a></li>)}</ul> : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
