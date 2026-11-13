/**
 * Decorative SVGs shared across sections. All are `aria-hidden` and colored through
 * `currentColor`, so callers set the color with a `text-*` class.
 */
import { cn } from "@/lib/utils";

type DecorProps = { className?: string };

const HEART_PATH =
  "M12 21.2C5.4 16.6 2 13 2 8.8 2 5.7 4.4 3.4 7.3 3.4c2 0 3.6 1 4.7 2.6 1.1-1.6 2.7-2.6 4.7-2.6 2.9 0 5.3 2.3 5.3 5.4 0 4.2-3.4 7.8-10 12.4Z";
const HEART_OUTLINE_PATH =
  "M12 20.2C5.9 16 3 12.6 3 8.9 3 6.2 5.1 4.2 7.6 4.2c1.8 0 3.3.9 4.4 2.4 1.1-1.5 2.6-2.4 4.4-2.4 2.5 0 4.6 2 4.6 4.7 0 3.7-2.9 7.1-9 11.3Z";

export function Sparkle({ className }: DecorProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path fill="currentColor" d="M20 0c1.6 10.2 9.8 18.4 20 20-10.2 1.6-18.4 9.8-20 20-1.6-10.2-9.8-18.4-20-20C10.2 18.4 18.4 10.2 20 0Z" />
    </svg>
  );
}

export function Petal({ className }: DecorProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 4.2 10.4 1.1C6 1.4 3.4 5.8 4 11.2 4.6 17 8.4 21.4 12 23c3.6-1.6 7.4-6 8-11.8.6-5.4-2-9.8-6.4-10.1Z" />
    </svg>
  );
}

/**
 * Every three-stroke sun-ray burst on the landing. Each band draws its own angle, but all
 * share the 40×40 box, so a burst is sized by its width alone.
 */
const RAY_SHAPES = {
  /** Hero, free sticker, 404. */
  hero: { strokeWidth: 5, paths: ["M25 4 21 15", "M36 13 27 19", "M4 22 16 24"] },
  /** Bursting up and left (comparison, plans). */
  burst: { strokeWidth: 4.5, paths: ["M24 4 28 15", "M8 13 18 20", "M5 30 17 29"] },
  island: { strokeWidth: 5, paths: ["M8 4 14 16", "M20 12 28 22", "M16 34 32 31"] },
  flavors: { strokeWidth: 4.5, paths: ["M27 4 23 14", "M37 9 29 17", "M5 18 19 21"] },
  faq: { strokeWidth: 4.5, paths: ["M10 4 7 15", "M24 8 15 19", "M33 22 20 26"] },
  privacy: { strokeWidth: 4.5, paths: ["M12 4 17 15", "M27 8 24 19", "M36 22 26 25"] },
  prediction: { strokeWidth: 4.5, paths: ["M26 4 23 15", "M37 13 28 20", "M5 27 19 28"] },
} as const;

export type RayShape = keyof typeof RAY_SHAPES;

/** A sun-ray burst; `flip` mirrors it horizontally. */
export function Rays({ shape, className, flip = false }: DecorProps & { shape: RayShape; flip?: boolean }) {
  const { strokeWidth, paths } = RAY_SHAPES[shape];
  return (
    <svg className={cn(className, flip && "-scale-x-100")} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={strokeWidth}>
        {paths.map((d) => <path key={d} d={d} />)}
      </g>
    </svg>
  );
}

export function Heart({ className }: DecorProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d={HEART_PATH} />
    </svg>
  );
}

/** The heart with a highlight, as Mochi hugs it on the privacy band. */
export function HuggedHeart({ className }: DecorProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path className="fill-brand-rose" d={HEART_PATH} />
      <path className="fill-privacy-hug-highlight" d="M6.5 6.4c1.2-.8 2.6-.4 3.1.4-.9.1-1.9.6-2.6 1.6-.5-.5-.8-1.3-.5-2Z" />
    </svg>
  );
}

export function HeartOutline({ className, strokeWidth }: DecorProps & { strokeWidth: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" d={HEART_OUTLINE_PATH} />
    </svg>
  );
}

/** Coral disc with a white tick, for feature lists. */
export function CheckBadge({ className }: DecorProps) {
  return (
    <svg className={cn("flex-none", className)} viewBox="0 0 24 24" aria-hidden="true">
      <circle className="fill-brand-coral" cx="12" cy="12" r="11" />
      <path className="stroke-white" d="M7 12.5l3.2 3.2L17 9" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** iOS signal, Wi-Fi and battery glyphs for the phone mock-ups' status bars. */
export function StatusIcons({ className }: DecorProps) {
  return (
    <svg className={className} viewBox="0 0 70 14" aria-hidden="true">
      <g fill="currentColor">
        <rect x="0" y="9" width="3" height="4" rx="1" /><rect x="5" y="6.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="4" width="3" height="9" rx="1" /><rect x="15" y="1.5" width="3" height="11.5" rx="1" />
        <path d="M31 13 28.2 10.1a4 4 0 0 1 5.6 0Z" />
        <path d="M24.6 6.6a9 9 0 0 1 12.8 0l-1.8 1.8a6.5 6.5 0 0 0-9.2 0Z" />
        <path d="M21.4 3.4a13.5 13.5 0 0 1 19.2 0l-1.6 1.6a11.2 11.2 0 0 0-16 0Z" />
        <rect x="47" y="2" width="19" height="10" rx="3" />
        <rect x="67.2" y="5" width="1.8" height="4" rx=".9" />
      </g>
    </svg>
  );
}
