"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, Link as LinkIcon } from "lucide-react";
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
  "grid size-[44px] shrink-0 place-items-center rounded-full transition-[background-color,transform] hover:-translate-y-[2px] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink";

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
    { platform: "x", label: labels.x, href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`, tone: "bg-landing-canvas text-ink-navy" },
    { platform: "facebook", label: labels.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, tone: "bg-share-facebook text-white" },
    { platform: "whatsapp", label: labels.whatsApp, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, tone: "bg-blog-mint text-share-whatsapp" },
  ] as const;

  return (
    <aside className="sticky top-[24px] self-start rounded-[22px] border border-blog-border bg-white p-[18px] [box-shadow:0_3px_10px_var(--color-blog-shadow)] max-nav:static max-nav:p-[14px]">
      <h2 className="mb-[16px] text-[26px] font-max leading-[1.1] tracking-[-0.025em] max-nav:hidden">{labels.heading}</h2>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((value) => !value)}
        className="hidden min-h-[44px] w-full cursor-pointer items-center justify-between gap-[16px] rounded-[8px] text-left text-[20px] font-heavy focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink max-nav:flex"
      >
        {labels.heading}
        <ChevronDown aria-hidden="true" className={cn("size-[20px] transition-[rotate]", expanded && "rotate-180")} />
      </button>
      <div id={contentId} className={cn(!expanded && "max-nav:hidden")}>
        <nav aria-label={labels.heading} className="max-nav:mt-[14px]">
          <ol className="m-0 grid list-none gap-[6px] p-0">
            {items.map(({ id, label }) => (
              <li key={id} className="min-w-0">
                <a
                  href={`#${id}`}
                  onClick={() => setActive(id)}
                  aria-current={active === id ? "location" : undefined}
                  className="flex min-h-[48px] items-center gap-[12px] rounded-[12px] px-[12px] py-[12px] text-[16px] font-heavy leading-[1.25] transition-colors hover:bg-landing-canvas aria-[current=location]:bg-blog-pink aria-[current=location]:text-mochi-pink-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mochi-pink-ink"
                >
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-[22px] border-t border-blog-border pt-[16px]">
          <p className="text-[15px] font-heavy">{labels.share}</p>
          <div className="mt-[12px] flex flex-wrap gap-[10px]">
            <button type="button" onClick={copyLink} aria-label={labels.copy} className={cn(shareButton, "cursor-pointer bg-blog-lavender text-blog-purple")}>
              <LinkIcon className="size-[21px]" aria-hidden="true" />
            </button>
            {shareLinks.map(({ platform, label, href, tone }) => (
              <a key={platform} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cn(shareButton, tone)}>
                <SocialIcon platform={platform} className="size-[22px]" />
              </a>
            ))}
          </div>
          <p role="status" className="mt-[8px] text-[12px] font-semibold leading-[1.4]">
            {copyStatus === "copied" ? labels.copied : copyStatus === "error" ? labels.error : ""}
          </p>
        </div>
      </div>
    </aside>
  );
}
