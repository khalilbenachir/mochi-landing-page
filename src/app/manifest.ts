import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mochi – private period tracker for iPhone",
    short_name: "Mochi",
    description: "A free, private period tracker with reminders, moods, streaks and collectible Mochi flavors.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDE3EA",
    theme_color: "#F2577C",
    icons: [
      { src: "/mochi/app-icon.webp", sizes: "512x512", type: "image/webp", purpose: "any" },
    ],
  };
}
