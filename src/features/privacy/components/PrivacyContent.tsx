"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Rays } from "@/features/landing/components/shared/decor";
import { cn } from "@/lib/utils";
import { POLICY_SECTION_IDS, type PolicySectionCopy, type PolicySectionId } from "../content/policy";
import { PolicyIcon } from "./PolicyIcon";

type PrivacyContentProps = {
  sections: PolicySectionCopy[];
  navLabel: string;
  callout: string;
  email: string;
};

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = () => window.location.hash;
const getServerHash = () => "";

function sectionFromHash(hash: string) {
  try {
    const id = decodeURIComponent(hash.slice(1));
    return POLICY_SECTION_IDS.find((candidate) => candidate === id);
  } catch {
    return undefined;
  }
}

/**
 * Every section is always rendered and visible, so the whole policy reads without JavaScript and
 * stays searchable. This client island only highlights the section named by the URL hash and moves
 * focus to its heading.
 */
export function PrivacyContent({ sections, navLabel, callout, email }: PrivacyContentProps) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const target = sectionFromHash(hash);
  const selected: PolicySectionId = target ?? "collect";

  useEffect(() => {
    if (!target) return;
    const section = document.getElementById(target);
    section?.scrollIntoView({ block: "start" });
    section?.querySelector("h2")?.focus({ preventScroll: true });
  }, [hash, target]);

  return (
    <div className="grid min-h-492 grid-cols-[278fr_660fr] items-start gap-28 max-nav:grid-cols-1 max-nav:gap-[28px]">
      <aside className="sticky top-20 rounded-u-26 border border-policy-border bg-white p-12 pb-26 [box-shadow:0_4px_14px_var(--color-policy-shadow)] max-nav:static max-nav:p-[14px]">
        <h2 className="px-10 pt-1 pb-16 text-u-21.5 font-max leading-[1.12] tracking-[-0.01em] max-poster:text-[24px] max-nav:pb-[12px] max-phone:text-[22px]">{navLabel}</h2>
        <nav aria-label={navLabel} className="grid max-nav:grid-cols-2 max-phone:gap-x-[8px]">
          {sections.map(({ id, nav }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={selected === id ? "location" : undefined}
              className={cn(
                "group flex min-h-47 items-center gap-20 rounded-u-13 px-18 py-10 text-u-14.5 font-heavy leading-[1.25] tracking-[-0.01em] text-ink-navy hover:bg-policy-pink focus-visible:outline-2 focus-visible:outline-brand-coral focus-visible:outline-offset-2 max-poster:text-[15px] max-nav:gap-[10px] max-nav:px-[10px]",
                selected === id && "bg-policy-pink text-mochi-pink-ink",
              )}
            >
              <PolicyIcon id={id} className="size-28 flex-none max-nav:size-[24px]" />
              <span className={cn("flex min-h-27 min-w-0 flex-1 items-center wrap-anywhere", selected !== id && "border-b border-policy-border pb-6")}>{nav}</span>
            </a>
          ))}
        </nav>
      </aside>

      <article className="grid min-w-0 gap-30 max-nav:gap-[28px] pb-4 text-u-[13.6] font-demibold leading-[1.4] max-poster:text-[17px] max-phone:text-[15px]">
        {sections.map(({ id, title, body, detail }) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
            <h2 id={`${id}-title`} tabIndex={-1} className="relative mb-6 flex items-start gap-10 text-u-29.5 font-max leading-[0.96] tracking-[-0.015em] text-ink-navy max-poster:text-[clamp(34px,6vw,50px)] max-nav:mb-[12px] max-nav:gap-[6px] max-phone:text-[31px]">
              <Rays shape="burst" className="-mt-3 -ml-5 w-40 flex-none text-sun max-nav:-mt-[2px] max-nav:w-[28px]" />
              <span className="min-w-0 wrap-anywhere">{title}</span>
            </h2>
            <p className="pl-14 max-nav:pl-0">{body}</p>
            <p className="mt-11 pl-14 max-nav:mt-[12px] max-nav:pl-0">{detail}</p>
            {id === "device" ? (
              <div className="mt-20 flex items-center gap-24 rounded-u-22 bg-policy-pink px-36 py-17 text-u-[14.6] font-heavy leading-[1.3] tracking-[-0.01em] max-poster:text-[17px] max-nav:gap-[18px] max-nav:px-[20px] max-nav:py-[20px] max-phone:text-[15px]">
                <PolicyIcon id="lock" className="size-52 flex-none text-brand-coral max-nav:size-[36px]" />
                <p className="border-l border-mochi-pink-ink/40 pl-26 max-nav:pl-[18px]">{callout}</p>
              </div>
            ) : null}
            {id === "contact" ? (
              <a href={`mailto:${email}`} className="mt-20 inline-flex max-w-full items-center gap-10 rounded-full bg-brand-coral px-24 py-13 wrap-anywhere font-black text-white hover:bg-mochi-pink-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-coral">
                <PolicyIcon id="contact" className="size-22" />{email}
              </a>
            ) : null}
          </section>
        ))}
      </article>
    </div>
  );
}
