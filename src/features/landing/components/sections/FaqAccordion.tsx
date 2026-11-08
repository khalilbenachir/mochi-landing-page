"use client";

import { useId, useState } from "react";

type FaqItem = { id: string; question: string; answer: string };

/**
 * Exclusive accordion for the FAQ. Height animates through a 0fr → 1fr grid row so the
 * open and close are both smooth without measuring the DOM.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="grid content-start gap-[calc(3.5*var(--u))] max-poster:mx-auto max-poster:mb-0 max-poster:mt-[22px] max-poster:w-full max-poster:max-w-[720px] max-poster:gap-[8px]">
      {items.map(({ id, question, answer }) => {
        const open = openId === id;
        const buttonId = `${baseId}-${id}-q`;
        const panelId = `${baseId}-${id}-a`;

        return (
          <div
            key={id}
            data-open={open ? "" : undefined}
            className="group rounded-[calc(10*var(--u))] bg-white [box-shadow:0_calc(2*var(--u))_calc(4*var(--u))_var(--color-faq-item-shadow)] max-poster:rounded-[14px]"
          >
            <h3 className="m-0 text-[calc(13.6*var(--u))] font-[1000] tracking-[-0.01em] [transition:font-size_0.35s_var(--ease-smooth)] group-data-open:text-[calc(14.4*var(--u))] max-poster:text-[16px] max-poster:leading-[1.25] max-poster:group-data-open:text-[16px] max-phone:text-[15px] max-phone:group-data-open:text-[15px]">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : id)}
                className="flex min-h-[calc(19.5*var(--u))] w-full cursor-pointer items-center justify-between pl-[calc(23*var(--u))] pr-[calc(22*var(--u))] text-left [transition:min-height_0.35s_var(--ease-smooth),padding_0.35s_var(--ease-smooth)] group-data-open:min-h-[calc(26*var(--u))] group-data-open:pl-[calc(19*var(--u))] focus-visible:rounded-[calc(10*var(--u))] focus-visible:[outline:3px_solid_var(--color-brand-rose)] focus-visible:outline-offset-2 max-poster:min-h-[50px] max-poster:gap-[14px] max-poster:py-[10px] max-poster:pl-[18px] max-poster:pr-[18px] max-poster:group-data-open:min-h-[50px] max-poster:group-data-open:pl-[18px]"
              >
                <span>{question}</span>
                <span
                  className="relative h-[calc(11*var(--u))] w-[calc(11*var(--u))] flex-none before:absolute before:left-0 before:top-1/2 before:h-[calc(1.8*var(--u))] before:w-full before:rounded-[2px] before:bg-ink-navy before:content-[''] before:[transform:translateY(-50%)] after:absolute after:left-0 after:top-1/2 after:h-[calc(1.8*var(--u))] after:w-full after:rounded-[2px] after:bg-ink-navy after:content-[''] after:[transform:translateY(-50%)_rotate(90deg)] after:[transition:transform_0.35s_var(--ease-smooth)] group-data-open:after:[transform:translateY(-50%)_rotate(0deg)] max-poster:h-[14px] max-poster:w-[14px] max-poster:before:h-[2px] max-poster:after:h-[2px]"
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="invisible grid grid-rows-[0fr] opacity-0 [transition:grid-template-rows_0.35s_var(--ease-smooth),margin_0.35s_var(--ease-smooth),opacity_0.2s_ease,visibility_0s_linear_0.35s] group-data-open:visible group-data-open:mt-[calc(-5*var(--u))] group-data-open:grid-rows-[1fr] group-data-open:opacity-100 group-data-open:[transition:grid-template-rows_0.35s_var(--ease-smooth),margin_0.35s_var(--ease-smooth),opacity_0.3s_ease_0.05s,visibility_0s] max-poster:group-data-open:mt-[-2px]"
            >
              <div className="overflow-hidden">
                <p className="m-0 max-w-[calc(612*var(--u))] pb-[calc(9*var(--u))] pl-[calc(19*var(--u))] pr-[calc(22*var(--u))] pt-0 text-faq-answer-text text-[calc(12.2*var(--u))] font-[600] leading-[1.26] max-poster:max-w-none max-poster:pb-[14px] max-poster:pl-[18px] max-poster:pr-[18px] max-poster:text-[15px] max-poster:leading-[1.4] max-phone:text-[14px]">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
