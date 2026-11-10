import type { BlogLocale } from "../locales";
import { BLOG_POSTS, type BlogPost, type BlogPostId } from "./catalog";
import enCramps from "./articles/en/cramps.json";
import enGettingStarted from "./articles/en/gettingStarted.json";
import enMethods from "./articles/en/methods.json";
import enMoods from "./articles/en/moods.json";
import enPads from "./articles/en/pads.json";
import enPhases from "./articles/en/phases.json";
import enPredictions from "./articles/en/predictions.json";
import enPrivacy from "./articles/en/privacy.json";
import enTracking from "./articles/en/tracking.json";
import frCramps from "./articles/fr/cramps.json";
import frGettingStarted from "./articles/fr/gettingStarted.json";
import frMethods from "./articles/fr/methods.json";
import frMoods from "./articles/fr/moods.json";
import frPads from "./articles/fr/pads.json";
import frPhases from "./articles/fr/phases.json";
import frPredictions from "./articles/fr/predictions.json";
import frPrivacy from "./articles/fr/privacy.json";
import frTracking from "./articles/fr/tracking.json";
import deCramps from "./articles/de/cramps.json";
import deGettingStarted from "./articles/de/gettingStarted.json";
import deMethods from "./articles/de/methods.json";
import deMoods from "./articles/de/moods.json";
import dePads from "./articles/de/pads.json";
import dePhases from "./articles/de/phases.json";
import dePredictions from "./articles/de/predictions.json";
import dePrivacy from "./articles/de/privacy.json";
import deTracking from "./articles/de/tracking.json";
import esCramps from "./articles/es/cramps.json";
import esGettingStarted from "./articles/es/gettingStarted.json";
import esMethods from "./articles/es/methods.json";
import esMoods from "./articles/es/moods.json";
import esPads from "./articles/es/pads.json";
import esPhases from "./articles/es/phases.json";
import esPredictions from "./articles/es/predictions.json";
import esPrivacy from "./articles/es/privacy.json";
import esTracking from "./articles/es/tracking.json";
import ptBRCramps from "./articles/pt-BR/cramps.json";
import ptBRGettingStarted from "./articles/pt-BR/gettingStarted.json";
import ptBRMethods from "./articles/pt-BR/methods.json";
import ptBRMoods from "./articles/pt-BR/moods.json";
import ptBRPads from "./articles/pt-BR/pads.json";
import ptBRPhases from "./articles/pt-BR/phases.json";
import ptBRPredictions from "./articles/pt-BR/predictions.json";
import ptBRPrivacy from "./articles/pt-BR/privacy.json";
import ptBRTracking from "./articles/pt-BR/tracking.json";
import ptPTCramps from "./articles/pt-PT/cramps.json";
import ptPTGettingStarted from "./articles/pt-PT/gettingStarted.json";
import ptPTMethods from "./articles/pt-PT/methods.json";
import ptPTMoods from "./articles/pt-PT/moods.json";
import ptPTPads from "./articles/pt-PT/pads.json";
import ptPTPhases from "./articles/pt-PT/phases.json";
import ptPTPredictions from "./articles/pt-PT/predictions.json";
import ptPTPrivacy from "./articles/pt-PT/privacy.json";
import ptPTTracking from "./articles/pt-PT/tracking.json";

export type ArticleTable = { caption: string; columns: string[]; rows: string[][] };

export type ArticleLink = { postId: BlogPostId; label: string };
export type ArticleParagraph = string | (string | ArticleLink)[];

export type ArticleSectionCopy = {
  title: string;
  paragraphs?: Record<string, ArticleParagraph>;
  items?: Record<string, string>;
  after?: string;
  note?: string;
  table?: ArticleTable;
};

export type ArticleCopy = {
  title: string;
  description: string;
  imageAlt: string;
  intro: string;
  faq: Record<string, { question: string; answer: string }>;
  sections: Record<string, ArticleSectionCopy>;
};

/**
 * Article prose, one JSON file per article and locale. Interface labels stay in the `Blog`
 * message namespace. Typing the map by `BlogLocale` makes a newly enabled locale fail the
 * type check until every article has a translation.
 */
// JSON imports widen string literals, so validate link IDs before exposing typed article copy.
type ArticleCopyInput = Omit<ArticleCopy, "sections"> & {
  sections: Record<
    string,
    Omit<ArticleSectionCopy, "paragraphs"> & {
      paragraphs?: Record<string, string | (string | { postId: string; label: string })[]>;
    }
  >;
};

const ARTICLE_INPUTS: Record<BlogLocale, Record<BlogPostId, ArticleCopyInput>> = {
  en: {
    cramps: enCramps,
    gettingStarted: enGettingStarted,
    methods: enMethods,
    moods: enMoods,
    pads: enPads,
    phases: enPhases,
    predictions: enPredictions,
    privacy: enPrivacy,
    tracking: enTracking,
  },
  fr: {
    cramps: frCramps,
    gettingStarted: frGettingStarted,
    methods: frMethods,
    moods: frMoods,
    pads: frPads,
    phases: frPhases,
    predictions: frPredictions,
    privacy: frPrivacy,
    tracking: frTracking,
  },
  de: {
    cramps: deCramps,
    gettingStarted: deGettingStarted,
    methods: deMethods,
    moods: deMoods,
    pads: dePads,
    phases: dePhases,
    predictions: dePredictions,
    privacy: dePrivacy,
    tracking: deTracking,
  },
  es: {
    cramps: esCramps,
    gettingStarted: esGettingStarted,
    methods: esMethods,
    moods: esMoods,
    pads: esPads,
    phases: esPhases,
    predictions: esPredictions,
    privacy: esPrivacy,
    tracking: esTracking,
  },
  "pt-BR": {
    cramps: ptBRCramps,
    gettingStarted: ptBRGettingStarted,
    methods: ptBRMethods,
    moods: ptBRMoods,
    pads: ptBRPads,
    phases: ptBRPhases,
    predictions: ptBRPredictions,
    privacy: ptBRPrivacy,
    tracking: ptBRTracking,
  },
  "pt-PT": {
    cramps: ptPTCramps,
    gettingStarted: ptPTGettingStarted,
    methods: ptPTMethods,
    moods: ptPTMoods,
    pads: ptPTPads,
    phases: ptPTPhases,
    predictions: ptPTPredictions,
    privacy: ptPTPrivacy,
    tracking: ptPTTracking,
  },
};

export function parseArticleParagraph(paragraph: string | (string | { postId: string; label: string })[]): ArticleParagraph {
  if (typeof paragraph === "string") return paragraph;
  return paragraph.map((part) => {
    if (typeof part === "string") return part;
    const post = BLOG_POSTS.find(({ id }) => id === part.postId);
    if (!post) throw new Error(`Unknown article link target: ${part.postId}`);
    if (!part.label.trim()) throw new Error(`Missing article link label: ${part.postId}`);
    return { postId: post.id, label: part.label };
  });
}

export function articleParagraphText(paragraph: ArticleParagraph): string {
  return typeof paragraph === "string" ? paragraph : paragraph.map((part) => (typeof part === "string" ? part : part.label)).join("");
}

const articleCopyCache = new Map<string, ArticleCopy>();

export function getArticleCopy(post: BlogPost, locale: BlogLocale): ArticleCopy {
  const key = `${locale}/${post.id}`;
  const cached = articleCopyCache.get(key);
  if (cached) return cached;
  const input = ARTICLE_INPUTS[locale][post.id];
  const copy: ArticleCopy = {
    ...input,
    sections: Object.fromEntries(
      Object.entries(input.sections).map(([id, { paragraphs, ...section }]) => [
        id,
        {
          ...section,
          ...(paragraphs
            ? { paragraphs: Object.fromEntries(Object.entries(paragraphs).map(([key, paragraph]) => [key, parseArticleParagraph(paragraph)])) }
            : {}),
        },
      ]),
    ),
  };
  articleCopyCache.set(key, copy);
  return copy;
}

export function getArticleSection(post: BlogPost, id: string, locale: BlogLocale) {
  const section = getArticleCopy(post, locale).sections[id];
  if (!section) throw new Error(`Missing blog section ${locale}/${post.id}.${id}`);
  return section;
}

/** Unique sources in first-cited order. */
export function articleSourceIds(post: BlogPost) {
  return [...new Set(post.sections.flatMap((section) => section.sources ?? []))];
}

const WORDS_PER_MINUTE = 200;
const readingMinutesCache = new Map<string, number>();

/** Counts every visible word, including tables and questions; computed once per article. */
export function articleReadingMinutes(post: BlogPost, locale: BlogLocale) {
  const key = `${locale}/${post.id}`;
  const cached = readingMinutesCache.get(key);
  if (cached) return cached;
  const copy = getArticleCopy(post, locale);
  const text = [
    copy.intro,
    ...Object.values(copy.sections).flatMap((section) => [
      section.title,
      ...Object.values(section.paragraphs ?? {}).map(articleParagraphText),
      ...Object.values(section.items ?? {}),
      section.after ?? "",
      section.note ?? "",
      ...(section.table ? [section.table.caption, ...section.table.columns, ...section.table.rows.flat()] : []),
    ]),
    ...Object.values(copy.faq).flatMap(({ question, answer }) => [question, answer]),
  ].join(" ");
  const minutes = Math.max(1, Math.ceil(text.trim().split(/\s+/).length / WORDS_PER_MINUTE));
  readingMinutesCache.set(key, minutes);
  return minutes;
}
