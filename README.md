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
| `npm test` | Vitest unit tests for domain rules, routing and message parity |

## Architecture

```
src/
  app/
    [locale]/             localized layout, metadata and landing-page route
    globals.css           Tailwind theme, semantic tokens and shared motion
  components/
    maquette/             banded composition and its scoped poster-coordinate visual system
    marketing/            locale-aware marketing primitives
    seo/                  localized schema.org graph
    ui/                   source-owned shadcn primitives and brand icons
  content/                locale-independent product catalog and site configuration
  i18n/                   typed routing, request configuration and navigation helpers
  lib/change-timer.ts     pure reducer and formatting rules (+ tests)
messages/                 English source messages and French translations
public/mochi/             app assets plus the optimized transparent hero cutout
```

Principles:

- **Server first.** The complete landing page and its translations are server-rendered. Only the
  Dynamic Island countdown hydrates; the burger and FAQ use native `details` elements.
- **Locale first.** English uses the canonical `/` route and French uses `/fr`. Metadata, alternate
  links, sitemap entries, accessibility labels and JSON-LD are generated from the same typed messages.
- **Facts are separate from language.** Stable product IDs and asset facts live in `content/`, while
  all active user-facing copy lives in `messages/`.
- **Search and agent readable.** Product facts are visible in semantic HTML and mirrored in honest
  `MobileApplication` and `FAQPage` structured data. The site includes a manifest, robots policy
  and sitemap; there is no agent-only copy that could drift from what people see.
- **Design-system layers.** Tailwind exposes semantic shadcn and Mochi brand tokens. Complex poster
  coordinates stay scoped in CSS Modules; ordinary layout and reusable primitives use Tailwind.
- **Responsive by composition.** Desktop bands preserve the dense maquette, while phone layouts
  intentionally stack and resize—without horizontal scrolling or hidden essential content.
- **Privacy and medical honesty**, as in the app: no analytics on the site, no cycle wording on the
  mock Lock Screen, and predictions are never presented as birth control.

## Before launch

- Set `APP_STORE_URL` in `src/content/mochi.ts`.
- Set `NEXT_PUBLIC_SITE_URL` to the final production origin.
- Add the production privacy, terms and help routes to the footer.
