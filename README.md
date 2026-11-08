# Mochi – landing page

The marketing site for **Mochi**, the gamified period tracker for iPhone.
Next.js 15 (App Router) · React 19 · TypeScript (strict) · CSS Modules · Vitest.

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
| `npm run build` | Static export to `out/` (deploy to Vercel, Netlify, GitHub Pages, S3…) |
| `npm run start` | Serve a production build (after `next build` without `output: "export"`) |
| `npm run lint` | ESLint (Next.js core web vitals + TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests for the timer rules |

To preview the exported site: `npx serve out`.

## Architecture

```
src/
  app/                    layout (fonts, metadata), page (composition only), globals.css (tokens + keyframes)
  components/
    maquette/             the banded landing-page composition and its responsive visual system
    seo/                  schema.org graph for the app and visible FAQ content
    ui/                   small reusable primitives and icons
  content/                typed product, comparison, plan and FAQ facts
  lib/change-timer.ts     pure reducer and formatting rules (+ tests)
public/mochi/             app assets plus the optimized transparent hero cutout
```

Principles:

- **Server first.** The complete landing page is server-rendered. The burger and FAQ use native
  `details` elements, so the visual page adds no client-side React state or hydration work.
- **Content is data.** Copy, flavors and unlock rules live in `content/mochi.ts` and come from the
  iOS app's String Catalogs and `MochiCore`, so the site never promises what the app doesn't do.
- **Search and agent readable.** Product facts are visible in semantic HTML and mirrored in honest
  `MobileApplication` and `FAQPage` structured data. The export includes a manifest, robots policy
  and sitemap; there is no agent-only copy that could drift from what people see.
- **Design tokens.** Colors in `globals.css` are the app's `MochiColor` palette. Type is SF Rounded on
  Apple devices, Nunito elsewhere (self-hosted through Fontsource, no request to Google).
- **Responsive by composition.** Desktop bands preserve the dense maquette, while phone layouts
  intentionally stack and resize—without horizontal scrolling or hidden essential content.
- **Privacy and medical honesty**, as in the app: no analytics on the site, no cycle wording on the
  mock Lock Screen, and predictions are never presented as birth control.

## Before launch

- Set `APP_STORE_URL` in `src/content/mochi.ts`.
- Set `NEXT_PUBLIC_SITE_URL` to the final production origin.
- Point the footer links (privacy policy, terms, help) at the real pages.
