# Mochi SEO audit — 10 November 2026

Audited the current workspace using the requested [seo-audit skill](https://www.skills.sh/coreyhaines31/marketingskills/seo-audit), with rendered-browser checks and source inspection. No application code was changed.

## Executive assessment

**The current build has a sound technical SEO foundation. No site-wide crawlability or indexability blocker was found in the local build.** The main opportunities are stronger credibility for health information, more descriptive article snippets, and consistent language routing.

The audit covered **84 canonical pages across six languages**: six homepages, twelve legal pages, six blog indexes, six editorial-policy pages, and 54 article pages representing nine translated guides. The README's description of an English-only blog is outdated; the tested source publishes all six languages.

An existing server on port 3100 was serving an older, inconsistent build. Its initial failures were excluded from these findings. Verification used a fresh, isolated production build on port 3101, configured with a local canonical origin, a test contact address, and no App Store URL. Those deliberate test values are not evidence of production misconfiguration.

## Verified technical results

| Check | Result |
|---|---|
| Sitemap URLs | All 84 returned HTTP 200 |
| Canonicals | All 84 self-reference the requested canonical path |
| Language alternates | All 84 have six language entries plus `x-default`; targets and reciprocal relationships match |
| Sitemap versus HTML alternates | No inconsistencies found |
| Index directives | No accidental `noindex` on sitemap pages |
| Main headings | Exactly one H1 on every sitemap page |
| Image alternative attributes | No missing `alt` attributes; decorative empty alternatives are allowed |
| Internal links and anchors | No broken destinations found |
| Page discovery | Every sitemap page reachable from `/` within three internal-link clicks |
| Runtime errors | No uncaught page errors during the desktop crawl |
| Mobile layout | No horizontal overflow or broken eager images on ten samples at 390 × 844 |
| JavaScript disabled | Sampled homepage, blog index and article retained readable primary content |
| Unknown URLs | Sampled normal and blog URLs returned HTTP 404 |
| Existing automated checks | All 60 nonvisual SEO and blog browser tests passed |

JSON-LD was inspected in the rendered DOM, including `MobileApplication`, `WebSite`, `Blog`, `BlogPosting`, `BreadcrumbList`, and `FAQPage` where applicable. Parsing and content agreement are verified; this is not a Google Rich Results Test certification.

## Prioritized findings

### 1. Strengthen accountable authorship and health-content review

**Priority: high. Potential impact: high for health-information queries. Type: content and trust opportunity.**

**Evidence:** Articles use a corporate “By Mochi” byline. The editorial policy openly says there is no clinician reviewing the articles, and the article notice repeats that limitation. Sources, commercial disclosure, and the editorial policy are good existing safeguards. However, guides about cramps, cycle phases, and mood symptoms currently provide no identifiable health reviewer or credentials.

**Recommendation:** Prioritize a qualified review of the symptom and reproductive-health guides and homepage educational answers. Once actually completed, show the reviewer's real name, relevant credentials, profile, review scope, and review date. Explain who operates Mochi and who is responsible for editorial decisions. Keep the current disclosure until the workflow changes; do not invent expertise or imply a review happened.

**Where:** `messages/en.json` → `Blog.editorial` and `Blog.articleNotice`; translated equivalents; `src/features/blog/components/BlogArticlePage.tsx`; `src/features/blog/components/BlogStructuredData.tsx`.

This is an opportunity to improve credibility, not evidence of a penalty or a requirement that every app article have a clinician. Google gives particular weight to trust for health topics and encourages accurate authorship information. [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### 2. Keep canonical language URLs stable regardless of browser preference

**Priority: medium. Potential impact: medium. Type: confirmed routing behavior.**

**Evidence:** With a fresh cookie context, `GET /` with `Accept-Language: fr` returns `307 → /fr`; `GET /privacy` with `Accept-Language: de` returns `307 → /de/privacy`. The blog middleware already disables locale detection, while the general middleware uses the default locale-detection behavior.

**Recommendation:** Consider applying `localeDetection: false` to the general localized middleware too. Preserve deliberate language switching through the existing locale URLs. Add checks confirming that `/` and `/privacy` remain English for different language headers and saved locale preferences.

**Where:** `src/middleware.ts:6` and `src/i18n/routing.ts`.

This is not preventing the tested pages from being crawled: unprefixed pages return English without language hints, and explicit localized routes work. The benefit is stable canonical navigation and fewer unexpected redirects. Google advises against automatically redirecting between language versions. [Google's multilingual-site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

### 3. Make article descriptions more specific to the question being searched

**Priority: medium. Potential impact: medium for snippet relevance and click-through; unmeasured. Type: on-page opportunity.**

**Evidence:** 61 of 84 descriptions have fewer than 100 characters. All nine English article descriptions are 55–90 characters. For example, the pad guide says “Pad types, timing and overnight care, explained simply.” The cramps guide describes comfort measures but omits “period cramps” from its description. The descriptions exist and are generally distinct; their brevity alone is not an error.

**Recommendation:** Start with the pad, cramps, and privacy guides. State the topic explicitly, summarize the useful answer or decision, and describe the page's distinctive coverage. Avoid padding descriptions to a fixed character count.

Suggested pad-guide description: “Learn how often to change your pad, when to change sooner, and what to check for overnight pads and liners, with links to CDC and ACOG guidance.”

Suggested cramps-guide description: “Find practical ways to ease period cramps, what to record about your pain, and when symptoms need medical attention, with links to NHS guidance.”

**Where:** `src/features/blog/content/articles/<locale>/*.json` → `description`. This field also appears visibly in the article hero, so review both contexts or introduce a separate metadata field when necessary.

Google has no fixed meta-description character requirement and can generate a different snippet from page content. These changes should be evaluated with live Search Console data. [Google's snippet guidance](https://developers.google.com/search/docs/appearance/snippet).

### 4. Qualify the privacy FAQ with its existing backup exception

**Priority: medium. Potential impact: medium for clarity and trust; direct ranking effect unknown. Type: confirmed wording inconsistency.**

**Evidence:** The privacy article explains that cycle entries remain on the iPhone unless optional backup is enabled. Its FAQ instead states that period dates, flow, symptoms, and moods stay on the iPhone without that qualification. A separate FAQ discusses backup, but the individual answer may be read independently or extracted into a snippet. The homepage uses similar privacy wording.

**Recommendation:** State the local-storage default and optional-backup exception in the same answer. Preserve the separate claim about exclusions from analytics only if it accurately reflects the product. For example: “Your cycle data stays on your iPhone by default. If you enable optional backup, the backup practices described in our privacy policy apply.” Confirm wording against the actual app before updating every translation and the shared structured-data answer.

**Where:** `src/features/blog/content/articles/en/privacy.json:59`, `messages/en.json` → `FAQ.items.private.answer`, and corresponding translations.

### 5. Turn relevant references in article prose into contextual links

**Priority: low. Potential impact: low to medium for navigation and topic discovery. Type: internal-linking opportunity.**

**Evidence:** The privacy article refers to “our app-versus-calendar guide” in its last section, but the paragraph renderer outputs plain text. That reference is not a link. Related-post cards already exist, and there are no orphan pages, so this is not a discovery blocker.

**Recommendation:** Add a structured, translation-safe way to link that reference to the corresponding localized `period-app-vs-calendar` article. Add other contextual links only where they help readers answer the next question; retain the existing related-reading cards.

**Where:** `src/features/blog/content/articles/en/privacy.json:50`; `ArticleSection` in `src/features/blog/components/BlogArticlePage.tsx`; localized routing through `blogRoutes`.

## Structured-data expectations

Keep useful FAQs and accurate schema, but do not prioritize additional FAQ markup for Google rich-result visibility. Google's current changelog says FAQ rich results stopped appearing on **7 May 2026**. This updates older advice in the skill ecosystem about availability being limited to authoritative government and health sites. [Google's documentation changelog, May 2026](https://developers.google.com/search/updates?hl=fr).

The current markup was not missing. No fabricated ratings, reviews, or credentials should be added to satisfy an automated validator.

## Launch checks and measurement gaps

No production URL or Search Console data was supplied. The following remain unverified, rather than failed:

- Live indexing, Google-selected canonicals, robots access, and sitemap submission.
- HTTPS, HTTP-to-HTTPS and host redirects, deployment headers, and CDN behavior.
- Real-user LCP, INP and CLS. Local desktop resource measurements are not field Core Web Vitals.
- Rankings, keyword demand, click-through, organic conversions, backlink quality, and competitive authority.
- Full linguistic and clinical review of all translated health information.

Before launch, confirm the real site origin, contact address, and App Store destination in the deployment environment. The App Store URL is optional in code and falls back to the local download section; verify that production buttons reach the actual store. These are release checks, not confirmed production faults.

After launch, inspect representative home, legal and article URLs in Search Console, submit the sitemap, and obtain mobile PageSpeed/CrUX data. Use observed queries and impressions to select pages for snippet improvements. Build useful original material around Mochi's strongest product topics, such as a real setup walkthrough or an explanation of optional backup, then seek relevant editorial mentions based on that material.

## Recommended order

1. Resolve the privacy wording and decide whether canonical language URLs should bypass automatic language redirects.
2. Establish accountable health-content review, starting with the guides that discuss symptoms and fertility.
3. Improve the most generic article descriptions and add the missing contextual guide link.
4. Verify production configuration and establish indexing, performance, and search-query baselines.
5. Use actual search demand and reader needs to guide original content and earned links.

Evidence files: [page inventory](./page-inventory.csv) and [verification summary](./verification.json).
