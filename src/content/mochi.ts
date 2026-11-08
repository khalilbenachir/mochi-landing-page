/**
 * Copy and data shown on the page. Every line here comes from the iOS app (its String Catalogs and
 * MochiCore rules), so the site never promises something the app doesn't do.
 */

export const asset = {
  appIcon: "/mochi/app-icon.webp",
  face: {
    happy: "/mochi/faces/happy.webp",
    thinking: "/mochi/faces/thinking.webp",
    wondering: "/mochi/faces/wondering.webp",
    privacy: "/mochi/faces/privacy.webp",
  },
  clip: (name: string) => `/mochi/clips/${name}.mp4`,
  clipFallback: (name: string) => `/mochi/clips/${name}.h264.mp4`,
  clipPoster: (name: string) => `/mochi/clips/${name}.jpg`,
  flavor: (id: FlavorId) => `/mochi/flavors/${id}.webp`,
  liveActivity: {
    calm: "/mochi/live-activity/calm.png",
    soon: "/mochi/live-activity/thinking.png",
    due: "/mochi/live-activity/worried.png",
    happy: "/mochi/live-activity/happy.png",
  },
} as const;

export type FlavorId =
  | "strawberry"
  | "classic"
  | "matcha"
  | "ube"
  | "mango"
  | "sesame"
  | "peach"
  | "coconut"
  | "yuzu"
  | "chocolate"
  | "sakura"
  | "hojicha";

export type UnlockKind = "starter" | "streak" | "petals" | "challenge";

export interface Flavor {
  id: FlavorId;
  name: string;
  unlock: string;
  kind: UnlockKind;
}

/** `Flavor.unlock` in MochiCore. */
export const FLAVORS: readonly Flavor[] = [
  { id: "strawberry", name: "Strawberry", unlock: "Starter", kind: "starter" },
  { id: "classic", name: "Classic", unlock: "Starter", kind: "starter" },
  { id: "matcha", name: "Matcha", unlock: "Starter", kind: "starter" },
  { id: "ube", name: "Ube", unlock: "7-day streak", kind: "streak" },
  { id: "mango", name: "Mango", unlock: "14-day streak", kind: "streak" },
  { id: "sesame", name: "Sesame", unlock: "30-day streak", kind: "streak" },
  { id: "yuzu", name: "Yuzu", unlock: "60-day streak", kind: "streak" },
  { id: "chocolate", name: "Chocolate", unlock: "90-day streak", kind: "streak" },
  { id: "hojicha", name: "Hojicha", unlock: "180-day streak", kind: "streak" },
  { id: "sakura", name: "Sakura", unlock: "150 petals", kind: "petals" },
  { id: "peach", name: "Peach", unlock: "Cramp care challenge", kind: "challenge" },
  { id: "coconut", name: "Coconut", unlock: "Calm week challenge", kind: "challenge" },
];

export const MARQUEE_FLAVORS: readonly { id: FlavorId; name: string; color: string }[] = [
  { id: "strawberry", name: "Strawberry", color: "var(--pink)" },
  { id: "matcha", name: "Matcha", color: "var(--mint-ink)" },
  { id: "ube", name: "Ube", color: "var(--indigo)" },
  { id: "mango", name: "Mango", color: "var(--orange-ink)" },
  { id: "yuzu", name: "Yuzu", color: "var(--orange-ink)" },
  { id: "sakura", name: "Sakura", color: "var(--pink-ink)" },
];

export interface Mood {
  clip: string;
  name: string;
  line: string;
  tint: string;
}

/** `MochiDayCard.bubble` in TodayView: Mochi talks about what she logged. */
export const MOODS: readonly Mood[] = [
  { clip: "happy", name: "Happy", line: "You feel good? Me too!", tint: "var(--pink-tint)" },
  { clip: "cozy", name: "Cozy", line: "Calm and cozy. Let's stay like this.", tint: "var(--orange-tint)" },
  { clip: "sleepy", name: "Sleepy", line: "So sleepy… let's take it slow today.", tint: "var(--indigo-tint)" },
  { clip: "crampy", name: "Crampy", line: "Ouch, crampy day. I'm curled up right here with you.", tint: "var(--teal-tint)" },
  { clip: "sensitive", name: "Sensitive", line: "Big feelings today. Sending you a hug.", tint: "var(--mint)" },
  { clip: "curious", name: "Curious", line: "How are you today? Tap me and tell me.", tint: "var(--grey-150)" },
];

export const NAV_LINKS = [
  { href: "#change", label: "Pad change" },
  { href: "#island", label: "Dynamic Island" },
  { href: "#lock", label: "Lock Screen" },
  { href: "#flavors", label: "Flavors" },
  { href: "#privacy", label: "Privacy" },
] as const;

/** Replace with the real App Store link once the app is live. */
export const APP_STORE_URL = "#get";
