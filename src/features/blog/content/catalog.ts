import type { EditorialSourceId } from "@/lib/editorial-sources";
import { blogPath, EDITORIAL_SLUG, FALLBACK_BLOG_LOCALE } from "../locales";

export type BlogPostId = "tracking" | "privacy" | "methods" | "pads" | "phases" | "predictions" | "cramps" | "moods" | "gettingStarted";
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
  /** Leads the index while no category filter is active. Defaults to the newest post. */
  featured?: boolean;
  sections: readonly BlogSection[];
};

/** Catalog order breaks ties between posts released on the same day. */
const CATALOG: readonly BlogPost[] = [
  {
    id: "pads",
    category: "period-care",
    slug: "how-often-to-change-your-pad",
    image: "/blog-art/pad-care.webp",
    tone: "bg-prediction-band",
    publishedAt: "2026-11-10",
    featured: true,
    sections: [
      { id: "day-pads", sources: ["menstrualHygiene", "firstPeriod"] },
      { id: "overnight-pads", sources: ["menstrualHygiene", "periodProblems"] },
      { id: "liners", sources: ["firstPeriod"] },
      { id: "signs-to-change", sources: ["menstrualHygiene"] },
      { id: "mochi-reminder", sources: ["mochiTerms"] },
    ],
  },
  {
    id: "phases",
    category: "cycle-basics",
    slug: "four-phases-menstrual-cycle",
    image: "/blog-art/cycle-phases.webp",
    tone: "bg-comparison-matcha-bg",
    publishedAt: "2026-11-10",
    sections: [
      { id: "menstruation", sources: ["cycleOverview"] },
      { id: "follicular-phase", sources: ["cyclePhases", "cycleOverview"] },
      { id: "ovulation", sources: ["cycleOverview"] },
      { id: "luteal-phase", sources: ["cycleOverview", "pms"] },
      { id: "your-own-pattern", sources: ["mochiTerms", "missedPeriods"] },
    ],
  },
  {
    id: "predictions",
    category: "cycle-basics",
    slug: "how-period-trackers-predict",
    image: "/blog-art/period-predictions.webp",
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
    image: "/blog-art/period-cramps.webp",
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
    image: "/blog-art/cycle-moods.webp",
    tone: "bg-prediction-band",
    publishedAt: "2026-11-10",
    sections: [
      { id: "premenstrual-changes", sources: ["pms"] },
      { id: "useful-notes", sources: ["pms"] },
      { id: "avoid-rules" },
      { id: "support", sources: ["pms"] },
    ],
  },
  {
    id: "privacy",
    category: "privacy",
    slug: "private-period-app-iphone",
    image: "/blog-art/privacy-cutout.webp",
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
    image: "/blog-art/getting-started.webp",
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
    image: "/blog-art/tracking-cutout.webp",
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
    image: "/blog-art/methods-cutout.webp",
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
export const BLOG_PAGE_SEGMENTS: readonly (readonly string[])[] = [[], [EDITORIAL_SLUG], ...BLOG_POSTS.map((post) => [post.slug])];
/** Every published page in the fallback locale (the canonical English URLs). */
export const BLOG_PATHS = BLOG_PAGE_SEGMENTS.map((segments) => blogPath(FALLBACK_BLOG_LOCALE, ...segments));

export const BLOG_ART_SIZE = { width: 1200, height: 800 } as const;
export const JOURNAL_ART_SIZE = { width: 1200, height: 875 } as const;

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
