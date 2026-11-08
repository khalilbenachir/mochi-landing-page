# Plan 012: Test the production SEO and crawler contract over HTTP

> **Executor instructions**: Follow this plan step by step, run every
> verification command, and stop rather than improvising if a STOP condition
> occurs. When done, update this plan's row in `plans/README.md` unless a
> reviewer told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat cd31005..HEAD -- tests/e2e/seo.spec.ts tests/e2e/origin.ts playwright.config.ts package.json README.md src/app/[locale]/layout.tsx src/app/robots.ts src/app/sitemap.ts src/app/manifest.ts src/components/seo/StructuredData.tsx src/i18n/routing.ts messages`
> This plan depends on plans 008-011. Confirm their done criteria against live
> code before proceeding; stop if any prerequisite is absent or materially
> different.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans 008, 009, 010, and 011
- **Category**: tests
- **Planned at**: commit `cd31005`, 2026-11-08

## Why this matters

The existing test suite proves that localized pages render and remain visually
stable, but it does not test the public contract consumed by search engines,
social crawlers, or AI search crawlers. The manifest icon mismatch and silent
localhost fallback both passed every current gate. This plan adds focused
production-server tests for metadata, structured data, robots, sitemap,
manifest, and public image endpoints across all six locales.

## Current state

- `tests/e2e/landing.spec.ts:67-101` checks route status, final path, `html`'s
  language, and the main landmark. It does not assert title, description,
  canonical, `hreflang`, Open Graph, Twitter, or JSON-LD.
- `tests/e2e/landing.spec.ts` has no requests for `/robots.txt`, `/sitemap.xml`,
  `/manifest.webmanifest`, `/icon.png`, `/apple-icon.png`, or manifest/social
  image assets.
- `tests/e2e/origin.ts:1-5` provides `baseOrigin` and the server port. After
  plan 008, `npm run build:test` builds metadata against the same
  `http://localhost:3100` origin.
- `src/i18n/routing.ts` is the source of truth for locales, canonical paths,
  Open Graph locale codes, and `x-default` behavior. Do not duplicate a second
  locale array in the new test.
- `src/i18n/messages.test.ts:10-17` shows the repository's static-import pattern
  for all six JSON message files. Reuse that pattern when exact localized title
  and description assertions are needed.
- `src/components/seo/StructuredData.tsx:19-61` emits an `@graph` containing
  `WebSite`, `MobileApplication`, and `FAQPage`. Tests should parse JSON and
  assert semantic fields, not compare the serialized script as one long string.
- `playwright.config.ts:22-29` starts the built app and already supports a
  separate focused test file.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Focused SEO E2E | `npm run test:seo` | every new SEO/crawler test passes |
| Existing unit/build gate | `npm run check` | exit 0 |
| Full E2E | `npm run test:e2e` | all route, interaction, visual, and SEO tests pass without snapshot updates |
| Lint | `npm run lint` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0 |

## Scope

**In scope**:

- `tests/e2e/seo.spec.ts` (create)
- `package.json`
- `README.md` (document the focused command only)
- `plans/README.md` (status only)

**Read-only test targets; do not modify in this plan**:

- `tests/e2e/origin.ts`
- `playwright.config.ts`
- `src/app/[locale]/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/manifest.ts`
- `src/components/seo/StructuredData.tsx`
- `src/i18n/routing.ts`
- `messages/*.json`

**Out of scope**:

- Fixing a product defect discovered by the new tests. Stop and report it; do
  not expand a test plan into an unreviewed implementation change.
- Search Console, external rich-result validators, CDN/WAF behavior, indexing,
  rankings, or third-party crawler caches.
- Visual snapshot updates. Metadata-only tests must not change page screenshots.
- Hard-coded tests for named AI user agents; the intended robots contract is
  the wildcard allow rule.
- `llms.txt`.

## Git workflow

- Work directly in the current `main` checkout. Do not create a branch,
  worktree, commit, push, or pull request unless the operator overrides this.
- Preserve unrelated work. Stop if the tree is unexpectedly dirty.

## Steps

### Step 1: Add a focused command without changing server behavior

Add this package script:

```json
"test:seo": "npm run build:test && playwright test tests/e2e/seo.spec.ts"
```

Keep the existing full `test:e2e` and `test:e2e:update` commands intact. Add
one row to the README script table describing `npm run test:seo` as the focused
production SEO/crawler contract check. Do not rewrite unrelated stale README
sections in this plan.

**Verify**: `npm run` lists `test:seo`, and `package.json` remains valid JSON.

### Step 2: Build shared test fixtures from repository sources

Create `tests/e2e/seo.spec.ts`. Import:

- `expect` and `test` from `@playwright/test`;
- `baseOrigin` from `./origin`;
- `routing`, `localePath`, `LOCALE_META`, and `AppLocale` from
  `../../src/i18n/routing`;
- all six message JSON files using the static-import pattern from
  `src/i18n/messages.test.ts`.

Build a typed `MESSAGES` record with
`satisfies Record<AppLocale, ...>` so adding a locale fails compilation until
the crawler tests cover it. Derive every page URL and expected alternate URL
from `routing.locales` and `localePath`; do not add a second `LOCALES` constant.

Create small helpers for:

- an absolute page URL from locale;
- reading a meta tag's `content`;
- parsing the single `script[type="application/ld+json"]` as JSON;
- selecting an `@graph` node by `@type` with a clear assertion error.

**Verify**: `npm run typecheck` → exit 0.

### Step 3: Test localized document metadata for all locales

For every `routing.locales` entry, navigate to its canonical path and assert:

- HTTP 200 and `html[lang]` equals the full locale (`pt-BR` and `pt-PT` must
  remain distinct);
- `<title>` equals `MESSAGES[locale].Metadata.title`;
- description equals `MESSAGES[locale].Metadata.description`;
- canonical equals the exact absolute canonical URL;
- one alternate link exists for every routed locale with the exact absolute
  URL, plus `x-default` pointing to the default locale;
- `og:url` equals the canonical;
- `og:locale` equals `LOCALE_META[locale].ogLocale`;
- the set of `og:locale:alternate` values equals every other locale's code;
- `robots` includes `index` and `follow`;
- the Open Graph image is the absolute 1200×630 social card with alt `Mochi`;
- Twitter card is `summary_large_image` and uses the same image.

Assert sets independent of DOM serialization order. Do not use a full `<head>`
snapshot.

**Verify**: `npm run test:seo -- --grep "localized metadata"` → all six locale
cases pass. If npm argument forwarding does not work with the script, run
`npm run build:test && npx playwright test tests/e2e/seo.spec.ts --grep "localized metadata"`.

### Step 4: Test JSON-LD as data, not text

For every locale, parse the JSON-LD script and assert:

- `@context` is `https://schema.org`;
- the graph has exactly one `WebSite`, one `MobileApplication`, and one
  `FAQPage` node;
- each node's `inLanguage` equals the route locale;
- the website/app descriptions equal the visible metadata description;
- node IDs and absolute URL/image fields start with `baseOrigin`, never
  `localhost:3000`;
- `MobileApplication` keeps `HealthApplication`, iOS operating-system facts,
  a zero-price offer, the locale's currency, and six non-empty features;
- `FAQPage.mainEntity` has the same count as the visible FAQ and every question
  and answer is non-empty.

Do not require ratings, reviews, a real App Store URL, or a different entity-ID
model; those are outside the selected findings. Do not copy complete FAQ text
into the test—derive it from the locale message object or compare counts and
selected exact fields.

**Verify**: run the focused JSON-LD grep as in step 3 → all locale cases pass.

### Step 5: Test robots and sitemap endpoints

Use Playwright's `request` fixture so these assertions exercise the served
production route rather than `.next` internals.

For `/robots.txt`, assert:

- HTTP 200 and a text/plain-compatible content type;
- one wildcard user-agent rule allowing `/`;
- `Host: ${baseOrigin}`;
- `Sitemap: ${baseOrigin}/sitemap.xml`;
- no `Disallow: /` rule.

For `/sitemap.xml`, assert:

- HTTP 200 and XML-compatible content type;
- exactly one canonical `<loc>` per locale;
- every locale entry contains alternate links for all locales and `x-default`;
- all absolute URLs use `baseOrigin` and none use `localhost:3000`;
- no `<lastmod>` element, matching plan 010.

Use targeted extraction or containment assertions rather than snapshotting the
whole XML. Make counts explicit enough to catch duplicate or missing locales.

**Verify**: run `npm run test:seo` → robots and sitemap tests pass.

### Step 6: Test manifest and public image endpoints

Request `/manifest.webmanifest` and parse JSON. Assert:

- HTTP 200 and a manifest/JSON-compatible content type;
- `name`, `short_name`, `start_url`, theme/background colors, and `display`
  remain present;
- icon entries are exactly the 192×192 and 512×512 PNGs from plan 009, with
  `purpose: "any"`;
- the old WebP is not mislabeled as 512×512.

Request and assert successful image content types for:

- `/icon.png`;
- `/apple-icon.png`;
- `/mochi/app-icon-192.png`;
- `/mochi/app-icon-512.png`;
- `/mochi/social-card.png`.

Dimension correctness remains in the fast unit test; the E2E responsibility is
that production serves each declared asset successfully.

**Verify**: `npm run test:seo` → endpoint and asset tests pass.

### Step 7: Run every repository gate

Run, in order:

1. `npm run check`
2. `npm run test:seo`
3. `npm run test:e2e`

The final full E2E run must pass without `--update-snapshots`. If visual
snapshots differ, stop and report because none of the selected SEO changes
should alter the page body.

**Verify**: all three commands exit 0; no snapshots are modified.

## Test plan

- New file: `tests/e2e/seo.spec.ts`.
- Test all six locales from `routing.locales`, not a duplicated array.
- Validate document metadata, locale clusters, parsed JSON-LD, robots, sitemap,
  manifest, and public image availability.
- Prefer semantic assertions and set comparisons over snapshots or serializer
  order.
- Retain the existing unit tests for URL validation, sitemap object shape, and
  asset dimensions as the fast inner loop.

## Done criteria

- [ ] `npm run test:seo` builds and tests the production crawler contract.
- [ ] All six locales have exact localized titles/descriptions, canonical URLs, and complete alternate clusters.
- [ ] Open Graph locale/image and Twitter large-card metadata are correct for all locales.
- [ ] JSON-LD parses and retains the expected localized site/app/FAQ facts.
- [ ] Robots permits wildcard crawling and points at the correct sitemap/origin.
- [ ] Sitemap contains every locale, every alternate, `x-default`, and no false `lastmod`.
- [ ] Manifest icon declarations and all image endpoints are reachable.
- [ ] `npm run check`, `npm run test:seo`, and `npm run test:e2e` all exit 0.
- [ ] No visual snapshot file changes.
- [ ] Only the new SEO test, package script, README command row, plan status, and ignored build/test output changed.
- [ ] `plans/README.md` marks plan 012 `DONE`.

## STOP conditions

Stop and report if:

- Any of plans 008-011 is incomplete or its final contract differs materially
  from this plan.
- A new test exposes a production defect that requires modifying a read-only
  target file; report it instead of widening scope.
- Importing the app's routing or messages into Playwright requires an unsafe
  type/config workaround. Prefer a small shared fixture only after reviewer
  approval.
- The full E2E suite requests snapshot updates.
- Live tests require an external network service or real production domain.
- A verification command fails twice after a reasonable test-only correction.

## Maintenance notes

- Adding a locale must fail the typed fixture until metadata, alternates, and
  JSON-LD are covered for that locale.
- Keep these tests at the HTTP/DOM boundary. Unit tests remain responsible for
  pure resolver logic and exact bitmap dimensions.
- Do not add named AI-bot allowlist tests unless the product deliberately
  changes from the current wildcard policy.
- After deployment, complement these local contracts with Search Console and
  platform preview validators; they test infrastructure and caches that this
  repository cannot observe.
