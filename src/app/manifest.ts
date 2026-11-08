import type { MetadataRoute } from "next";
import { PLATFORM_COLORS } from "@/app/platform-colors";
import { LANDING_ASSETS } from "@/features/landing/content/assets";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mochi – private period tracker for iPhone",
    short_name: "Mochi",
    description: "A free, private period tracker with reminders, moods, streaks and collectible Mochi flavors.",
    start_url: "/",
    display: "standalone",
    background_color: PLATFORM_COLORS.manifestBackground.value,
    theme_color: PLATFORM_COLORS.manifestTheme.value,
    icons: [
      { src: LANDING_ASSETS.appIcon, sizes: "512x512", type: "image/webp", purpose: "any" },
    ],
  };
}
