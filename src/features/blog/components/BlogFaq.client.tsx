"use client";

import { useId, useState } from "react";

type FaqItem = { id: string; question: string; answer: string };

/**
 * Exclusive FAQ accordion for articles. The answer's height animates through a 0fr → 1fr grid row,
 * so open and close are both smooth without measuring the DOM. Answers stay in the server HTML
 * (hidden with `visibility`), so crawlers and the FAQPage schema see every one.
 */
export function BlogFaq({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="grid gap-[5px]">
      {items.map(({ id, question, answer }) => {
        const open = openId === id;
        const buttonId = `${baseId}-${id}-q`;
        const panelId = `${baseId}-${id}-a`;
        return (
          <div
            key={id}
            data-open={open ? "" : undefined}
            className="group/question rounded-[14px] border border-blog-border bg-white [box-shadow:0_2px_5px_var(--color-blog-shadow)]"
          >
            <h3 className="text-[17px] font-heavy leading-[1.2]">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : id)}
                className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-[18px] px-[18px] py-[11px] text-left focus-visible:rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mochi-pink-ink"
              >
                <span>{question}</span>
                <span
                  aria-hidden="true"
                  className="relative size-[13px] flex-none before:absolute before:left-0 before:top-1/2 before:h-[2px] before:w-full before:-translate-y-1/2 before:rounded-[2px] before:bg-current after:absolute after:left-0 after:top-1/2 after:h-[2px] after:w-full after:-translate-y-1/2 after:rotate-90 after:rounded-[2px] after:bg-current after:[transition:rotate_0.35s_var(--ease-smooth)] group-data-open/question:after:rotate-0"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="invisible grid grid-rows-[0fr] opacity-0 [transition:grid-template-rows_0.35s_var(--ease-smooth),opacity_0.2s_ease,visibility_0s_linear_0.35s] group-data-open/question:visible group-data-open/question:grid-rows-[1fr] group-data-open/question:opacity-100 group-data-open/question:[transition:grid-template-rows_0.35s_var(--ease-smooth),opacity_0.3s_ease_0.05s,visibility_0s]"
            >
              <div className="overflow-hidden">
                <p className="px-[18px] pb-[14px] text-[15px] font-normal leading-[1.5] text-ink-slate">{answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
