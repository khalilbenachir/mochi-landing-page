import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** `12`, `6.5` or `[13.6]`: the value part of the poster-unit utilities in globals.css. */
const isPosterUnit = (value: string) => /^(\d+(\.\d+)?|\[\d+(\.\d+)?\])$/.test(value);

/**
 * Teach tailwind-merge the project's custom utilities, so `text-u-12` resolves as a font size
 * (not a text color that would knock out `text-white`) and the extra weights conflict as weights.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: { "font-weight": ["demibold", "heavy", "ultra", "max"] },
    classGroups: {
      "font-size": [{ "text-u": [isPosterUnit] }],
      rounded: [{ "rounded-u": [isPosterUnit] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
