"use client";

import { useEffect, useState } from "react";

const START = 2 * 3600 + 17 * 60 + 36; // 2:17:36, as in the maquette
const FORMAT = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** The island's pad change countdown. Server-renders 2:17:36, then ticks down once a second. */
export function IslandCountdown({ className }: { className?: string }) {
  const [left, setLeft] = useState(START);
  useEffect(() => {
    const id = window.setInterval(() => setLeft((s) => (s > 0 ? s - 1 : START)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={className} role="timer" aria-label="Pad change in 2 hours 17 minutes" suppressHydrationWarning>
      {FORMAT(left)}
    </span>
  );
}
