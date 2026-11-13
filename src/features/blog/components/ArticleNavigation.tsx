"use client";

import { useEffect, useState } from "react";
import { Check, Heart, Link as LinkIcon } from "lucide-react";
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
  "grid aspect-square w-full max-w-[52px] min-w-0 place-items-center rounded-[14px] [box-shadow:0_2px_0_var(--color-blog-shadow)] transition-[background-color,transform,box-shadow] hover:-translate-y-[2px] hover:[box-shadow:0_6px_12px_var(--color-blog-shadow)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-mochi-pink-ink";

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
    <div className="mt-[16px] rounded-[18px] bg-blog-lavender/45 px-[14px] pb-[12px] pt-[12px]">
      <p className="flex items-center gap-[7px] text-[15px] font-max leading-none">
        <Heart className="size-[15px] fill-mochi-pink-ink text-mochi-pink-ink" aria-hidden="true" />
        {labels.share}
      </p>
      <div className="mt-[12px] grid grid-cols-4 gap-[8px] max-nav:flex max-nav:gap-[10px] max-nav:*:w-[48px]">
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
  );
}
