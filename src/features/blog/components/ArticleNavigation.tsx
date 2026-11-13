"use client";

import { useEffect, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import * as SideMenu from "@/components/side-menu/SideMenu";
import type { SideMenuItem } from "@/components/side-menu/SideMenu";
import { cn } from "@/lib/utils";
import { SocialIcon } from "./SocialIcons";

type Props = {
  items: SideMenuItem[];
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
  "relative grid size-[44px] flex-none place-items-center rounded-full ring-[3px] ring-white [box-shadow:0_4px_0_var(--color-blog-shadow)] transition-[background-color,transform,box-shadow] before:absolute before:top-[7px] before:left-[9px] before:h-[6px] before:w-[11px] before:-rotate-[30deg] before:rounded-full before:bg-white/40 hover:-translate-y-[3px] hover:-rotate-6 hover:[box-shadow:0_7px_0_var(--color-blog-shadow)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink max-poster:size-[38px]";

/** The article's side menu: the shared SideMenu (contents and progress) plus the share panel. */
export function ArticleNavigation({ items, url, title, labels }: Props) {
  return (
    <SideMenu.Root items={items}>
      <SideMenu.Header title={labels.heading}>
        <SideMenu.Progress />
      </SideMenu.Header>
      <SideMenu.Body>
        <SideMenu.List label={labels.heading} />
        <ArticleShare url={url} title={title} labels={labels} />
      </SideMenu.Body>
    </SideMenu.Root>
  );
}

/** Copy link and share actions, with visible copy feedback. */
function ArticleShare({ url, title, labels }: Omit<Props, "items">) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

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

  return (
    <div className="mt-[16px] rounded-[20px] bg-blog-lavender/45 px-[12px] pt-[13px] pb-[12px]">
      <div className="flex min-h-[22px] flex-wrap items-center justify-between gap-[8px] px-[4px]">
        <p className="text-[15px] font-max leading-none">{labels.share}</p>
        <p
          role="status"
          className={cn(
            "rounded-full px-[9px] py-[4px] text-[11px] font-heavy leading-none text-white transition-[opacity,transform] empty:scale-75 empty:opacity-0",
            copyStatus === "error" ? "bg-mochi-pink-ink" : "bg-share-whatsapp",
          )}
        >
          {copyStatus === "copied" ? labels.copied : copyStatus === "error" ? labels.error : ""}
        </p>
      </div>
      <div className="mt-[12px]">
        <div className="flex items-center justify-between gap-[6px] px-[4px] pb-[4px] max-nav:justify-start max-nav:gap-[12px]">
          <button
            type="button"
            onClick={copyLink}
            aria-label={labels.copy}
            title={labels.copy}
            className={cn(shareButton, "cursor-pointer", copyStatus === "copied" ? "bg-blog-mint text-share-whatsapp" : "bg-white text-blog-purple")}
          >
            {copyStatus === "copied" ? <Check className="relative size-[20px]" strokeWidth={3} aria-hidden="true" /> : <LinkIcon className="relative size-[20px]" aria-hidden="true" />}
          </button>
          {shareLinks.map(({ platform, label, href, tone }) => (
            <a key={platform} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={cn(shareButton, tone)}>
              <SocialIcon platform={platform} className="relative size-[20px]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
