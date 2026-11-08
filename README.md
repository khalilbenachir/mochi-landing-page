# Mochi – landing page

The marketing site for **Mochi**, the gamified period tracker for iPhone.
Next.js 15 (App Router) · React 19 · TypeScript (strict) · CSS Modules · Vitest.

Every animation is taken from the app: Mochi's jelly bounce and mood clips, the pad change pill on
Home, the Dynamic Island (minimal / compact / expanded) and the Lock Screen Live Activity, all driven
by one live demo timer you can play with.

## Getting started

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:3000
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
    sections/             one folder-less component + CSS module per page section
    ui/                   Button, Phone, MochiClip, ChangeFaces, Icon: small reusable pieces
  features/
    change-reminder/      ChangeReminderProvider (shared timer) + Live Activity parts
  content/mochi.ts        copy, flavors, moods, asset paths: everything taken from the app
  lib/change-timer.ts     pure reducer and formatting rules (+ tests)
public/mochi/             app assets: clips (HEVC + H.264 fallback + posters), faces, flavors
```

Principles:

- **Server first.** `page.tsx` and most sections are server components that ship no JavaScript.
  Only what moves with the timer (Home screen, reminder sheet, Dynamic Island, Lock Screen) is a
  client component, wrapped in one `ChangeReminderProvider`.
- **One source of truth for the demo.** `lib/change-timer.ts` mirrors the app's `ChangeRules`
  (phases, rounding, overnight minimums) as a pure reducer. The provider only dispatches and ticks;
  components only render. Rules are unit tested.
- **Content is data.** Copy, flavors and unlock rules live in `content/mochi.ts` and come from the
  iOS app's String Catalogs and `MochiCore`, so the site never promises what the app doesn't do.
- **Design tokens.** Colors in `globals.css` are the app's `MochiColor` palette. Type is SF Rounded on
  Apple devices, Nunito elsewhere (self-hosted through Fontsource, no request to Google).
- **Motion that respects people.** Scroll reveals use CSS scroll-driven animations (no JS). Clips
  play only on screen. `prefers-reduced-motion` turns every animation off.
- **Privacy and medical honesty**, as in the app: no analytics on the site, no cycle wording on the
  mock Lock Screen, and predictions are never presented as birth control.

## Before launch

- Set `APP_STORE_URL` in `src/content/mochi.ts`.
- Replace `[YOUR PRICE]` in `src/components/sections/Pricing.tsx` with the RevenueCat prices.
- Point the footer links (privacy policy, terms, help) at the real pages.
