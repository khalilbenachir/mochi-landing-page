/**
 * Browser and OS metadata cannot resolve CSS variables, so these are the only color
 * literals allowed outside src/app/globals.css. Each value must equal the named
 * globals.css variable; platform-colors.test.ts enforces it.
 */
export const PLATFORM_COLORS = {
  /** <meta name="theme-color">; equals `--accent` (Tailwind `accent`). */
  browserTheme: { value: "#FDE3EA", cssVariable: "--accent" },
  /** Web manifest background_color; equals `--accent`. */
  manifestBackground: { value: "#FDE3EA", cssVariable: "--accent" },
  /** Web manifest theme_color; equals `--pink` (Tailwind `mochi-pink`). */
  manifestTheme: { value: "#F2577C", cssVariable: "--pink" },
  /** Generated blog social cards (next/og cannot read CSS variables). */
  socialCardBackground: { value: "#F44C80", cssVariable: "--color-hero-band" },
  socialCardInk: { value: "#172A4F", cssVariable: "--color-ink-navy" },
  socialCardAccent: { value: "#FFD93D", cssVariable: "--color-sun" },
} as const;
