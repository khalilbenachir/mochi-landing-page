"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Heart, Link as LinkIcon } from "lucide-react";
import { LANDING_ASSETS } from "@/features/landing/content/assets";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcons";

type Item = { id: string; label: string };
type Props = {
  items: Item[];
  url: string;
  title: string;
  labels: {
    heading: string;
    share: string;
    copy: string;
    copied: string;
    error: string;
    x: string;
    facebook: string;
    whatsApp: string;
  };
};

const shareButton =
  "grid aspect-square w-full min-w-0 place-items-center rounded-[14px] [box-shadow:0_2px_0_var(--color-blog-shadow)] transition-[background-color,transform,box-shadow] hover:-translate-y-[2px] hover:[box-shadow:0_6px_12px_var(--color-blog-shadow)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink max-nav:w-[48px]";

/** Sticky contents with scroll tracking, plus copy-link and share actions: the article's only client island. */
export function ArticleNavigation({ items, url, title, labels }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? "quick-answer");
  const [expanded, setExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const contentId = useId();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.filter((item) => item.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (entry) setActive(entry.target.id);
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    for (const { id } of items) {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    }
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = setTimeout(() => setCopyStatus("idle"), 3000);
    return () => clearTimeout(timeout);
  }, [copyStatus]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const shareLinks = [
    { platform: "x", label: labels.x, href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`, tone: "bg-share-x text-white" },
    { platform: "facebook", label: labels.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, tone: "bg-share-facebook text-white" },
    { platform: "whatsapp", label: labels.whatsApp, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, tone: "bg-share-whatsapp text-white" },
  ] as const;

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === active));

  return (
    <aside className="sticky top-[88px] self-start overflow-hidden rounded-[24px] border border-blog-border bg-white [box-shadow:0_6px_18px_var(--color-blog-shadow)] max-nav:static">
      <div className="bg-[linear-gradient(180deg,var(--color-blog-pink),transparent)] px-[18px] pb-[14px] pt-[16px] max-nav:p-[14px]">
        <div className="flex items-center gap-[10px] max-nav:hidden">
          <Image src={LANDING_ASSETS.faces.headerHappy} alt="" width={256} height={238} className="h-auto w-[34px] shrink-0 -rotate-6" />
          <h2 className="text-[19px] font-max leading-[1.15] tracking-[-0.02em]">{labels.heading}</h2>
        </div>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((value) => !value)}
          className="hidden min-h-[44px] w-full cursor-pointer items-center gap-[10px] rounded-[10px] text-left text-[18px] font-max focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink max-nav:flex"
        >
          <Image src={LANDING_ASSETS.faces.headerHappy} alt="" width={256} height={238} className="h-auto w-[30px] shrink-0 -rotate-6" />
          <span className="flex-1">{labels.heading}</span>
          <span className="text-[13px] font-heavy tabular-nums text-mochi-pink-ink" aria-hidden="true">{activeIndex + 1}/{items.length}</span>
          <ChevronDown aria-hidden="true" className={cn("size-[20px] transition-[rotate]", expanded && "rotate-180")} />
        </button>
        <div className="mt-[12px] flex items-center gap-[10px]" aria-hidden="true">
          <div className="flex flex-1 gap-[3px]">
            {items.map(({ id }, index) => (
              <span key={id} className={cn("h-[6px] flex-1 rounded-full transition-colors duration-500", index <= activeIndex ? "bg-mochi-pink-ink" : "bg-white")} />
            ))}
          </div>
          <span className="text-[12px] font-heavy tabular-nums text-mochi-pink-ink max-nav:hidden">{activeIndex + 1} / {items.length}</span>
        </div>
      </div>
      <div id={contentId} className={cn("px-[18px] pb-[18px] max-nav:px-[14px] max-nav:pb-[14px]", !expanded && "max-nav:hidden")}>
        <nav aria-label={labels.heading} className="mt-[4px]">
          <ol className="relative m-0 grid list-none gap-[2px] p-0 before:absolute before:bottom-[22px] before:left-[13px] before:top-[22px] before:w-[2px] before:rounded-full before:bg-blog-border">
            {items.map(({ id, label }, index) => {
              const state = index < activeIndex ? "read" : index === activeIndex ? "current" : "next";
              return (
                <li key={id} className="relative min-w-0">
                  <a
                    href={`#${id}`}
                    onClick={() => setActive(id)}
                    aria-current={state === "current" ? "location" : undefined}
                    className={cn(
                      "group flex min-h-[44px] items-center gap-[12px] rounded-[12px] py-[8px] pl-0 pr-[10px] text-[15px] font-heavy leading-[1.25] transition-colors hover:bg-landing-canvas focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mochi-pink-ink",
                      state === "current" && "bg-blog-pink text-mochi-pink-ink hover:bg-blog-pink",
                      state === "read" && "text-ink-navy/70",
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-1 grid size-[28px] shrink-0 place-items-center rounded-full border-2 text-[11px] font-max tabular-nums transition-colors",
                        state === "current" && "border-mochi-pink-ink bg-mochi-pink-ink text-white [box-shadow:0_0_0_4px_var(--color-blog-pink)]",
                        state === "read" && "border-mochi-pink-ink bg-blog-pink text-mochi-pink-ink",
                        state === "next" && "border-blog-border bg-white text-ink-navy/60 group-hover:border-mochi-pink-ink",
                      )}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">{label}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="mt-[16px] rounded-[18px] bg-blog-lavender/45 px-[14px] pb-[12px] pt-[12px]">
          <p className="flex items-center gap-[7px] text-[15px] font-max leading-none">
            <Heart className="size-[15px] fill-mochi-pink-ink text-mochi-pink-ink" aria-hidden="true" />
            {labels.share}
          </p>
          <div className="mt-[12px] grid grid-cols-4 gap-[7px] max-nav:flex max-nav:gap-[10px]">
            <button
              type="button"
              onClick={copyLink}
              aria-label={labels.copy}
              title={labels.copy}
              className={cn(shareButton, "cursor-pointer", copyStatus === "copied" ? "bg-blog-mint text-share-whatsapp" : "bg-white text-blog-purple")}
            >
              {copyStatus === "copied" ? <Check className="size-[20px]" strokeWidth={3} aria-hidden="true" /> : <LinkIcon className="size-[19px]" aria-hidden="true" />}
            </button>
            {shareLinks.map(({ platform, label, href, tone }) => (
              <a key={platform} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cn(shareButton, tone)}>
                <SocialIcon platform={platform} className="size-[19px]" />
              </a>
            ))}
          </div>
          <p role="status" className={cn("mt-[8px] min-h-[16px] text-[12px] font-heavy leading-[1.35]", copyStatus === "error" ? "text-mochi-pink-ink" : "text-share-whatsapp")}>
            {copyStatus === "copied" ? labels.copied : copyStatus === "error" ? labels.error : ""}
          </p>
        </div>
      </div>
    </aside>
  );
}
