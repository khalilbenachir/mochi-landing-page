# The Mochi Journal

The blog publishes nine guides and an editorial-policy page in all six site languages:
English under `/blog`, plus `/fr/blog`, `/de/blog`, `/es/blog`, `/pt-BR/blog` and `/pt-PT/blog`.
URLs select the language regardless of browser preferences or saved locale cookies. The
language switcher preserves the current page, and explicit `/en/...` URLs canonicalize to
their unprefixed English counterparts.
The index and all reading pages reuse the site's existing header and footer. The body
follows the supplied Journal references: a writer mascot masthead, category pills,
featured guide, three-column cards, pastel article heroes, sticky contents and sharing,
a quick answer, inline app CTA, article questions, and related reading. The Journal and editorial page end with a newsletter banner matching the supplied
purple reference, with a labelled email field, yellow Subscribe button and sleeping mascot.
`NEXT_PUBLIC_NEWSLETTER_FORM_ACTION` configures a public HTTPS form endpoint accepting
POST field `email`; the provider controls confirmation and unsubscribe handling.
The value must be an absolute HTTPS URL; anything else fails the build
(`content/newsletter.ts`). By default, Subscribe opens a prefilled email request to
`NEWSLETTER_RECIPIENT` (`hello@mochiii.app`, in `content/newsletter.ts`), the recipient
supplied by the owner. The visitor must send that email. The form explains
this before submission and offers an explicit mailto fallback link afterward; it
never claims that a subscription was completed. No email is sent by the application,
and no subscriber data is stored locally. Never add API keys to the public form action.

The privacy topic reuses `/blog/private-period-app-iphone`; existing tracking and
calendar-comparison URLs remain valid. Unknown slugs return 404. Every language shows the same
header and footer with a Blog link. All six currently publish a blog; if a supported language
is removed from `BLOG_LOCALES`, its blog routes redirect (307) to the English fallback.
Switching language on a blog page keeps the same page.

## Structure

`BlogCard`, `BlogArticle`, `BlogCta`, `NewsletterBanner`, `BlogShell`, and `BlogFilters` expose compound APIs.
Article content and cards are Server Components that read labels with `useTranslations("Blog")`
and the locale with `useBlogLocale()`. `BlogFilters.client.tsx` owns only the selected category
(mirrored to `?category=`); counts are pluralized on the server. The contents and share controls
(`ArticleNavigation`) are the only client island on an article. Share buttons use the official
brand marks as inline SVG. Article questions use native `details`.

- `locales.ts`: `BLOG_LOCALES`, the single switch for which languages publish the blog.
- `content/catalog.ts`: slugs, categories, section IDs, sources, artwork, tone, release dates,
  the featured flag, newest-first ordering and related-post selection.
- `content/articles/<locale>/<id>.json`: article prose (title, description, alt text, intro,
  sections, optional `table`, questions). Category labels come from `Blog.categories`.
  `description` is shared by metadata, cards, the article hero and JSON-LD. Paragraphs accept
  plain strings or arrays of strings and `{ "postId": "methods", "label": "translated link text" }`
  segments. Link IDs are validated against the catalog, URLs use the current blog locale,
  and reading time counts link labels as visible text. Raw HTML is not supported.
- `messages/<locale>.json` → `Blog`: interface labels, source names and the editorial page.
- `content/newsletter.ts`: newsletter recipient and validated form action.

`client-boundary.test.ts` keeps article JSON and whole message files out of client bundles.

### Adding an article

1. Add the catalog entry (new `BlogPostId`, slug, category, image, tone, `publishedAt`, sections).
2. Add `content/articles/<locale>/<id>.json` for every blog locale and register it in `content/copy.ts`.
3. Add any new source to `src/lib/editorial-sources.ts` and `Blog.sources`.

Type checks and `catalog.test.ts` fail until the copy, sections, tables and artwork are complete.

### Adding a language

Add the locale to `BLOG_LOCALES`, translate the `Blog` and `PeriodEducationFAQ` namespaces, and
add `content/articles/<locale>/` with every article, registered in the `ARTICLES` map in
`content/copy.ts`. That map and `messages.test.ts` reject a partial translation. Links, the
redirect, canonicals, hreflang alternates, JSON-LD, the sitemap and static params follow
automatically: never write a blog path by hand, use `blogRoutes(locale)` / `blogPath(...)`.
`tests/e2e/blog.spec.ts` checks routing for every language in both states.

## Editorial work

The nine articles received the embedded editing workflow from
[Humanizer](https://github.com/blader/humanizer/blob/main/SKILL.md), followed by a check
of claims and citations. All 43 article sections were covered. No clinician review,
fictional author, or measured prediction accuracy is claimed. Worked calendar examples
are explicitly illustrative rather than descriptions of Mochi's algorithm.

Health guidance links to primary sources: CDC menstrual hygiene, ACOG's first-period
guide, NHS period pain and period problems, and the US Office on Women's Health on the
cycle and PMS, plus Cleveland Clinic on the overlapping cycle phases. Pad advice distinguishes the CDC's every-few-hours guidance from ACOG's
4–8-hour range and tells readers to follow product instructions and change sooner as
needed. The table does not invent one universal overnight wear time. Severe or
worsening pain that has not responded to pain relief is identified as needing urgent
medical care. Product statements are attributed to Mochi's published information.

Publication dates are deliberate release dates, not build timestamps. When revising a
published guide substantively, update its visible date, metadata, JSON-LD and sitemap
together. Add new catalog entries and copy together so content-integrity checks cover
the complete guide.

## Artwork

All illustrations were generated with the built-in imagegen tool on 10 November 2026,
using the existing Mochi mascot as the family reference. Original PNGs are retained in
the tool output location. The deployed images are WebP files under `public/blog-art`.
New illustrations and legacy hero cutouts preserve transparency. They are editorial
art, not medical results or verified app screenshots.

| File under `public/blog-art` | Dimensions | Purpose |
| --- | --- | --- |
| `newsletter-mochi.webp` | 1200×800 | Sleeping Mochi on a cream cushion |
| `journal-writer.webp` | 1200×860 | The app's Mochi in a lavender beret, writing in an open journal (ChatGPT, from the app's Mochi references) |
| `pad-care.webp` | 1200×800 | Pad, pink Mochi and purple clock |
| `cycle-phases.webp` | 1200×800 | Green Mochi and symbolic cycle wheel |
| `period-predictions.webp` | 1200×800 | Yellow Mochi and calendar |
| `period-cramps.webp` | 1200×800 | Lavender Mochi and hot-water bottle |
| `cycle-moods.webp` | 1200×800 | Blue Mochi and heart thought bubble |
| `getting-started.webp` | 1200×800 | Mochi beside a generic illustrated phone |
| `tracking-cutout.webp` | 1200×800 | Transparent tracking hero |
| `privacy-cutout.webp` | 1200×800 | Transparent privacy hero |
| `methods-cutout.webp` | 1200×800 | Transparent calendar-comparison hero |

Full prompts, references and encoding settings are recorded in `docs/blog/`
(`artwork-prompts.json`, `redesign-artwork-prompts.json`, `newsletter-artwork-prompt.json`).
The original tracking, privacy and comparison cards that the redesigned heroes were derived
from are kept as provenance in `docs/blog/reference-art/`; they are not deployed.
New images use `cwebp -q 82 -resize 1200 0`; the cycle wheel uses quality 70,
alpha quality 10 and method 6 to keep its bitmap below 100 KB. The writer's natural
aspect ratio is preserved. No screenshot of the supplied layout is embedded as UI.

## Verification

`npm run check` covers types, style policy, assets, translations, article completeness
and the production test build. Playwright checks English routes, metadata, structured
data, no-JavaScript reading, translated 404s, language switching, category filters,
clipboard sharing, native questions, mobile contents, keyboard FAQs, responsive
layout, and desktop/mobile index, article and editorial screenshots. Existing site
checks cover the shared navigation, footer and locale behavior.
