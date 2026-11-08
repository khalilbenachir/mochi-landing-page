# Plan 011: Add a deterministic branded social preview image

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. Stop
> on any condition listed under "STOP conditions"; do not invent brand art or
> copy. Update this plan's row in `plans/README.md` when complete unless a
> reviewer told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat cd31005..HEAD -- src/app/[locale]/layout.tsx src/features/landing/content/assets.ts src/features/landing/content/assets.test.ts public/mochi/social-card.png public/mochi/app-icon.webp public/mochi/hero-mochi.webp src/app/globals.css`
> Compare the current metadata and asset-manifest excerpts below with live
> code. Stop on a material mismatch.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans 008 and 009
- **Category**: direction
- **Planned at**: commit `cd31005`, 2026-11-08

## Why this matters

Localized pages currently emit Open Graph and Twitter titles/descriptions but
no image. Link-preview crawlers may omit artwork or choose an arbitrary page
image, weakening the brand presentation. This plan adds one language-neutral,
reviewed 1200×630 Mochi card and references it explicitly from both Open Graph
and Twitter metadata without introducing a second source of health or product
claims.

## Current state

- `src/app/[locale]/layout.tsx:59-74` defines metadata without images:

  ```ts
  openGraph: {
    title: t("title"),
    description: t("description"),
    type: "website",
    siteName: SITE_NAME,
    locale: LOCALE_META[locale].ogLocale,
    alternateLocale: routing.locales
      .filter((candidate) => candidate !== locale)
      .map((candidate) => LOCALE_META[candidate].ogLocale),
    url: canonical,
  },
  twitter: {
    card: "summary",
    title: t("title"),
    description: t("description"),
  },
  ```

- `PUBLIC_SITE_URL` and `SITE_URL` live in
  `src/features/landing/content/landing.ts`. Plan 008 makes the production
  origin mandatory and validated; use that shared source instead of reading an
  environment variable here.
- `public/mochi/app-icon.webp` and `public/mochi/hero-mochi.webp` are approved
  runtime brand assets. The existing 64×64 browser icon is too small to serve
  as a 1200×630 card by itself.
- `src/features/landing/content/assets.ts` is the single source of deployed
  public asset paths. `assets.test.ts` rejects undeclared files and, after plan
  009, contains a dependency-free PNG dimension helper.
- `README.md:75-77` requires agent-readable facts to match visible content and
  explicitly rejects agent-only copy that can drift. Therefore the card must
  not contain a tagline, feature list, medical claim, pricing, or locale-bound
  prose. The brand name `Mochi` is allowed.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect card | `sips -g pixelWidth -g pixelHeight public/mochi/social-card.png` | 1200×630 |
| Asset tests | `npm run check:assets` | all asset-policy and dimension checks pass |
| Typecheck | `npm run typecheck` | exit 0 |
| Build | `npm run build:test` | exit 0 |
| Full check | `npm run check` | exit 0 |

## Suggested executor toolkit

- Use the `imagegen` skill, when available, to compose the social card from the
  existing Mochi icon/mascot references while preserving the character and
  palette. This is a bitmap asset task, not an HTML/CSS implementation.
- Inspect the output at full size before accepting it. The generation result is
  a draft until it passes the visual requirements below.
- If `imagegen` is unavailable, use an operator-approved image editor. Do not
  silently substitute unrelated stock or generated mascot art.
- **Reviewer refinement (2026-11-09):** the final card was regenerated with
  the built-in ImageGen tool using the approved landing and contact-page art in
  the operator-provided ChatGPT conversation as visual references. It follows
  the reference palette (`#F2577C`, `#F7B036`, `#1F2A3A`), mascot treatment,
  cream cushion, rounded display type, and sparkle motifs. The generated PNG
  was mechanically resized to the required 1200×630 dimensions. Its only text
  is `Mochi`; the previous Playwright-composed draft was replaced.

## Scope

**In scope**:

- `public/mochi/social-card.png` (create)
- `src/features/landing/content/assets.ts`
- `src/features/landing/content/assets.test.ts`
- `src/app/[locale]/layout.tsx`
- `plans/README.md` (status only)

**Out of scope**:

- Visible landing-page composition or copy.
- Localized text rendered into the bitmap.
- Changes to titles, descriptions, canonical URLs, locale mapping, JSON-LD, or
  crawler rules.
- A separate Twitter-only visual; both platforms should reuse the same card.
- Redesigning the app icon or mascot.
- `llms.txt`, marketing analytics, and tracking pixels.

## Git workflow

- Work directly in the current `main` checkout. Do not create a branch,
  worktree, commit, push, or pull request unless the operator overrides this.
- Preserve unrelated changes and stop if the working tree is unexpectedly dirty.

## Steps

### Step 1: Compose the language-neutral social card

Create `public/mochi/social-card.png` at exactly 1200×630 pixels. Use
`public/mochi/app-icon.webp` and/or `public/mochi/hero-mochi.webp` as visual
references. Requirements:

- preserve the approved Mochi character; no extra limbs, facial changes, or
  unrelated objects;
- use the existing pink/coral/cream/navy palette visible in the reference
  assets and `src/app/globals.css`;
- keep the mascot and brand name inside a generous central safe area so common
  crops do not remove them;
- render at most the language-neutral word `Mochi`; add no tagline, feature,
  price, privacy, menstrual-health, or App Store claim;
- maintain strong contrast at thumbnail size;
- no transparency; export an RGB PNG.

Use the existing images as references rather than asking a generator to invent
the brand from a text description. If the generated output materially changes
the character, reject it and try one correction. If it still does not preserve
the character, stop and request an owner-supplied card.

**Verify**:
`sips -g pixelWidth -g pixelHeight public/mochi/social-card.png` → 1200×630.

Then inspect the image at original resolution. Expected visual result: one
clearly recognizable Mochi composition, unclipped safe margins, no unapproved
copy, and no generation artifacts.

### Step 2: Register and dimension-test the card

Add `socialCard: "/mochi/social-card.png"` to `LANDING_ASSETS` in
`src/features/landing/content/assets.ts`. Update the exact expected asset count
in `assets.test.ts` to account for this one new file.

Extend plan 009's PNG dimension assertions to require 1200×630 for
`LANDING_ASSETS.socialCard`. Reuse the existing PNG header helper; do not add a
second implementation or image dependency.

**Verify**: `npm test -- src/features/landing/content/assets.test.ts` → all
asset existence, exact-directory, and dimension tests pass.

### Step 3: Add explicit Open Graph image metadata

In `src/app/[locale]/layout.tsx`, import `LANDING_ASSETS` and `SITE_URL` from
their shared content modules. Construct one absolute social image URL from
`SITE_URL` and `LANDING_ASSETS.socialCard`; do not concatenate a new environment
variable independently.

Add one Open Graph image object with:

- the absolute URL;
- width `1200`;
- height `630`;
- alt text `Mochi` (the language-neutral brand name).

Keep all existing localized title, description, locale, alternate-locale, URL,
and site-name fields unchanged.

**Verify**: `npm run typecheck` → exit 0.

### Step 4: Add the same image to Twitter metadata

Change `twitter.card` from `summary` to `summary_large_image` and reference the
same absolute 1200×630 image. Include the brand-only alt text if the installed
Next.js `Metadata` type supports the object form; do not weaken type safety with
a cast. Preserve the localized title and description.

**Verify**: `npm run typecheck` → exit 0 with no `as any`, `@ts-ignore`, or
other type escape hatch.

### Step 5: Verify generated head output

Run `npm run build:test`. Inspect at least `.next/server/app/en.html` and
`.next/server/app/fr.html`.

Expected on both pages:

- one `og:image` for `http://localhost:3100/mochi/social-card.png`;
- Open Graph width 1200, height 630, and alt `Mochi`;
- one `twitter:image` using the same URL;
- `twitter:card` equals `summary_large_image`;
- localized title/description and locale-specific canonical URLs remain intact.

**Verify**:
`rg -o 'og:image[^>]*|twitter:(card|image)[^>]*' .next/server/app/{en,fr}.html`
→ the expected card type and absolute image URL appear for both locales.

### Step 6: Run the repository gate

Run `npm run check`. Do not update landing-page visual snapshots: the social
card is metadata-only and is not rendered in the page body.

**Verify**: `npm run check` → exit 0.

## Test plan

- Reuse the asset-policy test from plan 009 to assert PNG signature and exact
  1200×630 dimensions.
- Use build-output inspection in this plan to validate generated Open Graph and
  Twitter tags for two representative locales.
- Plan 012 adds table-driven HTTP assertions for all six locales and the card
  endpoint.
- No Playwright screenshot baseline should change.

## Done criteria

- [ ] `public/mochi/social-card.png` is an approved 1200×630 RGB PNG.
- [ ] The card contains no locale-specific or unapproved product/health claims.
- [ ] The public asset is declared and dimension-tested.
- [ ] All six locale pages will receive the same absolute Open Graph image.
- [ ] Twitter uses `summary_large_image` and the same asset.
- [ ] Existing localized metadata, canonicals, and locale signals remain unchanged.
- [ ] `npm run check` exits 0.
- [ ] Only in-scope files and ignored build output changed.
- [ ] `plans/README.md` marks plan 011 `DONE`.

## STOP conditions

Stop and report if:

- Plans 008 or 009 have not landed and the shared origin/dimension-test
  contracts differ from this plan.
- No tool can preserve the approved mascot closely enough for a production
  brand asset.
- The owner wants localized text in the bitmap; that requires a separate asset
  and metadata strategy per locale.
- Next.js metadata typing requires a workaround or unsafe cast.
- A verification command fails twice after a reasonable correction.

## Maintenance notes

- Keep the card language-neutral while all locales share one bitmap. If text is
  added later, create locale-specific cards and map them from `AppLocale`.
- When the brand art changes, update the asset and retain the dimension test.
- Reviewers should inspect the actual preview crop in at least one Open Graph
  and one Twitter/X validator after deployment; local metadata checks cannot
  reproduce every platform cache.
