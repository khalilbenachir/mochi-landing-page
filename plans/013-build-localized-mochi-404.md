# Plan 013: Ship a localized Mochi 404 page

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. Stop
> on any condition listed under "STOP conditions"; do not improvise around
> routing, metadata, translations, or brand art. Update this plan's row in
> `plans/README.md` when complete unless a reviewer told you they maintain the
> index.
>
> **Drift check (run first)**:
> `git diff --stat 03101c3..HEAD -- 'src/app/[locale]' src/features/landing/components src/features/landing/content/assets.ts src/i18n messages tests/e2e next.config.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts with the live code. Stop on a material mismatch.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `03101c3`, 2026-11-09
- **Execution status**: DONE (reviewed in the owner's current checkout; no commit)
- **Owner override**: On 2026-11-09 the owner rejected the reused wondering-face
  art and requested a generated mascot matching the supplied reference. The
  approved transparent bitmap is registered and tested as
  `LANDING_ASSETS.notFoundMascot`.

## Why this matters

Unknown URLs currently fall through to Next.js's generic `/_not-found` page,
which breaks the otherwise cohesive Mochi experience. The replacement must be
more than a styled component: it must return a real 404, preserve the active
locale, avoid landing-only structured data and indexable metadata, send people
back to the correct localized home page, and remain usable from phone through
wide desktop. The requested visual direction is a pink poster with a large
`4 · Mochi · 4` composition, concise recovery copy, home and App Store actions,
the existing navigation, and the existing site footer.

The supplied reference image is directional, not a literal page specification.
Its second title/CTA block is duplicated and its lower feature cards turn the
error state into another landing page. Render one error message and one CTA row;
do not reproduce those artifacts.

## Current state

- The installed stack is Next.js `15.5.29`, React `19.3.1`, next-intl `4.14.9`,
  strict TypeScript, Tailwind CSS `4.1.18`, Vitest, and Playwright. The repository
  is npm-managed (`package-lock.json`).
- `src/app/[locale]/layout.tsx:24-80` currently owns all landing-page metadata,
  including index/follow robots, the landing canonical, alternates, Open Graph,
  and Twitter fields:

  ```tsx
  export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
    const { locale: localeParam } = await params;
    if (!hasLocale(routing.locales, localeParam)) notFound();

    const locale = localeParam as AppLocale;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    // ...landing canonical, alternates, robots, Open Graph and Twitter metadata...
  }
  ```

  This was correct while the localized segment contained only the landing page.
  Once a 404 exists, those route-specific fields must move to
  `src/app/[locale]/page.tsx`; otherwise a missing URL inherits landing metadata.

- `src/app/[locale]/layout.tsx:87-100` also renders landing-only JSON-LD around
  every child:

  ```tsx
  export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);

    return (
      <html lang={locale}>
        <body>
          <StructuredData locale={locale} />
          {children}
        </body>
      </html>
    );
  }
  ```

  The `MobileApplication` and `FAQPage` graph describes visible landing content,
  not the 404. Move `<StructuredData locale={locale} />` into the localized home
  page together with the landing metadata.

- `src/app/[locale]/page.tsx:9-14` is currently a thin home route:

  ```tsx
  export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <LandingPage />;
  }
  ```

- There is no `not-found.tsx`, no catch-all route, and no 404 test. The current
  production build reports `○ /_not-found` with the framework's default UI.
  The official next-intl pattern for locale routing is a
  `src/app/[locale]/not-found.tsx` plus
  `src/app/[locale]/[...rest]/page.tsx` that calls `notFound()`.
- `src/i18n/routing.ts:3-7` defines six locales (`en`, `fr`, `de`, `es`,
  `pt-BR`, `pt-PT`), default locale `en`, and `localePrefix: "as-needed"`.
  `localePath(locale)` returns `/` for English and `/<locale>` for every other
  locale. Use it for all recovery links; do not hand-build locale URLs.
- `src/i18n/types.d.ts:4-8` augments next-intl so `useLocale()` is typed as the
  `AppLocale` union and messages are typed from `messages/en.json`.
- `messages/en.json` is the source schema. `src/i18n/messages.test.ts:40-43`
  requires every non-English file to have exactly the same message paths.
- `src/features/landing/components/sections/HeroSection.tsx:81-124` contains the
  white App Store pill and Apple mark. Lines 127-169 contain the complete site
  header. Both are reusable site-shell elements but are nested in a section
  file today.
- `src/features/landing/components/sections/ClosingSection.tsx:22-49` contains
  the black App Store badge, and lines 80-91 contain the site footer. Extract
  these without changing their rendered markup or Tailwind class strings.
- `src/features/landing/content/assets.ts:3-18` originally declared only the
  460×368 wondering face. During review, the owner rejected that partial face
  for the 404 and explicitly approved generating a full Mochi-on-cushion asset.
- `src/features/landing/components/shared/PosterStage.tsx` is the established
  responsive poster coordinate system. Reuse it instead of introducing another
  fixed-width canvas.
- Styling conventions from `README.md` and policy tests:
  - Tailwind utilities in `className` are the only styling mechanism.
  - No CSS Modules, custom class selectors, or inline styles.
  - Color literals belong only in `src/app/globals.css`; reuse existing tokens
    such as `hero-band`, `hero-title-shadow`, `hero-badge-shadow`, `sun`,
    `ink-navy`, and `island-band` for the 404.
  - Use named breakpoints (`max-poster`, `max-nav`, `max-tablet`, `max-phone`,
    `min-wide`), never arbitrary `max-[...]` variants.
  - Every inline SVG needs a `viewBox` and either `aria-hidden="true"` or an
    accessible image label.
- Existing landing Playwright baselines are deliberate guardrails. Extracting
  the header, badges, and footer must not change the landing DOM, class strings,
  behavior, or pixels.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm install` | exit 0; lockfile remains unchanged |
| Style policy | `npm run check:styles` | all style-policy tests pass |
| Messages | `npm test -- src/i18n/messages.test.ts` | all locale schema tests pass |
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0, no warnings/errors |
| Build | `npm run build:test` | exit 0; localized catch-all route is present |
| Record only new 404 baselines | `npm run build:test && ./node_modules/.bin/playwright test tests/e2e/not-found.spec.ts --update-snapshots` | new 404 tests pass and only 404 PNGs are created/updated |
| Focused 404 e2e | `npm run build:test && ./node_modules/.bin/playwright test tests/e2e/not-found.spec.ts` | all 404 tests and screenshots pass |
| Repository gate | `npm run check` | exit 0 |
| Full e2e | `npm run test:e2e` | all route, accessibility, locale, SEO, and visual tests pass; existing landing PNGs stay unchanged |

## Suggested executor toolkit

- Follow the official next-intl error-file pattern for localized unknown routes:
  <https://next-intl.dev/docs/environments/error-files>.
- Follow the Next.js `not-found` contract for 404 status and automatic noindex
  behavior: <https://nextjs.org/docs/app/api-reference/file-conventions/not-found>
  and <https://nextjs.org/docs/app/api-reference/functions/not-found>.
- If available, use `vercel-react-best-practices` while extracting the shared
  server components. Keep the client boundary limited to the existing mobile
  and locale menus.
- The original no-ImageGen direction was superseded by the owner's explicit
  review request. The generated bitmap must remain a declared, tested 404-only
  asset and must not change the landing-page composition.

## Scope

**In scope** (the only application/test files to modify or create):

- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/not-found.tsx` (create)
- `src/app/[locale]/[...rest]/page.tsx` (create)
- `src/features/landing/components/NotFoundPage.tsx` (create)
- `src/features/landing/components/shared/AppStoreBadges.tsx` (create)
- `src/features/landing/components/shared/SiteHeader.tsx` (create)
- `src/features/landing/components/shared/SiteFooter.tsx` (create)
- `src/features/landing/components/sections/HeroSection.tsx`
- `src/features/landing/components/sections/ClosingSection.tsx`
- `src/features/landing/content/assets.ts`
- `src/features/landing/content/assets.test.ts`
- `public/mochi/not-found-mascot.png` (create)
- `messages/en.json`
- `messages/fr.json`
- `messages/de.json`
- `messages/es.json`
- `messages/pt-BR.json`
- `messages/pt-PT.json`
- `tests/e2e/not-found.spec.ts` (create)
- `tests/e2e/not-found.spec.ts-snapshots/*.png` (create only the baselines named
  in the test plan)
- `plans/README.md` (status only during execution)

**Out of scope** (do not touch):

- `next.config.ts` and the experimental `globalNotFound` flag. The middleware
  intentionally excludes asset-like paths containing a dot; a generic 404 for
  a missing static asset does not need the branded document UI.
- Any other file under `public/`; the owner-approved 404 mascot above is the
  only new public asset.
- Landing copy, product claims, legal links, App Store URL, product sections,
  crawler endpoints, sitemap, robots route, manifest, or social card.
- Adding feature cards, FAQ snippets, or a second title/CTA block to the 404.
- Updating any pre-existing landing-page screenshot to make a refactor pass.

## Git workflow

- Follow the repository owner's established mode in `plans/README.md`: work in
  the current `main` checkout with no branch, worktree, commit, push, or pull
  request unless the operator explicitly overrides it.
- Preserve unrelated changes. Before starting, run `git status --short`; stop
  if an in-scope file has unrecognized edits.
- During the final review, `git diff --name-only` must contain only the in-scope
  paths above plus ignored `.next/` output.

## Steps

### Step 1: Move landing-only metadata and structured data to the home route

Refactor `src/app/[locale]/layout.tsx` so it remains responsible for:

- validating the locale;
- calling `setRequestLocale(locale)`;
- importing the Nunito font and `globals.css`;
- the `<html lang={locale}>` / `<body>` document shell;
- the existing exported `viewport`.

Move the existing `generateMetadata` implementation **verbatim in behavior**
to `src/app/[locale]/page.tsx`. Move every supporting import and the
`socialImageUrl` constant with it. Keep the existing metadata fields, locale
alternates, canonical rules, Open Graph image, Twitter image, and conditional
`metadataBase` unchanged.

Move `<StructuredData locale={locale} />` into `HomePage`, immediately before
`<LandingPage />`, using a fragment so the landing still has exactly one
`<main>`. The localized layout must render only `{children}` in `<body>`.

This is route ownership, not an SEO redesign. Do not change metadata values or
the structured-data implementation.

**Verify**:

1. `npm run typecheck` -> exit 0.
2. `npm run build:test` -> exit 0.
3. `./node_modules/.bin/playwright test tests/e2e/seo.spec.ts` against the
   just-built production server -> all existing SEO tests pass unchanged.

### Step 2: Extract the reusable store badges, header, and footer

Create `src/features/landing/components/shared/AppStoreBadges.tsx` and move,
without redesigning:

- `AppleLogo`;
- the white `AppStoreBadge`, including its `compact` and `dark` variants;
- `STORE_BADGE` and the black closing/footer badge, exported with a clear name
  such as `ClosingStoreBadge`.

Preserve the exact SVG path, translation keys, anchor behavior, CVA/static
class strings, and `Button asChild` pattern. `HeroSection.tsx` must import the
white badge from this shared file. `ClosingSection.tsx` must import the black
badge. `FreeSticker` remains in `HeroSection.tsx`; do not broaden this refactor.

Create `shared/SiteHeader.tsx` by moving `NAV`, `MOBILE_NAV`, and `Header` from
`HeroSection.tsx`. Export `SiteHeader` with these optional string props:

- `homeHref`, default `"#top"`;
- `sectionBase`, default `""`.

The brand link uses `homeHref`. Each desktop and mobile navigation href is
`${sectionBase}${item.href}`. Therefore the landing's default render preserves
its current `#features`-style anchors exactly, while the 404 can pass the
localized home path and produce `/#features`, `/fr#features`, etc. Keep the
locale switcher, mobile menu, App Store badge, accessibility labels, DOM order,
and every existing class string unchanged.

Create `shared/SiteFooter.tsx` by moving the footer block from
`ClosingSection.tsx`. Give it `homeHref="#top"` by default and use that value
for the brand link. It should render the same `PosterStage`, app icon, divider,
localized brand text, and footer store badge as before.

Replace the original blocks with `<SiteHeader />` and `<SiteFooter />` in the
landing sections. The resulting landing markup and visual output must be
equivalent to the current page.

**Verify**:

1. `npm run check:styles` -> all style and SVG policies pass.
2. `npm run typecheck` -> exit 0.
3. `git diff -- tests/e2e/landing.spec.ts-snapshots` -> no changes; no landing
   baseline has been updated.

### Step 3: Add a typed, localized 404 message namespace

Add this source schema to `messages/en.json`:

```json
"NotFound": {
  "metadataTitle": "Page not found | Mochi",
  "metadataDescription": "This Mochi page could not be found.",
  "code": "Error 404",
  "title": "Oops, this page rolled away",
  "body": "Mochi looked everywhere but couldn't find it. Let's get you back on track.",
  "home": "Back to home",
  "mascotAlt": "Mochi looks puzzled"
}
```

Add the same keys to every locale using these reviewed translations:

| Locale | metadataTitle | metadataDescription | code | title | body | home | mascotAlt |
|---|---|---|---|---|---|---|---|
| `fr` | `Page introuvable | Mochi` | `Cette page Mochi est introuvable.` | `Erreur 404` | `Oups, cette page a roulé trop loin` | `Mochi a cherché partout, sans la trouver. Revenons sur la bonne voie.` | `Retour à l’accueil` | `Mochi a l’air perplexe` |
| `de` | `Seite nicht gefunden | Mochi` | `Diese Mochi-Seite wurde nicht gefunden.` | `Fehler 404` | `Ups, diese Seite ist weggerollt` | `Mochi hat überall gesucht, konnte sie aber nicht finden. Bringen wir dich zurück auf den richtigen Weg.` | `Zurück zur Startseite` | `Mochi schaut ratlos` |
| `es` | `Página no encontrada | Mochi` | `No se ha podido encontrar esta página de Mochi.` | `Error 404` | `Vaya, esta página se fue rodando` | `Mochi buscó por todas partes, pero no pudo encontrarla. Volvamos al buen camino.` | `Volver al inicio` | `Mochi parece desconcertado` |
| `pt-BR` | `Página não encontrada | Mochi` | `Esta página do Mochi não foi encontrada.` | `Erro 404` | `Ops, esta página saiu rolando` | `O Mochi procurou por toda parte, mas não encontrou. Vamos voltar para o caminho certo.` | `Voltar ao início` | `O Mochi parece confuso` |
| `pt-PT` | `Página não encontrada | Mochi` | `Esta página do Mochi não foi encontrada.` | `Erro 404` | `Ups, esta página foi a rolar` | `O Mochi procurou por todo o lado, mas não a encontrou. Vamos voltar ao caminho certo.` | `Voltar ao início` | `O Mochi parece confuso` |

Keep punctuation and apostrophes valid JSON. Do not add English fallback copy in
TSX.

**Verify**: `npm test -- src/i18n/messages.test.ts` -> every locale remains in
schema lockstep and all values are strings.

### Step 4: Implement the branded error composition from existing pieces

Create `src/features/landing/components/NotFoundPage.tsx` as a Server Component.
Use `useLocale()` and `localePath(locale)` to compute `homeHref`; use
`useTranslations("NotFound")` for all visible/error-specific copy. Do not add a
`"use client"` directive.

Render one `<main>` with a full-height flex composition:

1. A full-bleed `bg-hero-band` error section that grows to fill available
   viewport height.
2. `PosterStage` with the same horizontal padding behavior as the hero.
3. `<SiteHeader homeHref={homeHref} sectionBase={homeHref} />`.
4. One centered error hero:
   - a large, high-contrast `4 · mascot · 4` row;
   - `LANDING_ASSETS.notFoundMascot` through `next/image` at its real 1254×1254
     dimensions, with `alt={t("mascotAlt")}` and a correct responsive `sizes`;
   - a decorative question mark above the mascot;
   - at most a few lightweight inline sparkle/ray/petal SVGs using existing
     theme colors; every one has a `viewBox` and `aria-hidden="true"`;
   - the visible number glyphs are `aria-hidden="true"`; the heading starts
     with an `sr-only` `t("code")` so assistive technology receives the error
     code once.
5. A single `<h1>` containing the localized error code (screen-reader-only)
   and visible title, then one localized body paragraph.
6. One CTA row containing:
   - a white rounded `Button asChild` + `next/link` back to `homeHref`, with
     clear hover, active, focus-visible, and reduced-motion states;
   - the shared white `AppStoreBadge`.
7. `<SiteFooter homeHref={homeHref} />` as the final element.

Visual requirements:

- Match the existing project's pink, white, navy, yellow, and purple palette;
  use existing tokens rather than literal colors.
- Use the current rounded Nunito typography and poster geometry.
- At poster/desktop widths, the 404 row is the dominant image and both CTAs sit
  on one row below the copy.
- At 759px the existing burger menu replaces desktop navigation without
  colliding with the error art.
- At 390px the `4 · mascot · 4` row remains legible, the title/body wrap without
  clipping, CTAs can stack or wrap, the footer remains visible below the fold,
  and there is no horizontal scroll.
- Do not force the entire page into 844px; natural vertical scrolling is fine.
- Do not duplicate the title/CTA block or add the three feature cards from the
  supplied reference.

Keep all styling in static Tailwind class strings or `cn()`/`cva()`. If a new
color role is truly required, stop and request approval instead of adding a
literal; the existing palette should be sufficient.

**Verify**:

1. `npm run check:styles` -> no CSS Module, custom selector, literal-color,
   inline-style, dynamic-class, breakpoint, shadow, or SVG policy violations.
2. `npm run typecheck` -> exit 0.

### Step 5: Wire unknown localized URLs to a real 404

Create `src/app/[locale]/not-found.tsx` as a thin route boundary that imports
and returns `<NotFoundPage />`. The UI owns no route matching and the route file
owns no visual implementation.

Create `src/app/[locale]/[...rest]/page.tsx` with typed async params containing
`locale: AppLocale` and `rest: string[]`.

- In the page component, await params, call `setRequestLocale(locale)`, then
  call `notFound()` during render. Do not return the UI directly; that would
  produce a 200 response instead of a 404.
- Export `generateMetadata` from this catch-all page. Use
  `getTranslations({ locale, namespace: "NotFound" })` and return only the
  localized title, localized description, and
  `robots: { index: false, follow: false }`.
- Do not add canonical, alternate-language, Open Graph, Twitter, or structured
  data fields to the missing route.

The middleware already matches navigational paths without dots and supplies a
locale. Do not add a root layout, root not-found page, global-not-found page, or
middleware exception for this feature.

**Verify**:

1. `npm run build:test` -> exit 0 and the route table contains a dynamic
   localized catch-all in addition to `/[locale]`.
2. With the production server used by Playwright, `/missing-page` and
   `/fr/missing-page` both return HTTP 404, render the custom page, and use
   `<html lang="en">` / `<html lang="fr">` respectively.

### Step 6: Add route, metadata, accessibility, navigation, and visual tests

Create `tests/e2e/not-found.spec.ts`. Import all six message JSON files,
`localePath`, `routing`, and `AppLocale` using the conventions in
`tests/e2e/seo.spec.ts`.

Add a missing-path helper that appends `/missing-page` correctly to `/` and to
prefixed locale paths (never produce `//missing-page`). Do not reuse
`watchPageErrors` from `landing.spec.ts` unchanged: it treats the expected 404
document response as an error. The new helper should still fail on console
errors, page errors, and 4xx/5xx image responses while allowing the one expected
404 navigation document.

Cover these cases:

1. **All six locales**: the unknown URL returns 404, preserves the expected
   `html[lang]`, renders exactly one `main` and one `h1`, shows that locale's
   title/body/home copy, and the home CTA href equals `localePath(locale)`.
2. **Crawler contract**: an English and French missing route contain a robots
   meta value with `noindex`, no JSON-LD script, no canonical link, and no
   `og:url`. Ensure an inherited `index, follow` value is not emitted.
3. **Recovery navigation**: from the French 404, the home CTA reaches `/fr`
   with a 200 response; a header feature link points to `/fr#features` and
   reaches the landing section. The English equivalents use `/#...`.
4. **Keyboard/accessibility**: the home and App Store CTAs are reachable by
   Tab, decorative SVGs remain hidden from assistive technology, the visible
   number glyphs are hidden, and the h1's accessible name contains `Error 404`
   plus the localized title exactly once.
5. **Responsive layout**: for each locale at widths 390, 759, 1099, and 1440,
   `document.documentElement.scrollWidth - window.innerWidth <= 0`.
6. **Visual baselines**: add exactly these two reviewed screenshots with
   animations disabled and assets/fonts decoded first:
   - English desktop at 1440×1000, full page;
   - English phone at 390×844, full page.

Record the two new baselines once, inspect them at original size, then rerun the
focused test without `--update-snapshots`. Do not update landing snapshots.

**Verify**:

1. `npm run build:test && ./node_modules/.bin/playwright test tests/e2e/not-found.spec.ts --update-snapshots` -> all tests pass and exactly two new PNGs appear.
2. `npm run build:test && ./node_modules/.bin/playwright test tests/e2e/not-found.spec.ts` -> all tests and screenshots pass without changes.

### Step 7: Run the full regression gates

Run the policy/unit/type/lint/build gate, then the complete Playwright suite.
The landing metadata refactor and shell extraction must be invisible to the
existing home page.

**Verify**:

1. `npm run check` -> exit 0.
2. `npm run test:e2e` -> all tests pass.
3. `git diff --exit-code -- tests/e2e/landing.spec.ts-snapshots` -> exit 0; no
   pre-existing landing PNG changed.
4. `git status --short` -> only in-scope source/messages/tests, the two new 404
   PNGs, and the plan status row are modified.

## Test plan

- Message-schema coverage remains in `src/i18n/messages.test.ts`; all six files
  must stay structurally identical to English.
- Existing style, theme, and SVG tests validate that the new component follows
  the Tailwind-only design system and uses accessible inline art.
- Existing `tests/e2e/seo.spec.ts` proves moving landing metadata/JSON-LD from
  the layout to the home page does not change crawler output for valid routes.
- New `tests/e2e/not-found.spec.ts` proves HTTP status, localization, noindex,
  absence of landing-only crawler data, localized recovery links, keyboard
  access, no overflow at all supported layout thresholds, and two visual states.
- Existing `tests/e2e/landing.spec.ts` and its baselines are the regression test
  for extracting the header, badges, and footer.

## Done criteria

- [x] Every navigational unknown path matched by the locale middleware renders the branded page and returns HTTP 404.
- [x] English uses the canonical `/` home URL; the other five locales link back to their prefixed home URL.
- [x] All visible 404 copy and accessibility text come from the six synchronized message files.
- [x] The page has exactly one h1 and announces the 404 code once.
- [x] The 404 emits `noindex` and does not emit landing canonical, Open Graph URL, FAQ/Application JSON-LD, or index/follow metadata.
- [x] Valid landing pages retain their complete current metadata and structured data.
- [x] The 404 uses the owner-approved generated full Mochi-on-cushion asset; its dimensions and manifest registration are tested.
- [x] The existing site header, store badges, and footer are shared components, not copied markup.
- [x] The 404 has no horizontal overflow at 390, 759, 1099, or 1440px in any locale.
- [x] Exactly two reviewed 404 screenshot baselines exist; no landing baseline changed.
- [x] `npm run check` and `npm run test:e2e` exit 0.
- [x] No files outside the owner-approved in-scope list are modified.
- [x] `plans/README.md` marks plan 013 `DONE` after review.

## STOP conditions

Stop and report back instead of improvising if:

- In-scope routing, layout, shell, message, or test files materially differ from
  the excerpts after the drift check.
- Product requirements demand a branded document for dot-containing/static
  asset paths. That would require a separately reviewed `global-not-found`
  strategy and enabling an experimental Next.js flag.
- The existing wondering mascot is rejected and a new bitmap is required,
  unless the owner explicitly approves the ImageGen and asset-manifest scope.
  That approval was supplied during this execution.
- The catch-all renders the branded UI with HTTP 200 instead of 404, or the
  generated head contains both an indexable robots directive and `noindex`.
- Moving metadata causes any existing SEO contract assertion to change.
- Extracting shared shell components changes a pre-existing landing screenshot.
  Restore markup/class parity; do not approve the change by updating baselines.
- A translation does not fit at a tested breakpoint and fixing it would require
  changing the reviewed wording rather than responsive composition.
- A verification command fails twice after one reasonable correction.
- Completion appears to require touching an out-of-scope file.

## Maintenance notes

- Any future localized route placed before `[...rest]` will take precedence
  automatically. Keep the catch-all last and continue to call `notFound()` so
  missing documents retain a real 404 status.
- Keep route-specific metadata and structured data in route pages, not the
  shared locale layout. Otherwise future legal/help pages will inherit landing
  canonicals and FAQ schema.
- If the site later needs a branded response for missing assets or other paths
  excluded by middleware, design a small language-neutral
  `global-not-found.tsx` separately; do not silently broaden the matcher.
- Reviewers should scrutinize response status, robots output, localization,
  landing snapshot parity, and the client bundle boundary around the existing
  menus more closely than the decorative layout details.
- Keep the reference's playful concept but not its duplicated content or
  feature-card clutter; a 404's primary job is recognition and recovery.
