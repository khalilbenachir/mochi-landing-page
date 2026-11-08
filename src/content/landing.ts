import type { IconName } from "@/components/ui/Icon";

export const SITE_NAME = "Mochi";
export const SITE_TITLE = "Mochi – private period tracker for iPhone";
export const SITE_DESCRIPTION =
  "Mochi is a free, private period tracker for iPhone with cycle predictions, an optional pad change reminder, mood logging, streaks and 12 collectible Mochi flavors.";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/**
 * Set NEXT_PUBLIC_SITE_URL in production so canonical URLs and the sitemap use the public domain.
 * Local builds intentionally fall back to localhost rather than publishing a made-up domain.
 */
export const PUBLIC_SITE_URL = configuredSiteUrl
  ? configuredSiteUrl.replace(/\/$/, "")
  : undefined;
export const SITE_URL = PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface ComparisonRow {
  feature: string;
  mochi: string;
  typical: string;
}

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  { feature: "Account required", mochi: "No", typical: "Often" },
  { feature: "Works offline", mochi: "Yes", typical: "Varies" },
  { feature: "Pad reminder on Lock Screen", mochi: "Yes", typical: "Rare" },
  { feature: "Cycle data sent to analytics", mochi: "Never", typical: "Varies" },
  { feature: "Rewards for logging", mochi: "Streaks + 12 flavors", typical: "Rare" },
];

export interface PlanFeature {
  icon: IconName;
  label: string;
}

export const FREE_FEATURES: readonly PlanFeature[] = [
  { icon: "calendar", label: "Cycle tracking and predictions" },
  { icon: "timer", label: "Pad change reminder" },
  { icon: "sparkle", label: "Moods, streaks and flavors" },
  { icon: "wifiOff", label: "Works offline, no account" },
];

export const PLUS_FEATURES: readonly PlanFeature[] = [
  { icon: "check", label: "Everything in Free" },
  { icon: "sparkle", label: "All three starter Mochi plus extra flavors" },
  { icon: "chart", label: "Insights into your cycle" },
];

/** Mochi Plus price as shown on the plan card, e.g. "€2.99/month". Leave null until it's final. */
export const PLUS_PRICE: string | null = null;

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: readonly FaqItem[] = [
  {
    question: "What is Mochi?",
    answer:
      "Mochi is a period tracker app for iPhone with a cute mascot. It predicts your next period, reminds you when to change your pad and rewards daily check-ins with 12 collectible flavors.",
  },
  {
    question: "Is Mochi free?",
    answer:
      "Yes. Cycle tracking, predictions, the pad change reminder, moods, streaks and starter flavors are free. Mochi Plus is optional.",
  },
  {
    question: "Is my period data private?",
    answer:
      "Yes. Period dates, flow, symptoms and moods stay on your iPhone and are never sent to analytics, logs or crash reports.",
  },
  {
    question: "Does Mochi work without an account or internet?",
    answer:
      "Yes. Every core feature works offline and no account is required. An account is optional if you want backup and sync.",
  },
  {
    question: "How does the pad change reminder work?",
    answer:
      "Choose a day pad, overnight pad or liner and a duration from 2 to 8 hours. Mochi counts down on Home, in the Dynamic Island and on the Lock Screen.",
  },
  {
    question: "Will my Lock Screen show that I'm on my period?",
    answer:
      "No. The Live Activity uses private, discreet wording and never states that you are on your period.",
  },
  {
    question: "Can I use Mochi as birth control?",
    answer:
      "No. Mochi's predictions are estimates for period awareness, not contraception, diagnosis or medical advice.",
  },
];

