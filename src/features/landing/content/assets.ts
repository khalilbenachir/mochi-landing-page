import type { FlavorId } from "./product-catalog";

export const LANDING_ASSETS = {
  accountMochi: "/mochi/account-mochi.webp",
  appIcon: "/mochi/app-icon.webp",
  closingMochi: "/mochi/closing-mochi.webp",
  faqMochi: "/mochi/faq-mochi.webp",
  freeMochi: "/mochi/free-mochi.webp",
  faces: {
    happy: "/mochi/faces/happy.webp",
    headerHappy: "/mochi/faces/happy-header.webp",
  },
  heroMochi: "/mochi/hero-mochi.webp",
  heroArt: "/mochi/hero-dreamland.webp",
  islandMochi: "/mochi/island-mochi.webp",
  manifestIcon192: "/mochi/app-icon-192.png",
  manifestIcon512: "/mochi/app-icon-512.png",
  notFoundMascot: "/mochi/not-found-mascot.png",
  plusMochi: "/mochi/plus-mochi.webp",
  predictionMochi: "/mochi/prediction-mochi.webp",
  socialCard: "/mochi/social-card.png",
  whyMochi: "/mochi/why-mochi.webp",
} as const;

export const FLAVOR_CARD_ASSETS = {
  strawberry: "/mochi/flavor-cards/strawberry.webp",
  classic: "/mochi/flavor-cards/classic.webp",
  matcha: "/mochi/flavor-cards/matcha.webp",
  ube: "/mochi/flavor-cards/ube.webp",
  mango: "/mochi/flavor-cards/mango.webp",
  sesame: "/mochi/flavor-cards/sesame.webp",
  yuzu: "/mochi/flavor-cards/yuzu.webp",
  chocolate: "/mochi/flavor-cards/chocolate.webp",
  hojicha: "/mochi/flavor-cards/hojicha.webp",
  sakura: "/mochi/flavor-cards/sakura.webp",
  peach: "/mochi/flavor-cards/peach.webp",
  coconut: "/mochi/flavor-cards/coconut.webp",
} as const satisfies Record<FlavorId, string>;

export const MOOD_IDS = ["happy", "sleepy", "crampy", "cozy"] as const;
export type MoodAssetId = (typeof MOOD_IDS)[number];

export const MOOD_ASSETS = {
  happy: "/mochi/mood-happy.webp",
  sleepy: "/mochi/mood-sleepy.webp",
  crampy: "/mochi/mood-crampy.webp",
  cozy: "/mochi/mood-cozy.webp",
} as const satisfies Record<MoodAssetId, string>;

export const LANDING_ASSET_PATHS = [
  ...Object.values(LANDING_ASSETS).flatMap((value) =>
    typeof value === "string" ? [value] : Object.values(value),
  ),
  ...Object.values(FLAVOR_CARD_ASSETS),
  ...Object.values(MOOD_ASSETS),
] as const;
