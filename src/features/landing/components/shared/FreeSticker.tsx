import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Rays } from "./decor";

type FreeStickerProps = {
  /** Sizing and placement of the sticker box. */
  className?: string;
  /** Extra classes for the yellow blob (e.g. its drop shadow). */
  blobClassName?: string;
  /** The little sun rays off the blob's right edge. */
  rays?: boolean;
};

/** The yellow "FREE" blob next to the App Store badges (hero, closing band). */
export function FreeSticker({ className, blobClassName, rays = true }: FreeStickerProps) {
  const t = useTranslations("Common");
  const label = t("free").toUpperCase();
  // The blob fits about 64 units of text: scale the size down with the word length
  // (FREE 24, GRATIS 19, GRATUIT 16) and pin longer words to that run so no locale spills out.
  const long = label.length > 5;
  const fontSize = Math.max(13, Math.min(24, Math.round(112 / label.length)));

  return (
    <span className={cn("relative block", className)} role="img" aria-label={t("free")}>
      <svg className={cn("block h-auto w-full", blobClassName)} viewBox="0 0 100 64" aria-hidden="true">
        <path className="fill-sun" d="M14 12c6-6 14-3 19-7 6-4 13-5 19-1 6-3 14-2 19 2 7 0 13 4 15 10 6 4 8 11 5 17 2 7-1 13-7 16-3 6-10 9-17 8-6 4-14 4-20 1-7 2-14 0-18-5-7-1-12-6-12-13-5-5-5-12 0-17-1-5 2-9 7-11Z" />
        <text className="fill-ink-black" x="50" y={Math.round(33 + fontSize * 0.35)} textAnchor="middle" fontSize={fontSize} fontWeight="1000" fontFamily="inherit" transform="rotate(-9 50 34)" textLength={long ? 64 : undefined} lengthAdjust={long ? "spacingAndGlyphs" : undefined}>{label}</text>
      </svg>
      {/* scaleX(-1) rotate(10deg) as individual properties: rotate applies before scale, so the angle flips. */}
      {rays && <Rays shape="hero" flip className="absolute -right-20 top-4 w-22 text-sun -rotate-10" />}
    </span>
  );
}
