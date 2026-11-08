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

For production, set the public site URL so canonical metadata, `robots.txt` and `sitemap.xml` use
the deployed domain:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with fast refresh |
| `npm run build` | Create the optimized production build and prerender every locale |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core web vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest checks for assets, messages, theme tokens, and style policy |
| `npm run test:e2e` | Production build + Playwright route, keyboard, and EN/FR visual tests |
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
    landing/
      components/         landing composition and sections, styled with Tailwind utilities
        shared/           `PosterStage`, the poster coordinate system
      content/            site configuration, product catalog, explicit asset manifest and visual-variants.ts
  i18n/                   shared typed routing and request configuration
  lib/utils.ts            shared utility functions
messages/                 English source messages and French translations
public/mochi/             app assets plus the optimized transparent hero cutout
tests/e2e/                Playwright routes, keyboard, and visual baselines
design/references/        design reference images (untracked, never deployed)
```

Principles:

- **Server first.** The complete landing page and its translations are server-rendered. Only the
  Dynamic Island countdown hydrates; the burger and FAQ use native `details` elements.
- **Locale first.** English uses the canonical `/` route and French uses `/fr`. Metadata, alternate
  links, sitemap entries, accessibility labels and JSON-LD are generated from the same typed messages.
- **Feature ownership is explicit.** Landing components, catalog data, site configuration and the
  static asset manifest live under `features/landing`; reusable primitives and locale infrastructure
  stay shared.
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
- Poster geometry uses `PosterStage` plus `calc(N*var(--u))` arbitrary values.
- Breakpoints: `max-poster` (<=1099px), `max-nav` (<=760px), `max-tablet` (<=640px), `max-phone`
  (<=480px), `min-wide` (>=1441px). Never use arbitrary `max-[...]` variants.
- Shadows and filters with `calc()` use arbitrary properties (`[box-shadow:...]`), never `shadow-[...]`.
- Per-ID colors come from typed static records in `visual-variants.ts`.
- Style `Button asChild` links through `Button`'s `className`.

## Visual tests

17 Playwright tests cover routes, keyboard behavior and EN/FR full-page baselines at 1600, 1440,
1099, 759 and 390px, plus the open phone menu. Baselines change only for reviewed, intentional
visual changes (`npm run test:e2e:update`).

## Before launch

- Set `APP_STORE_URL` in `src/features/landing/content/landing.ts`.
- Set `NEXT_PUBLIC_SITE_URL` to the final production origin.
- Add the production privacy, terms and help routes to the footer.
