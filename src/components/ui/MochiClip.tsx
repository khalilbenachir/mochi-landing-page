"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { asset } from "@/content/mochi";

interface MochiClipProps {
  name: string;
  label: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * One of the app's HEVC/H.264 Mochi loops. Like the app, clips only play while on screen,
 * and stay paused for people who asked for reduced motion.
 */
export function MochiClip({ name, label, className, style }: MochiClipProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      poster={asset.clipPoster(name)}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    >
      {/* The app's HEVC clip where supported (Safari, Chrome on Apple silicon), H.264 everywhere else. */}
      <source src={asset.clip(name)} type='video/mp4; codecs="hvc1"' />
      <source src={asset.clipFallback(name)} type="video/mp4" />
    </video>
  );
}
