"use client";

import { useEffect, useRef, useState } from "react";

const START = 2 * 3600 + 17 * 60 + 36; // 2:17:36, as in the maquette
const FORMAT = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * The island's pad change countdown. Server and client both render 2:17:36 first, then it ticks
 * down once a second while on screen; it holds still off screen and under reduced motion.
 * Decorative: the phone mock-up's `role="img"` label describes it.
 */
export function IslandCountdown({ className }: { className?: string }) {
  const [left, setLeft] = useState(START);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: number | undefined;

    const sync = () => {
      const run = visible && !reducedMotion.matches;
      if (run && timer === undefined) {
        timer = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : START)), 1000);
      } else if (!run && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    observer.observe(element);
    reducedMotion.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, []);

  return <span ref={ref} className={className}>{FORMAT(left)}</span>;
}
