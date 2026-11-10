# Mochi – landing page

The marketing site for **Mochi**, the gamified period tracker for iPhone.
Next.js 15 App Router · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui · next-intl · Vitest.

The page follows the compact, poster-like Mochi maquette: full-bleed color bands, app-native mascot
art, Dynamic Island and phone mockups, a 12-flavor collection, privacy, account and Plus sections,
FAQ, and a responsive mobile burger menu.

## Getting started

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:3000
```

Production builds require `NEXT_PUBLIC_SITE_URL`: `npm run build` fails without it. The value must be
an absolute root origin such as `https://example.com`, with no path, query, or hash. It drives
canonical metadata, `robots.txt`, `sitemap.xml`, and JSON-LD:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

`npm run build:test` is the deterministic local/CI build used by `npm run check`; it builds against
`http://localhost:3100`. `npm run test:e2e` also builds against that Playwright origin.
Development output lives in `.next-dev/`; production output lives in `.next/`, so running a
build or browser suite does not overwrite chunks used by an open development preview.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with fast refresh |
| `npm run build` | Create the optimized production build and prerender every locale (requires `NEXT_PUBLIC_SITE_URL`) |
| `npm run build:test` | Production build against `http://localhost:3100` (used by checks and e2e) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core web vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest checks for assets, messages, theme tokens, and style policy |
| `npm run test:e2e` | Production build + Playwright route, keyboard, and EN/FR visual tests |
| `npm run test:seo` | Production build + focused SEO/crawler contract check (metadata, JSON-LD, robots, sitemap, manifest, icons) |
| `npm run test:e2e:update` | Re-record visual baselines (only for reviewed, intentional visual changes) |
| `npm run check` | All policy, type, lint, unit, and build checks |
| `npm run check:styles` | Style-policy tests only |
| `npm run check:assets` | Asset manifest tests only |

## Architecture

```
src/
  app/
    [locale]/             localized layout, metadata and landing-page route
    globals.css           Tailwind 4 theme (shadcn roles, landing color tokens, breakpoints, motion) and base element styles
    platform-colors.ts    browser/manifest colors (the only literals outside the theme)
  components/
    marketing/            locale-aware marketing primitives
    seo/                  localized schema.org graph
    ui/                   reusable shadcn primitives
  features/
    legal/
      components/         shared summary cards/headings and contact banner for Privacy and Terms
    landing/
      components/         landing composition and sections, styled with Tailwind utilities
        shared/           `PosterStage`, the poster coordinate system
      content/            site configuration, product catalog, explicit asset manifest and visual-variants.ts
  i18n/                   shared typed routing and request configuration
  lib/utils.ts            shared utility functions
messages/                 English source messages and French, German, Spanish, Brazilian and European Portuguese translations
public/mochi/             app assets plus the optimized transparent hero cutout
tests/e2e/                Playwright routes, keyboard, and visual baselines
design/references/        design reference images (gitignored, never deployed)
```

Principles:

- **Server first.** The complete landing page and its translations are server-rendered. Only the
  Dynamic Island countdown hydrates; the burger and FAQ use native `details` elements.
- **Locale first.** English uses the canonical `/` route; French, German, Spanish, Brazilian and
  European Portuguese use `/fr`, `/de`, `/es`, `/pt-BR` and `/pt-PT`. URLs select the language:
  browser preferences and saved language cookies do not redirect canonical pages. The language
  switcher selects a language explicitly and preserves the current page. Metadata, alternate
  links, sitemap entries, accessibility labels and JSON-LD are generated from the same typed messages.
- **Feature ownership is explicit.** Landing components, catalog data, site configuration and the
  static asset manifest live under `features/landing`; reusable primitives and locale infrastructure
  stay shared.
- **Shared legal presentation.** `features/legal/components` owns the summary cards/headings and
  contact banner used by Privacy and Terms. Each page supplies its translated content and artwork.
- **Facts are separate from language.** Stable product IDs and asset facts live in the landing
  feature's `content/`, while all active user-facing copy lives in `messages/`.
- **Search and agent readable.** Product facts are visible in semantic HTML and mirrored in honest
  `MobileApplication` and `FAQPage` structured data. The site includes a manifest, robots policy
  and sitemap; there is no agent-only copy that could drift from what people see.
- **Design-system layers.** Tailwind utility classes in `className` are the only styling mechanism;
  reusable values live in the Tailwind theme.
- **Responsive by composition.** Desktop bands preserve the dense maquette, while phone layouts
  intentionally stack and resize—without horizontal scrolling or hidden essential content.
- **Privacy and medical honesty**, as in the app: no analytics on the site, no cycle wording on the
  mock Lock Screen, and predictions are never presented as birth control.

## Styling rules

- No CSS Modules, custom class selectors, or inline styles.
- Colors exist only as `--color-*` tokens in the `@theme static` block of `globals.css` (enforced by
  `style-policy.test.ts` and `theme.test.ts`).
- Poster geometry: inside a `PosterStage`, Tailwind's `--spacing` is one poster unit (1/1024 or
  1/800 of the poster width, 1px below the poster breakpoint). So `mt-14`, `w-98` and `-left-68` are
  maquette pixels, `text-u-41` / `rounded-u-12` do the same for type and radii, and off-quarter
  values use `[calc(13.6*var(--spacing))]` or `text-u-[13.6]`. Tailwind's default 4px scale does
  not apply inside a stage: write fixed sizes as `p-[8px]`.
- Prefer native utilities over arbitrary properties: `-rotate-35`, `-translate-x-1/2`,
  `-scale-x-100`, `grid-cols-[...]`, `rounded-full`. Transition `translate`/`rotate`/`scale`
  (not `transform`) when animating them.
- Don't restate preflight (`m-0`, `list-none`, `no-underline`); links inherit their color.
- Reduced motion is handled once in `globals.css`; only add `motion-reduce:` to cancel a hover
  transform, never to drop a transition or animation.
- Breakpoints: `max-poster` (<=1099px), `max-nav` (<=760px), `max-tablet` (<=640px), `max-phone`
  (<=480px), `min-wide` (>=1441px). Never use arbitrary `max-[...]` variants.
- Shadows and filters with `calc()` use arbitrary properties (`[box-shadow:...]`), never `shadow-[...]`.
- Per-ID colors come from typed static records in `visual-variants.ts`.
- Calls to action use `Button` from `features/landing/components/shared` (`variant="pill"`, `"flat"` or `"store"`), sized through `className`.
- Shared decorative SVGs (rays, hearts, sparkles, petals, status icons) live in
  `features/landing/components/shared/decor.tsx`.

## Visual tests

Playwright covers localized routes, keyboard behavior, metadata, crawler endpoints, and full-page
baselines at 1600, 1440, 1099, 759 and 390px, plus the open phone menu and the privacy reader.
Privacy and Terms layout checks also cover 320 and 800px. Shared asset preparation waits for hydration before
preloading lazy artwork, preventing image-attribute changes from racing React hydration.
Baselines change only for reviewed, intentional visual changes (`npm run test:e2e:update`).

## CI/CD

`.github/workflows/ci-cd.yml` (actions pinned to commit SHAs) runs `npm run check` and the screenshot-free SEO e2e suite on every
pull request and push to `main` (visual baselines are macOS-only, so run `npm run test:e2e` locally).
When checks pass, pull requests get a Vercel preview deployment with its URL commented on the PR,
and `main` deploys to production. `vercel.json` disables Vercel's own Git deployments so each commit
deploys once, and only after CI passes.

Required GitHub repository secrets:

- `VERCEL_TOKEN`: a token from vercel.com/account/tokens.
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`: from `.vercel/project.json` after running `vercel link`.

The `NEXT_PUBLIC_*` variables are read from the Vercel project's Preview and Production
environments (`vercel pull`), so set them there.

## Blog

`/blog` contains nine guides, published in all six site languages, with a featured article, related reading (same category
first), category filters that can be shared as `?category=`, and `/blog/editorial-policy`.
Article pages are statically rendered with linked sources, deliberate publication dates,
canonical metadata, `BlogPosting` JSON-LD and a generated social card per article
(`opengraph-image.tsx` / `twitter-image.tsx`).

Which languages publish the blog (and the sourced home-page education FAQ) is decided in one
place: `BLOG_LOCALES` in `src/features/blog/locales.ts`. The header and footer are identical in
every language and always link to Blog: to the language's own blog once published, otherwise to
the English blog. All six current locales publish their own blog. If a supported locale is removed
from `BLOG_LOCALES`, its blog URLs redirect temporarily (307) to the English page until republished. All blog links,
canonicals, hreflang alternates, JSON-LD and sitemap entries are built from `blogRoutes(locale)`. Interface labels live in the `Blog` and `PeriodEducationFAQ` message
namespaces and are read through next-intl; article prose lives in one JSON file per article
under `src/features/blog/content/articles/<locale>/`. See `src/features/blog/README.md` for
how to add an article or a language, the editorial workflow and artwork provenance
(prompts are in `docs/blog/`).

## Before launch

- Set `NEXT_PUBLIC_APP_STORE_URL` to the real App Store destination.
- Set `NEXT_PUBLIC_CONTACT_EMAIL` to the real contact address.
- Set `NEXT_PUBLIC_SITE_URL` to the final production origin.
- Review and approve the draft Terms of Use copy in all six languages before launch.

## Privacy page

`/privacy` (and each locale's `/privacy` route) has an illustrated hero, mint summary cards, a
section reader and a contact banner. All eight sections are always rendered and visible, so the full
policy reads without JavaScript and stays searchable. A small client island highlights the section
named by the URL hash in the sticky "On this page" list and moves focus to its heading; direct URLs
and browser history work. Changing language keeps the privacy route.

Every page shares one `SiteHeader` (its Privacy link opens `/privacy`) and one `SiteFooter`,
rendered once by the locale layout. The footer's Contact link opens `/privacy#contact`.

Privacy components and copy contracts live in `src/features/privacy/`; localized copy lives in
`messages/`. Its illustrations live in `public/privacy-art/`, separate from the landing's
`public/mochi/` manifest; generation prompts and sizes are recorded in `src/features/privacy/README.md`.
`POLICY_UPDATED_AT` in `src/features/privacy/content/policy.ts` is a deliberate policy date, not a
build timestamp.

## Terms page

`/terms` and each locale's `/terms` route follow the Privacy workflow, with a turquoise illustrated
hero, yellow summary band, seven always-readable sections, a hash-aware reader and a contact
banner. The footer's existing Terms link now opens this page. Language switching preserves the
Terms route, and the data summary links to the localized Privacy policy.

Components, stable anchors, the deliberate `TERMS_UPDATED_AT` date, artwork provenance and draft
copy notes live in `src/features/terms/`. All six translations live in `messages/`. The new
transparent scroll-holding mascot is optimized under `public/terms-art/`; the contact illustration
reuses Privacy's peeking Mochi. Contact uses the same configured address as Privacy.
The plain-language Terms copy is a draft for owner/legal review before launch.

### Environment

Copy `.env.example` to `.env` or `.env.local` (both git-ignored). Every value is inlined into the
public bundle.

- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` are required for production builds; the
  build fails without them. Outside production the contact address falls back to `test@mochi.app`.
- Until `NEXT_PUBLIC_APP_STORE_URL` is set, App Store buttons open the localized home download section.
- `npm run build:test` pins all three (`test@mochi.app`, no App Store URL), so tests and
  visual baselines do not depend on your local `.env`.
