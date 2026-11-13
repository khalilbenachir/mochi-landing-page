"use client";

import { useEffect, useSyncExternalStore } from "react";
import * as SideMenu from "@/components/side-menu/SideMenu";
import { Rays } from "@/features/landing/components/shared/decor";
import { POLICY_SECTION_IDS, type PolicySectionCopy } from "../content/policy";
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
 * stays searchable. This client island scrolls to the section named by the URL hash and moves focus
 * to its heading; the side menu is the shared SideMenu.
 */
export function PrivacyContent({ sections, navLabel, callout, email }: PrivacyContentProps) {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const target = sectionFromHash(hash);

  useEffect(() => {
    if (!target) return;
    const section = document.getElementById(target);
    section?.scrollIntoView({ block: "start" });
    section?.querySelector("h2")?.focus({ preventScroll: true });
  }, [hash, target]);

  return (
    <div className="grid min-h-492 grid-cols-[278fr_660fr] items-start gap-28 max-nav:grid-cols-1 max-nav:gap-[28px]">
      <SideMenu.Root items={sections.map(({ id, nav }) => ({ id, label: nav }))}>
        <SideMenu.Header title={navLabel}>
          <SideMenu.Progress />
        </SideMenu.Header>
        <SideMenu.Body>
          <SideMenu.List label={navLabel} />
        </SideMenu.Body>
      </SideMenu.Root>

      <article className="grid min-w-0 gap-30 max-nav:gap-[28px] pb-4 text-u-[13.6] font-demibold leading-[1.4] max-poster:text-[17px] max-phone:text-[15px]">
        {sections.map(({ id, title, body, detail }) => (
          <section key={id} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[96px]">
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
