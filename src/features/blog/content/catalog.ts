import type { EditorialSourceId } from "@/lib/editorial-sources";
import { blogPath, EDITORIAL_SLUG, FALLBACK_BLOG_LOCALE, TOPICS_SEGMENT } from "../locales";

export type BlogPostId =
  | "tracking"
  | "privacy"
  | "methods"
  | "pads"
  | "phases"
  | "predictions"
  | "cramps"
  | "moods"
  | "gettingStarted"
  | "floAlternatives"
  | "bloodLoss"
  | "appleWatch"
  | "latePeriod"
  | "tampons"
  | "cups";
export type BlogCategory = "cycle-basics" | "period-care" | "symptoms-moods" | "privacy" | "using-mochi";

export const BLOG_CATEGORIES: readonly BlogCategory[] = ["cycle-basics", "period-care", "symptoms-moods", "privacy", "using-mochi"];

export type BlogSection = { id: string; sources?: readonly EditorialSourceId[] };

export type BlogPost = {
  id: BlogPostId;
  category: BlogCategory;
  slug: string;
  /** 1200×800 WebP under `public/blog-art`, used by the hero, cards, CTA and JSON-LD. */
  image: string;
  /** Background utility behind the artwork. */
  tone: string;
  /** Deliberate release date (YYYY-MM-DD), never derived from the build clock. */
  publishedAt: string;
  /** Last substantive revision (YYYY-MM-DD); drives the visible date, dateModified and sitemap lastmod. */
  updatedAt?: string;
  /** Leads the index while no category filter is active. Defaults to the newest post. */
  featured?: boolean;
  sections: readonly BlogSection[];
};

/** Catalog order breaks ties between posts released on the same day. */
const CATALOG: readonly BlogPost[] = [
  {
    id: "cups",
    category: "period-care",
    slug: "how-long-can-you-leave-a-menstrual-cup-in",
    image: "/blog-art/cup-care-mochi.webp",
    tone: "bg-blog-lavender",
    publishedAt: "2026-11-25",
    sections: [
      { id: "how-long", sources: ["menstrualCups", "cupGuide"] },
      { id: "overnight", sources: ["menstrualCups", "cupGuide"] },
      { id: "is-it-full", sources: ["cupGuide", "heavyPeriods"] },
      { id: "left-in-too-long", sources: ["cupReview", "toxicShock"] },
      { id: "cup-or-tampon", sources: ["cupReview", "tamponSafety", "cupGuide"] },
      { id: "cleaning", sources: ["menstrualCups", "cupGuide"] },
      { id: "who-should-check", sources: ["menstrualCups", "cupGuide"] },
      { id: "change-reminder", sources: ["mochiFeatures", "toxicShock"] },
    ],
  },
  {
    id: "tampons",
    category: "period-care",
    slug: "how-long-can-you-leave-a-tampon-in",
    image: "/blog-art/tampon-care-mochi.webp",
    tone: "bg-blog-mint",
    publishedAt: "2026-11-25",
    sections: [
      { id: "how-long", sources: ["tamponSafety", "tamponTooLong"] },
      { id: "overnight", sources: ["tamponSafety", "tamponsCanada"] },
      { id: "heavy-and-light-flow", sources: ["tamponSafety", "tamponTooLong"] },
      { id: "swimming-and-peeing", sources: ["tamponSafety"] },
      { id: "toxic-shock-syndrome", sources: ["toxicShock", "tamponSafety"] },
      { id: "left-in-too-long", sources: ["toxicShock", "tamponSafety"] },
      { id: "tampon-or-pad", sources: ["tamponsCanada"] },
      { id: "change-reminder", sources: ["mochiFeatures", "toxicShock"] },
    ],
  },
  {
    id: "latePeriod",
    category: "symptoms-moods",
    slug: "late-period-not-pregnant",
    image: "/blog-art/late-period-mochi.webp",
    tone: "bg-blog-lavender",
    publishedAt: "2026-11-24",
    sections: [
      { id: "how-late", sources: ["irregularPeriods", "cyclePhases"] },
      { id: "pregnancy-first", sources: ["pregnancyTests"] },
      { id: "common-reasons", sources: ["missedPeriods"] },
      { id: "stress-and-lifestyle", sources: ["missedPeriods", "cyclePhases"] },
      { id: "contraception-and-breastfeeding", sources: ["missedPeriods", "pregnancyTests"] },
      { id: "health-conditions", sources: ["missedPeriods", "irregularPeriods"] },
      { id: "when-to-see-a-gp", sources: ["missedPeriods", "irregularPeriods", "pregnancyTests"] },
      { id: "track-your-cycle", sources: ["mochiFeatures", "mochiTerms"] },
    ],
  },
  {
    id: "appleWatch",
    category: "cycle-basics",
    slug: "apple-watch-period-prediction",
    // Reuses the predictions artwork (calendar scene) until a dedicated illustration is drawn.
    image: "/blog-art/period-predictions-mochi.webp",
    tone: "bg-blog-mint",
    publishedAt: "2026-11-24",
    sections: [
      { id: "does-it-predict", sources: ["appleCycle"] },
      { id: "how-predictions-work", sources: ["appleCycle"] },
      { id: "fertile-window", sources: ["appleCycle"] },
      { id: "wrist-temperature", sources: ["appleCycle"] },
      { id: "notifications", sources: ["appleCycle"] },
      { id: "privacy", sources: ["appleCycle"] },
      { id: "limits", sources: ["appleCycle"] },
      { id: "with-mochi", sources: ["mochiFeatures", "mochiPrivacy"] },
    ],
  },
  {
    id: "bloodLoss",
    category: "period-care",
    slug: "how-much-blood-do-you-lose-during-period",
    image: "/blog-art/period-blood-loss-mochi-v3.webp",
    tone: "bg-blog-pink",
    publishedAt: "2026-11-20",
    sections: [
      { id: "menstrual-fluid", sources: ["menstrualComposition", "menstrualBloodLoss"] },
      { id: "teaspoons", sources: ["menstrualBloodLoss"] },
      { id: "daily-loss", sources: ["periodOverview"] },
      { id: "period-length", sources: ["periodOverview"] },
      { id: "year-and-lifetime", sources: ["menstrualCycle", "abnormalUterineBleeding"] },
      { id: "heavy-flow", sources: ["heavyFlowVolume", "heavyBleedingGuidance"] },
      { id: "warning-signs", sources: ["heavyPeriods", "heavyMenstrualBleeding", "abnormalUterineBleeding"] },
      { id: "losing-200-ml", sources: ["menstrualBloodLoss", "abnormalUterineBleeding"] },
      { id: "brown-blood", sources: ["periodBlood", "fertilityCycleDay"] },
      { id: "track-your-flow", sources: ["mochiFeatures", "heavyPeriods"] },
    ],
  },
  {
    id: "floAlternatives",
    category: "privacy",
    slug: "flo-alternatives-private-period-tracking-apps",
    image: "/blog-art/flo-alternatives-mochi.webp",
    tone: "bg-blog-lavender",
    publishedAt: "2026-11-16",
    sections: [
      { id: "choose-your-tracker" },
      { id: "is-flo-free", sources: ["floFree", "floAnonymous"] },
      { id: "flo-privacy-history", sources: ["floFtc", "floAnonymous"] },
      { id: "compare-alternatives", sources: ["mochiPrivacy", "eukiPrivacy", "clueAccount", "dripApp", "appleCycle"] },
      { id: "mochi", sources: ["mochiFeatures", "mochiPrivacy"] },
      { id: "euki", sources: ["eukiApp", "eukiPrivacy", "eukiFeatures"] },
      { id: "clue", sources: ["clueAccount", "cluePrivacy", "clueFree"] },
      { id: "drip", sources: ["dripApp", "dripIos", "dripAndroid"] },
      { id: "apple-health", sources: ["appleCycle"] },
      { id: "clue-vs-flo", sources: ["floFree", "floAnonymous", "clueAccount", "clueFree"] },
      { id: "switch-from-flo", sources: ["floExport", "floDelete", "mochiTerms"] },
    ],
  },
  {
    id: "pads",
    category: "period-care",
    slug: "how-often-to-change-your-pad",
    image: "/blog-art/pad-care-mochi.webp",
    tone: "bg-prediction-band",
    publishedAt: "2026-11-10",
    updatedAt: "2026-11-24",
    featured: true,
    sections: [
      { id: "how-often", sources: ["firstPeriod", "menstrualHygiene"] },
      { id: "heavy-flow", sources: ["heavyPeriods", "periodProblems"] },
      { id: "pads-per-day", sources: ["firstPeriod", "menstrualHygiene"] },
      { id: "overnight", sources: ["firstPeriod", "heavyPeriods"] },
      { id: "full-pad-signs", sources: ["firstPeriod"] },
      { id: "liners", sources: ["menstrualHygiene"] },
      { id: "comfort-and-skin", sources: ["menstrualHygiene"] },
      { id: "mochi-reminder", sources: ["mochiTerms"] },
    ],
  },
  {
    id: "phases",
    category: "cycle-basics",
    slug: "four-phases-menstrual-cycle",
    image: "/blog-art/cycle-phases-mochi.webp",
    tone: "bg-comparison-matcha-bg",
    publishedAt: "2026-11-10",
    updatedAt: "2026-11-24",
    sections: [
      { id: "overview", sources: ["cyclePhases"] },
      { id: "menstruation", sources: ["cyclePhases", "cycleOverview"] },
      { id: "follicular-phase", sources: ["cyclePhases"] },
      { id: "ovulation", sources: ["cyclePhases", "menstrualCycle"] },
      { id: "luteal-phase", sources: ["cyclePhases", "pms"] },
      { id: "cycle-length", sources: ["cyclePhases", "menstrualCycle"] },
      { id: "your-own-pattern", sources: ["mochiTerms", "missedPeriods"] },
    ],
  },
  {
    id: "predictions",
    category: "cycle-basics",
    slug: "how-period-trackers-predict",
    image: "/blog-art/period-predictions-mochi.webp",
    tone: "bg-flavors-pill-starter",
    publishedAt: "2026-11-10",
    sections: [
      { id: "logged-dates", sources: ["irregularPeriods"] },
      { id: "calendar-example" },
      { id: "changing-estimates", sources: ["missedPeriods"] },
      { id: "prediction-limits", sources: ["mochiTerms", "pregnancyTests"] },
    ],
  },
  {
    id: "cramps",
    category: "symptoms-moods",
    slug: "period-cramps-what-helps",
    image: "/blog-art/period-cramps-mochi.webp",
    tone: "bg-blog-lavender",
    publishedAt: "2026-11-10",
    sections: [
      { id: "comfort", sources: ["periodPain"] },
      { id: "record-pain", sources: ["periodProblems"] },
      { id: "get-help", sources: ["periodPain", "periodProblems"] },
      { id: "tracking-limits", sources: ["mochiTerms"] },
    ],
  },
  {
    id: "moods",
    category: "symptoms-moods",
    slug: "mood-changes-during-your-cycle",
    image: "/blog-art/cycle-moods-mochi.webp",
    tone: "bg-prediction-band",
    publishedAt: "2026-11-10",
    updatedAt: "2026-11-24",
    sections: [
      { id: "mood-by-phase", sources: ["pms", "cyclePhases"] },
      { id: "period-mood", sources: ["pms"] },
      { id: "follicular-mood", sources: ["cyclePhases"] },
      { id: "ovulation-mood", sources: ["cyclePhases"] },
      { id: "luteal-mood", sources: ["pms", "cyclePhases"] },
      { id: "pmdd", sources: ["pms"] },
      { id: "what-helps", sources: ["pms"] },
      { id: "track-your-moods", sources: ["pms", "mochiTerms"] },
    ],
  },
  {
    id: "privacy",
    category: "privacy",
    slug: "private-period-app-iphone",
    image: "/blog-art/privacy-cutout-mochi.webp",
    tone: "bg-blog-pink",
    publishedAt: "2026-11-10",
    sections: [
      { id: "where-data-lives", sources: ["mochiPrivacy"] },
      { id: "read-privacy-labels", sources: ["appPrivacy"] },
      { id: "accounts-and-backup", sources: ["mochiPrivacy"] },
      { id: "screens-and-permissions" },
      { id: "a-checklist-to-keep" },
    ],
  },
  {
    id: "gettingStarted",
    category: "using-mochi",
    slug: "getting-started-with-mochi",
    image: "/blog-art/getting-started-mochi.webp",
    tone: "bg-terms-callout",
    publishedAt: "2026-11-10",
    sections: [
      { id: "first-entry" },
      { id: "mood-symptoms" },
      { id: "reminders", sources: ["menstrualHygiene", "mochiTerms"] },
      { id: "privacy-options", sources: ["mochiPrivacy", "mochiTerms"] },
    ],
  },
  {
    id: "tracking",
    category: "cycle-basics",
    slug: "how-to-track-your-period",
    image: "/blog-art/tracking-cutout-mochi.webp",
    tone: "bg-blog-mint",
    publishedAt: "2026-11-10",
    sections: [
      { id: "what-tracking-means", sources: ["menstrualCycle", "irregularPeriods"] },
      { id: "what-to-record", sources: ["periodProblems"] },
      { id: "a-simple-example" },
      { id: "when-to-start" },
      { id: "understanding-estimates", sources: ["mochiTerms"] },
      { id: "when-to-get-advice", sources: ["missedPeriods", "pregnancyTests", "mochiPrivacy"] },
    ],
  },
  {
    id: "methods",
    category: "cycle-basics",
    slug: "period-app-vs-calendar",
    image: "/blog-art/methods-cutout-mochi.webp",
    tone: "bg-blog-pink",
    publishedAt: "2026-11-10",
    sections: [
      { id: "paper-calendar" },
      { id: "phone-calendar" },
      { id: "period-app", sources: ["mochiPrivacy"] },
      { id: "compare-the-options" },
      { id: "try-a-small-routine" },
      { id: "know-the-limits", sources: ["mochiTerms", "periodProblems"] },
    ],
  },
];

/** Newest first; the index, JSON-LD, sitemap and related reading all use this order. */
export const BLOG_POSTS: readonly BlogPost[] = CATALOG.map((post, index) => ({ post, index }))
  .sort((a, b) => b.post.publishedAt.localeCompare(a.post.publishedAt) || a.index - b.index)
  .map(({ post }) => post);

export const FEATURED_POST: BlogPost | undefined = BLOG_POSTS.find((post) => post.featured) ?? BLOG_POSTS[0];

/** Path segments under `/blog` of every published page: the index, the editorial policy and each post. */
/** Categories that have at least one post; each gets a topic hub page. */
export const BLOG_TOPICS: readonly BlogCategory[] = BLOG_CATEGORIES.filter((category) => BLOG_POSTS.some((post) => post.category === category));

export function isBlogTopic(value: string): value is BlogCategory {
  return (BLOG_TOPICS as readonly string[]).includes(value);
}

/** A topic's posts, in catalog order. */
export function topicPosts(category: BlogCategory) {
  return BLOG_POSTS.filter((post) => post.category === category);
}

/** The newest update among a topic's posts. */
export function topicModifiedAt(category: BlogCategory) {
  return topicPosts(category).map(postModifiedAt).sort().at(-1)!;
}

export const BLOG_PAGE_SEGMENTS: readonly (readonly string[])[] = [
  [],
  [EDITORIAL_SLUG],
  ...BLOG_TOPICS.map((category) => [TOPICS_SEGMENT, category]),
  ...BLOG_POSTS.map((post) => [post.slug]),
];
/** Every published page in the fallback locale (the canonical English URLs). */
export const BLOG_PATHS = BLOG_PAGE_SEGMENTS.map((segments) => blogPath(FALLBACK_BLOG_LOCALE, ...segments));

export const BLOG_ART_SIZE = { width: 1200, height: 800 } as const;
export const JOURNAL_ART_SIZE = { width: 1200, height: 860 } as const;

/** The date search engines should treat as the latest revision. */
export function postModifiedAt(post: BlogPost) {
  return post.updatedAt ?? post.publishedAt;
}

export function findBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Same-category posts first, then the newest of the rest. */
export function relatedPosts(post: BlogPost, limit = 3) {
  const others = BLOG_POSTS.filter((candidate) => candidate.id !== post.id);
  return [...others.filter((candidate) => candidate.category === post.category), ...others.filter((candidate) => candidate.category !== post.category)].slice(
    0,
    limit,
  );
}
