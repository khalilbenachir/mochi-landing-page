# Plan 003: Centralize every landing color in the Tailwind theme

> **Executor instructions**: Follow every step in order and run each verification gate
> before moving on. This plan changes color *values and their source* only — never
> geometry, typography, layout, selectors, copy, or assets. If a STOP condition occurs,
> stop and report rather than improvising. Do not update `plans/README.md` (your reviewer
> maintains it).
>
> **Working mode (owner's instruction)**: work directly in the main checkout
> `/Users/khalil/Desktop/mochi-landing-page` on branch `main`. **No branches, no
> worktrees, no commits, no stashes, and never `git add` to the real index.** Plans 001,
> 006, 002 are already applied there as *uncommitted* changes (HEAD stays `0fa9683`), so
> `git status` is intentionally noisy; ignore it. The baseline is the snapshot tree
> `11fb4ad5`, which is the exact working-tree content before this plan.
>
> **Changed-files command** (used for the drift check and every checkpoint; it uses a
> temporary index file and never touches the real index):
>
> ```sh
> ( export GIT_INDEX_FILE="${TMPDIR:-/tmp}/plan-check.idx"; rm -f "$GIT_INDEX_FILE"; git read-tree 11fb4ad5 && git add -A && git diff --cached --name-status 11fb4ad5 -- . ':!plans'; rm -f "$GIT_INDEX_FILE" )
> ```
>
> **Drift check (run first, before any edit)**: the changed-files command → empty output.
> If it prints anything, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/002-remove-dead-code-assets-and-set-feature-boundary.md` (DONE; applied uncommitted)
- **Category**: migration, architecture
- **Planned at**: commit `0fa9683`, 2026-11-08; **refreshed** against working-tree snapshot
  `11fb4ad5` (identical to the content of former commit `9cc48a0`), 2026-11-08

## Why this matters

The project is migrating from CSS Modules to Tailwind utility classes (plans 004–005).
Today the live landing defines ~99 unique hex colors and 22 `rgba()` colors as literals
scattered through 11 CSS Modules and 9 TSX files, while the Tailwind theme in
`src/app/globals.css` describes an app palette that the landing barely uses (32 of its
variables have zero consumers). If sections were converted to Tailwind first, every
literal would become an arbitrary utility like `bg-[#feab29]` — the same problem in a new
syntax.

After this plan: every landing color is a **named Tailwind theme token** declared once in
`globals.css`; CSS Modules and TSX reference tokens instead of literals; per-ID color data
lives in typed static class records; the only literals outside `globals.css` are browser
metadata colors in one tested module. Plans 004–005 then become mechanical translations
(`background: var(--color-flavors-band)` → `bg-flavors-band`).

## Current state (verified at snapshot `11fb4ad5`)

### `src/app/globals.css`

- Lines 7–77: one `:root` block. Lines 8–25 are shadcn roles (`--background`, `--primary`,
  `--accent`, `--ring`, `--radius`, …). Lines 27–69 are an app palette. Lines 71–76 are
  `--font`, `--font-app`, `--spring`, `--section-space`, `--section-space-tight`,
  `--page-gutter`.
- Lines 79–111: `@theme inline { … }` mapping shadcn roles, seven `--color-mochi-*`
  tokens, `--font-sans`, a radius scale, and `--ease-spring`.
- Lines 113–255: base element styles, global helper classes (`.wrap`, `.tnum`,
  `.visually-hidden`, `.eyebrow`, `.h2`, `.lead`, `.jelly`, …), and keyframes. **Plan 005
  owns all of these — do not touch them.**

Excerpt (lines 79–111, abridged):

```css
@theme inline {
  --color-background: var(--background);
  /* … other shadcn roles … */
  --color-mochi-pink: var(--pink);
  --color-mochi-pink-ink: var(--pink-ink);
  --color-mochi-pink-soft: var(--pink-soft);
  --color-mochi-teal: var(--teal);
  --color-mochi-indigo: var(--indigo);
  --color-mochi-orange: var(--orange);
  --color-mochi-mint: var(--mint);
  --color-mochi-navy: var(--navy);
  --font-sans: var(--font);
  --radius-sm: calc(var(--radius) - 4px);
  /* … */
  --ease-spring: var(--spring);
}
```

**Dead variables** (the advisor verified zero `var(--name)` consumers anywhere in `src`,
and zero utility consumers for the mapped ones):

- `:root` variables (32): `--pink-tint`, `--pink-soft`, `--raspberry`, `--teal`,
  `--teal-light`, `--teal-ink`, `--teal-text`, `--teal-tint`, `--follicular`, `--indigo`,
  `--indigo-tint`, `--orange`, `--orange-ink`, `--orange-deep`, `--orange-tint`, `--mint`,
  `--mint-ink`, `--grey-600`, `--grey-500`, `--grey-300`, `--grey-200`, `--grey-150`,
  `--grey-100`, `--privacy-sky`, `--card-rose`, `--card-dark`, `--card-ink`, `--island-bg`,
  `--island-grey`, `--font-app`, `--section-space`, `--section-space-tight`.
- `@theme inline` mappings (6): `--color-mochi-pink-soft`, `--color-mochi-teal`,
  `--color-mochi-indigo`, `--color-mochi-orange`, `--color-mochi-mint`,
  `--color-mochi-navy`.

**Live and must stay**: all shadcn roles (lines 8–25); `--pink` + `--color-mochi-pink`
(the manifest's theme color); `--pink-ink` + `--color-mochi-pink-ink` (used by
`src/components/marketing/LocaleSwitcher.tsx:29` as `text-mochi-pink-ink`); `--pink-deep`
(`a:hover`); `--navy` (`body`); `--navy-deep`, `--body`, `--page-gutter` (used by global
classes plan 005 will remove); `--font`, `--spring`.

### Color literals in the landing feature

`rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(' src/features/landing src/components/ui` currently
reports ~178 lines. Per file (match counts): HeroSection.module.css 27,
PredictionSection.module.css 19, IslandSection.module.css 16, ComparisonSection.module.css
14, MoodSection.tsx 14, MoodSection.module.css 12, PrivacySection.module.css 12,
ClosingSection.module.css 11, FaqSection.module.css 8, FlavorsSection.module.css 7,
PlansSection.module.css 7, LandingPage.module.css 6, PredictionSection.tsx 5,
PrivacySection.tsx 5, HeroSection.tsx 2 (+1 false positive, see below), PlansSection.tsx 3,
Button.tsx 2, FlavorsSection.tsx 2, ComparisonSection.tsx 2, FaqSection.tsx 1,
IslandSection.tsx 1, ClosingSection.tsx 1.

Several modules declare **local color aliases** at the top of their `.band` rule:

```
FlavorsSection.module.css:6   --band-bg: #feab29;   :7 --ink: #26304a;  :8 --sun: #ffe14d;
FaqSection.module.css:6       --band-bg: #fef2e6;   :7 --ink: #172a4f;
IslandSection.module.css:6    --band-bg: #4743b1;   :7 --sun: #ffd93d;  :8 --screen: #f5cee0;  :9 --drop: #f2497a;
HeroSection.module.css:8      --hero-bg: #f44c80;   :9 --ink: #0b121c;  :10 --petal: #fbc4e1;  :11 --sun: #ffd93d;
MoodSection.module.css:6      --band-bg: #2fb6e3;   :7 --ink: #26304a;
PrivacySection.module.css:6   --band-bg: #213459;   :7 --gold: #f2c62f; :8 --ink: #1d2b4a;
PredictionSection.module.css:6 --band-bg: #bff3e6;  :7 --ink: #172a4f;  :8 --pink: #ef4a7a;  :9 --sun: #ffd93d;
ClosingSection.module.css:5   .band { --pink: #f74c80; --ink: #0b121c; … background: var(--pink …
```

Note: `var(--pink)` inside PredictionSection/ClosingSection modules resolves to the
**local** alias, not the global `--pink`. Leave alias names as they are.

`rgba()` values appear inside `box-shadow`, `filter: drop-shadow(...)`, `text-shadow`,
and `radial-gradient(...)`, almost always with container-relative geometry such as
`0 calc(2 * var(--u)) 0 rgba(110, 16, 48, 0.22)`. Because the geometry is not fixed, the
**color** becomes a token; the shadow expression stays in the module.

Gradients with literal stops: `IslandSection.module.css:63` (linear),
`PredictionSection.module.css:85` (conic, 8 stops), `HeroSection.module.css:117` (radial).

### Inline color styles and color data in TSX

```tsx
// FlavorsSection.tsx:7-9, 39
/** Pill tint, as in the maquette: each starter has its own color, everything you earn is pink. */
const PILL: Partial<Record<FlavorId, string>> = { strawberry: "#fbe9a8", classic: "#fbd5cf", matcha: "#d4f0c8" };
const PILL_BY_KIND: Record<UnlockKind, string> = { starter: "#fbe9a8", streak: "#fcd5de", petals: "#fbd0e3", challenge: "#fcd2dd" };
…
<span className={`${styles.pill} ${flavor.kind === "challenge" ? styles.pillWrap : ""}`} style={{ background: PILL[flavor.id] ?? PILL_BY_KIND[flavor.kind] }}>

// PredictionSection.tsx:53-55, 74-75
<span><i style={{ background: "#ef4a7a" }} />{t("period")}</span>
<span><i style={{ background: "#fbc6dc" }} />{t("fertileWindow")}</span>
<span><i style={{ background: "#9b6be6" }} />{t("ovulation")}</span>
<div><dt><i style={{ background: "#9b7bea" }} />{t("cycleLength")}</dt><dd>…</dd></div>
<div><dt><i style={{ background: "#f2558a" }} />{t("nextPeriod")}</dt><dd>…</dd></div>

// MoodSection.tsx:15-16 (MoodFace), 88-99 (data), 124, 133
function MoodFace({ tone }: { tone: "joy" | "calm" | "meh" | "sad" }) {
  const ink = tone === "joy" ? "#fff" : "#26304a";   // used as stroke={ink} on <g> and fill={ink} on some children
const SYMPTOMS = [ { id: "cramps", bg: "#fde0ea" }, { id: "bloating", bg: "#ece2fb" },
                   { id: "headache", bg: "#ece2fb" }, { id: "tired", bg: "#ece2fb" } ] as const;
const FACES = [ { tone: "joy", bg: "#f2497a" }, { tone: "calm", bg: "#fbdcea" },
                { tone: "meh", bg: "#ffffff" }, { tone: "sad", bg: "#dcccf6" } ] as const;
<li key={face.tone} style={{ background: face.bg }}>
<span style={{ background: s.bg }}>
```

SVG presentation-attribute literals (`fill="#…"` / `stroke="#…"`): MoodSection.tsx:58,
64, 73, 78, 81; ClosingSection.tsx:53; PlansSection.tsx:20, 21, 29;
IslandSection.tsx:36; PrivacySection.tsx:47, 49, 51, 89 (two paths), 109 (two elements);
HeroSection.tsx:65, 66; ComparisonSection.tsx:22, 29; FaqSection.tsx:30.

`HeroSection.tsx:10` (`href: "#features"`) is **not** a color. The `\b` in this plan's
regex excludes it; confirm it never appears in your verification output.

**Cascade facts the advisor verified** (these make the conversion safe):

- No CSS Module rule sets `background` on any element that currently has an inline color
  style (`.legend i`, `.facts i`, `.faces li`, `.symptoms li > span`, `.pill` all set only
  geometry/radius).
- No CSS Module sets `fill` or `stroke` anywhere.
- Therefore replacing an inline `background` with a `bg-*` utility, or an SVG
  `fill="#…"` attribute with a `fill-*` utility **on the same element**, renders
  identically. (General rule for later: Tailwind 4 utilities live in `@layer utilities`,
  so any unlayered CSS Module rule targeting the same property would win over them.)

### `src/components/ui/Button.tsx`

Only `variant="unstyled" size="unstyled"` is used (HeroSection.tsx:77,
ClosingSection.tsx:23). `ButtonLink`, the `block`/`large` variant groups, and the
landing-specific variants `primary`, `light`, `island`, `dim` have no consumers. Raw colors:

```ts
primary: "bg-primary text-primary-foreground shadow-[0_8px_0_var(--pink-deep)] hover:-translate-y-0.5",   // line 12
light: "bg-white text-indigo-800 shadow-[0_8px_0_#2c2878] hover:-translate-y-0.5",                         // line 16
island: "bg-[#ff8fb1] text-[#2a0e17] shadow-[0_8px_0_#c9607f] hover:-translate-y-0.5",                     // line 17
```

### Platform metadata colors (cannot use CSS variables)

```ts
// src/app/manifest.ts:13-14
background_color: "#FDE3EA",   // equals --accent in globals.css
theme_color: "#F2577C",        // equals --pink in globals.css
// src/app/[locale]/layout.tsx:72-74
export const viewport: Viewport = {
  themeColor: "#FDE3EA",       // equals --accent
};
```

Keep these values exactly (the differing manifest/viewport theme colors are existing
product behavior, not something to fix here).

### Tailwind facts (advisor verified against the installed 4.1.18)

- `@theme static { … }` emits **every** variable into `:root` even when no utility uses
  it, so CSS Modules can safely reference `var(--color-…)` tokens. (A plain `@theme`
  block may prune unused variables; `@theme inline` does not emit its own variables.)
- Breakpoint `--breakpoint-poster: 68.75rem` generates `max-poster:` =
  `@media (width < 68.75rem)` = old `max-width: 1099px`. To reproduce `max-width: 480px`
  (≤ 480) exactly, use `30.0625rem` (481px → `width < 481px`); for `max-width: 760px`,
  use `47.5625rem`; for `min-width: 1441px`, use `--breakpoint-wide: 90.0625rem`
  (`min-wide:` → `width >= 1441px`).
- `import { compile } from "tailwindcss"` works in Node and can compile the real
  `globals.css` (see Step 6 for the exact loader).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm ci --ignore-scripts` | exit 0; `tailwindcss` 4.1.18 |
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass (baseline: 2 files, 4 tests) |
| Build | `npm run build` | exit 0 |
| Browser + visual | `npm run test:e2e` | `13 passed` (builds first; serves on port 3100) |
| Literal scan | `rg -n '#[0-9A-Fa-f]{3,8}\b\|rgba?\(' <paths>` | see each step |

Never run `npm run test:e2e:update` and never modify files under `tests/`. A screenshot
failure means your change altered rendering; fix the change, not the baseline.

## Suggested executor toolkit

- Tailwind 4 is CSS-first: no `tailwind.config.*` file may be created.
- Use the `vercel-react-best-practices` skill only if unsure about component edits; this
  plan needs none of its performance patterns.

## Token naming conventions (apply exactly)

- Every color token uses the `--color-` namespace so Tailwind generates
  `bg-*`, `text-*`, `fill-*`, `stroke-*`, `border-*`, `from-*`, `to-*` utilities.
- Name = `--color-<scope>-<role>[-<qualifier>]`, lowercase kebab-case.
  - **Section scope** for a value used by one section: `landing` (page root
    and account band in `LandingPage.module.css`), `hero`, `island`, `mood`, `flavors`,
    `prediction`, `privacy`, `comparison`, `plans`, `faq`, `closing`.
  - **Shared group** when the *same value* plays the *same role* in ≥ 2 sections:
    `sun` (the `#ffd93d` yellow), `ink-<descriptor>` (text inks such as `#172a4f`,
    `#1d2b4a`, `#0b121c`, `#26304a`), `cycle-<role>` (period/fertile/ovulation data
    colors), `brand-<descriptor>` (repeated brand pinks).
- **Never merge two different values** into one token, even if they look alike
  (`#ef4a7a`, `#f2558a`, `#f2497a`, `#f44c80`, `#f74c80` are five tokens).
- The same value used for unrelated roles may get two tokens; prefer one shared token
  only when the role genuinely matches.
- Shadow/filter colors: `--color-<scope>-shadow[-<qualifier>]` holding the `rgba(...)`
  literal. Gradient stops: `--color-<scope>-<thing>-<n>` (e.g. `prediction-ring-1` …
  `prediction-ring-8`).
- `#fff` / `#ffffff` → no token: use the CSS keyword `white` in CSS Modules and
  Tailwind's built-in `white` (`bg-white`, `fill-white`, `text-white`) in TSX. `#000` →
  `black` likewise. Every other literal, including `#111` and `#eee`, gets a token.
- A role name based on the element it styles is valid and expected
  (e.g. `--color-faq-summary-border`, `--color-comparison-row-divider`).

Anchor examples (use these exact names for these values):

| Value | Where | Token |
|---|---|---|
| `#f44c80` | Hero `--hero-bg` | `--color-hero-band` |
| `#4743b1` | Island `--band-bg` | `--color-island-band` |
| `#2fb6e3` | Mood `--band-bg` | `--color-mood-band` |
| `#feab29` | Flavors `--band-bg` | `--color-flavors-band` |
| `#bff3e6` | Prediction `--band-bg` | `--color-prediction-band` |
| `#213459` | Privacy `--band-bg` | `--color-privacy-band` |
| `#fef2e6` | FAQ `--band-bg` | `--color-faq-band` |
| `#f74c80` | Closing `--pink` | `--color-closing-band` |
| `#f7f4ef` | `LandingPage.module.css:1` | `--color-landing-canvas` |
| `#fff4e8` | `LandingPage.module.css:13` | `--color-landing-account-band` |
| `#ffd93d` | Hero/Island/Prediction `--sun` | `--color-sun` |
| `#ef4a7a` | Prediction legend "period" (+ other pinks of the same value) | `--color-cycle-period` |
| `#fbc6dc` | Prediction legend "fertile window" | `--color-cycle-fertile` |
| `#9b6be6` | Prediction legend "ovulation" | `--color-cycle-ovulation` |
| `#9b7bea` | Prediction fact "cycle length" | `--color-cycle-length` |
| `#f2558a` | Prediction fact "next period" | `--color-cycle-next-period` |
| `#fbe9a8` / `#fbd5cf` / `#d4f0c8` | Flavor pills strawberry/starter, classic, matcha | `--color-flavors-pill-starter`, `--color-flavors-pill-classic`, `--color-flavors-pill-matcha` |
| `#fcd5de` / `#fbd0e3` / `#fcd2dd` | Flavor pills streak, petals, challenge | `--color-flavors-pill-streak`, `--color-flavors-pill-petals`, `--color-flavors-pill-challenge` |

For `#ef4a7a`: it also appears in PlansSection/PrivacySection check-circle icons and
modules. If those uses are the same brand pink rather than the cycle "period" role, give
them `--color-brand-<descriptor>` with the same value instead of reusing `cycle-period`.

## Scope

**In scope** (the only files you may modify or create):

- `src/app/globals.css` — remove dead variables; add the `@theme static` token block.
- `src/app/platform-colors.ts` (create), `src/app/platform-colors.test.ts` (create)
- `src/app/manifest.ts`, `src/app/[locale]/layout.tsx` — only to import the platform
  colors from `platform-colors.ts`.
- `src/app/theme.test.ts` (create)
- `src/components/ui/Button.tsx`
- `src/features/landing/content/visual-variants.ts` (create),
  `src/features/landing/content/visual-variants.test.ts` (create)
- `src/features/landing/components/LandingPage.module.css` and
  `src/features/landing/components/sections/*.module.css` — **value-only** edits:
  replace color literals with `var(--color-…)` / `white` / `black`. Nothing else.
- `src/features/landing/components/sections/*.tsx` — **color-only** edits: inline color
  styles → static classes; SVG color attributes → static classes; color data → imports
  from `visual-variants.ts`.

**Out of scope** (do NOT touch, even though they look related):

- Any non-color CSS declaration, selector, media query, or module file name; deleting
  CSS Modules (plans 004–005).
- `globals.css` lines 113–255 (base styles, global classes, keyframes), `--font`,
  `--spring`, shadcn role values (plan 005).
- The three non-color inline styles `style={flip ? { transform: "scaleX(-1)" } : undefined}`
  in ComparisonSection.tsx:9, PlansSection.tsx:9, ClosingSection.tsx:11 (plan 005).
- Shared primitives (`PosterStage`, `AppStoreBadge`, rays, hearts) — not part of this plan.
- `tests/**` including snapshots; `package.json`; `package-lock.json`; `messages/**`;
  `public/**`; `src/components/marketing/**`; `components.json`.

## Git workflow

- **No git writes at all**: no `git commit`, `git add` (real index), `git stash`,
  `git checkout`/`git switch`/`git restore`/`git reset`, `git branch`, `git worktree`.
- Wherever a step says **Checkpoint**, run the changed-files command from the header
  and confirm every listed path is in the in-scope list. Paste its output in your report
  for the final checkpoint.
- Do not push, merge, or open a PR.

## Steps

### Step 0: Confirm the baseline

```sh
cd /Users/khalil/Desktop/mochi-landing-page
# drift check: the changed-files command from the header → must print nothing
npm ci --ignore-scripts
( find tests -type f -exec shasum {} + ; shasum package.json package-lock.json ) > "${TMPDIR:-/tmp}/plan003-frozen.sha"
npm run typecheck && npm run lint && npm test && npm run test:e2e
```

**Verify**: drift check empty; `git log --oneline -1` → `0fa9683 Merge pull request #3 …`
(HEAD never moves); unit tests `4 passed`; e2e `13 passed`. If e2e fails here, STOP (the
failure is environmental, not yours). If port 3100 is already in use, STOP and report;
do not kill other processes.

### Step 1: Inventory every literal and assign a token (no repo changes)

Run:

```sh
rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(' src/features/landing src/components/ui
```

For every match, decide its token per the naming conventions. Keep the working table in
a scratch file **outside the repo** (e.g. `$TMPDIR/plan003-tokens.md`); it is never
committed. Group by section.

**Verify**: every line from the command above has a row in your table with either a
token name, `white`/`black`, or "Button variant to delete" (Step 4).

### Step 2: Declare the tokens in `globals.css`

1. Delete the 32 dead `:root` variables and 6 dead `@theme inline` mappings listed in
   "Current state". Keep everything listed as live.
2. Directly after the closing `}` of `@theme inline`, add **one** block:

```css
/*
 * Landing design tokens. Every color used by the landing lives here and nowhere else
 * (except browser metadata in src/app/platform-colors.ts). `static` makes Tailwind emit
 * every variable so CSS Modules can reference them while the migration is in progress.
 */
@theme static {
  /* Breakpoints: max-phone ≡ max-width 480px, max-nav ≡ 760px, max-poster ≡ 1099px,
     min-wide ≡ min-width 1441px. */
  --breakpoint-phone: 30.0625rem;
  --breakpoint-nav: 47.5625rem;
  --breakpoint-poster: 68.75rem;
  --breakpoint-wide: 90.0625rem;

  /* Shared */
  --color-sun: #ffd93d;
  /* … ink-*, cycle-*, brand-* … */

  /* Hero */
  --color-hero-band: #f44c80;
  /* … one comment-headed group per section, in page order … */
}
```

Write literal values in lowercase hex exactly as they appear in source (expand nothing;
`#eee` stays `#eee`). `rgba(...)` values are copied verbatim.

**Verify**:
- `npm run build` → exit 0.
- `grep -o -- '--color-flavors-band:[^;]*' .next/static/css/*.css` → prints
  `--color-flavors-band:#feab29` (minified). If it prints nothing, `@theme static` is not
  emitting tokens: STOP.
- `npm run test:e2e` → `13 passed` (no consumer changed yet, so nothing should move).
- Checkpoint (changed-files command; all paths in scope).

### Step 3: Reference tokens from every CSS Module (value-only)

In `LandingPage.module.css` and each `sections/*.module.css`, replace each literal with
its token:

- `background: #f7f4ef;` → `background: var(--color-landing-canvas);`
- Local aliases keep their names: `--band-bg: #feab29;` → `--band-bg: var(--color-flavors-band);`
- Shadows/filters keep geometry:
  `filter: drop-shadow(0 calc(2 * var(--u)) 0 rgba(110, 16, 48, 0.18));` →
  `filter: drop-shadow(0 calc(2 * var(--u)) 0 var(--color-hero-shadow-free));`
- Gradient stops: replace each stop color, keep angles/positions.
- `var(--pink, #f74c80)` (ClosingSection) → `var(--pink, var(--color-closing-band))`.
- `#fff`/`#ffffff` → `white`; `#000` → `black`.

Change nothing else on any line. Do one module at a time.

**Verify**:
- `rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(' src/features/landing --glob '*.css'` → no output.
- `npm run test:e2e` → `13 passed`. If a screenshot fails, the diff image in
  `test-results/` shows where; fix the substitution (usually a typo'd token name).
- Checkpoint (changed-files command; all paths in scope).

### Step 4: Trim `Button.tsx` to the shadcn contract

Before editing, prove the variants are unused:

```sh
rg -n 'ButtonLink|variant="(primary|light|island|dim)"|\bblock\b|\blarge\b' src --glob '*.tsx' --glob '!src/components/ui/Button.tsx'
```

→ no output (if anything prints, keep that variant and note it in your report).

Then remove the `primary`, `light`, `island`, `dim` variants, the `block` and `large`
variant groups (and their props in `Button`), and the `ButtonLink` export. Keep `Slot`,
`cva`, `cn`, `asChild`, and the variants `default`, `secondary`, `outline`, `ghost`,
`link`, `unstyled` plus all `size` values — they use only semantic shadcn tokens.

**Verify**:
- `rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(|var\(--' src/components/ui` → no output.
- `npm run typecheck && npm run lint` → exit 0.
- Checkpoint (changed-files command; all paths in scope).

### Step 5: Move TSX color data into typed static variants

1. Create `src/features/landing/content/visual-variants.ts`. Every value is a complete,
   literal Tailwind class string (never `` `bg-${x}` ``, never string concatenation):

```ts
import type { FlavorId } from "./product-catalog";

export const MOOD_TONES = ["joy", "calm", "meh", "sad"] as const;          // render order
export type MoodTone = (typeof MOOD_TONES)[number];
export const SYMPTOM_IDS = ["cramps", "bloating", "headache", "tired"] as const; // render order
export type SymptomId = (typeof SYMPTOM_IDS)[number];
export const CYCLE_LEGEND_IDS = ["period", "fertileWindow", "ovulation"] as const;
export type CycleLegendId = (typeof CYCLE_LEGEND_IDS)[number];
export const CYCLE_FACT_IDS = ["cycleLength", "nextPeriod"] as const;
export type CycleFactId = (typeof CYCLE_FACT_IDS)[number];

/** Pill tint: each starter has its own color; everything you earn is pink. */
export const FLAVOR_PILL_CLASS: Record<FlavorId, string> = {
  strawberry: "bg-flavors-pill-starter",
  classic: "bg-flavors-pill-classic",
  matcha: "bg-flavors-pill-matcha",
  ube: "bg-flavors-pill-streak",
  mango: "bg-flavors-pill-streak",
  sesame: "bg-flavors-pill-streak",
  yuzu: "bg-flavors-pill-streak",
  chocolate: "bg-flavors-pill-streak",
  hojicha: "bg-flavors-pill-streak",
  sakura: "bg-flavors-pill-petals",
  peach: "bg-flavors-pill-challenge",
  coconut: "bg-flavors-pill-challenge",
};

export const MOOD_FACE_CLASS: Record<MoodTone, { chip: string; ink: string }> = { /* chip = bg-*, ink = text-* */ };
export const SYMPTOM_CHIP_CLASS: Record<SymptomId, string> = { /* bg-* */ };
export const CYCLE_LEGEND_CLASS: Record<CycleLegendId, string> = { /* bg-cycle-* */ };
export const CYCLE_FACT_CLASS: Record<CycleFactId, string> = { /* bg-cycle-* */ };
```

   The `FLAVOR_PILL_CLASS` table above reproduces today's
   `PILL[id] ?? PILL_BY_KIND[kind]` resolution for the catalog in
   `product-catalog.ts`; double-check it against that file.
   `MOOD_FACE_CLASS.meh.chip` is `"bg-white"` (was `#ffffff`); `MOOD_FACE_CLASS.joy.ink` is
   `"text-white"` (was `#fff`).

2. **FlavorsSection.tsx**: delete `PILL`/`PILL_BY_KIND`; remove the `style` prop; add
   `FLAVOR_PILL_CLASS[flavor.id]` to the pill's className using `cn` from `@/lib/utils`.
   Drop the now-unused `UnlockKind` import if TypeScript/ESLint flags it.
3. **PredictionSection.tsx**: replace each `<i style={{ background: "…" }} />` with
   `<i className={CYCLE_LEGEND_CLASS.period} />` etc. Keep markup order and text identical.
4. **MoodSection.tsx**: drop the `bg` fields from `FACES`/`SYMPTOMS` (or iterate
   `MOOD_TONES`/`SYMPTOM_IDS` directly — same order). Faces: `<li className={MOOD_FACE_CLASS[tone].chip}>`.
   `MoodFace`: delete `ink`; use `stroke="currentColor"` on the `<g>`, `fill="currentColor"`
   where children used `fill={ink}`, and put `MOOD_FACE_CLASS[tone].ink` on the `<svg>`.
   Symptoms: `<span className={SYMPTOM_CHIP_CLASS[s.id]}>`.
5. **SVG attribute literals** (all files listed in "Current state"): on the *same
   element*, remove the `fill="#…"`/`stroke="#…"` attribute and add a static class:
   `fill="#ec3f78"` → `className="fill-mood-symptom-cramps"` (token name per your table);
   `stroke="#fff"` → `className="stroke-white"`. Keep `fill="none"` attributes. If the
   element already has a `className`, append with `cn(...)`. A `<g>` attribute becomes a
   class on that `<g>` (fill/stroke inherit to children exactly as before).

**Verify**:
- `rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(' src/features/landing src/components/ui` → no output.
- `rg -n 'style=\{' src/features/landing` → exactly 3 lines, all the `scaleX(-1)` flips.
- `rg -n '\$\{' src/features/landing/content/visual-variants.ts` → no output.
- `npm run typecheck && npm run lint && npm run test:e2e` → exit 0 / `13 passed`.
- Checkpoint (changed-files command; all paths in scope).

### Step 6: Centralize platform colors and add contract tests

1. Create `src/app/platform-colors.ts`:

```ts
/**
 * Browser and OS metadata cannot resolve CSS variables, so these are the only color
 * literals allowed outside src/app/globals.css. Each value must equal the named
 * globals.css variable; platform-colors.test.ts enforces it.
 */
export const PLATFORM_COLORS = {
  /** <meta name="theme-color">; equals `--accent` (Tailwind `accent`). */
  browserTheme: { value: "#FDE3EA", cssVariable: "--accent" },
  /** Web manifest background_color; equals `--accent`. */
  manifestBackground: { value: "#FDE3EA", cssVariable: "--accent" },
  /** Web manifest theme_color; equals `--pink` (Tailwind `mochi-pink`). */
  manifestTheme: { value: "#F2577C", cssVariable: "--pink" },
} as const;
```

   Use `PLATFORM_COLORS.manifestBackground.value` / `.manifestTheme.value` in
   `manifest.ts` and `PLATFORM_COLORS.browserTheme.value` in `layout.tsx`'s `viewport`.

2. Create `src/app/platform-colors.test.ts`: read `src/app/globals.css` with
   `node:fs`, and for each entry assert the declaration `<cssVariable>: <hex>` exists and
   its hex equals `value` case-insensitively.

3. Create `src/app/theme.test.ts` with three tests. Compile helper (advisor-verified):

```ts
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { compile } from "tailwindcss";

const require = createRequire(import.meta.url);
const root = process.cwd();
const globalsPath = path.join(root, "src/app/globals.css");

async function buildUtilities(candidates: string[]) {
  const compiler = await compile(readFileSync(globalsPath, "utf8"), {
    base: path.dirname(globalsPath),
    async loadStylesheet(id, base) {
      const file =
        id === "tailwindcss" ? require.resolve("tailwindcss/index.css")
        : id === "tw-animate-css" ? path.join(root, "node_modules/tw-animate-css/dist/tw-animate.css")
        : require.resolve(id, { paths: [base] });
      return { path: file, base: path.dirname(file), content: readFileSync(file, "utf8") };
    },
  });
  return compiler.build(candidates);
}
```

   - **Utilities compile**: build `["max-phone:hidden", "max-nav:hidden",
     "max-poster:hidden", "min-wide:block", ...every class in every visual-variants
     record]` and assert the output contains `width < 30.0625rem`, `width < 47.5625rem`,
     `width < 68.75rem`, `width >= 90.0625rem`, and `.${cls} {` (or `.${cls}{`) for each
     variant class. If `compile` cannot be imported under Vitest, STOP and report.
   - **No undefined tokens**: every `var(--color-…)` referenced in
     `src/**/*.module.css` is declared in `globals.css`.
   - **No dead tokens**: every `--color-…` declared inside the `@theme static` block is
     referenced somewhere in `src` other than globals.css — either as
     `var(--color-<name>)` in a `.css` file or as a utility
     `(bg|text|fill|stroke|border|from|via|to|outline|ring|decoration)-<name>` (word
     boundary after) in a `.ts`/`.tsx` file. Use `readdirSync(dir, { recursive: true })`.

4. Create `src/features/landing/content/visual-variants.test.ts`: the keys of
   `FLAVOR_PILL_CLASS` equal `FLAVOR_CATALOG` IDs; the keys of the mood, symptom, legend,
   and fact records equal their `*_IDS`/`MOOD_TONES` arrays; every value is a non-empty
   string without `${`.

**Verify**:
- `npm test` → all pass (more than the baseline 4 tests).
- Prove the dead-token test bites: temporarily add `--color-zz-probe: #123456;` to the
  `@theme static` block, run `npm test` → the dead-token test fails; remove it, rerun →
  passes. Report both outputs.
- Checkpoint (changed-files command; all paths in scope).

### Step 7: Final verification

```sh
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(' src --glob '!src/app/globals.css' --glob '!src/app/platform-colors.ts'
shasum -c "${TMPDIR:-/tmp}/plan003-frozen.sha" | grep -v ': OK$'
ls tailwind.config.* 2>/dev/null
grep -cE '^\s*\.[A-Za-z]' src/app/globals.css
git log --oneline -1
git diff --cached --name-only
# then the changed-files command from the header
```

**Verify**: all npm commands exit 0 with `13 passed` e2e; the `rg` prints nothing; the
`shasum`, `ls`, and `git diff --cached` lines print nothing; the class-selector count is
`14` (unchanged); HEAD is still `0fa9683`; every path printed by the changed-files
command is in the in-scope list.

## Test plan

- `src/app/theme.test.ts`: breakpoints and every variant utility compile from the real
  `globals.css`; no undefined `var(--color-…)` in modules; no dead landing tokens.
- `src/app/platform-colors.test.ts`: metadata literals equal their named variables.
- `src/features/landing/content/visual-variants.test.ts`: records are exhaustive over
  their ID sets and contain only static strings.
- Existing `assets.test.ts`, `messages.test.ts`, and all 13 Playwright tests (including 8
  full-page EN/FR screenshots at 1440/1099/759/390) pass unchanged — this is the proof
  that no color value changed.

## Done criteria

- [ ] `rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(' src --glob '!src/app/globals.css' --glob '!src/app/platform-colors.ts'` → no output.
- [ ] `rg -n 'style=\{' src/features/landing` → exactly the 3 `scaleX(-1)` lines.
- [ ] The 32 dead variables and 6 dead mappings are gone; all live ones remain.
- [ ] `globals.css` has one `@theme static` block containing four breakpoints and every
  landing color token; class-selector line count is still 14.
- [ ] `Button.tsx` contains no literal colors or `var(--…)`; only shadcn variants + `unstyled`.
- [ ] `npm test` passes including the three new test files; the dead-token test was shown
  to fail on a probe token.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e` (13 passed) all succeed.
- [ ] `package.json`, `package-lock.json`, and `tests/**` are byte-identical to Step 0
  (`shasum -c` all OK); no `tailwind.config.*` exists.
- [ ] No git writes: HEAD is `0fa9683`, nothing staged, no new branch/worktree/stash.

## STOP conditions

Stop and report (with the command output) if:

- The Step 0 baseline is not green, or port 3100 is occupied.
- `@theme static` does not emit tokens into the built CSS (Step 2 grep prints nothing).
- A screenshot still fails after two attempts to correct the substitution in that step.
- Preserving rendering would require changing a non-color declaration, a selector, or
  a media query.
- A literal's usage gives no way to name a role (cannot tell what it colors).
- `import { compile } from "tailwindcss"` does not work under Vitest.
- Any step appears to require changing `package.json`/`package-lock.json`, `tests/`, or
  another out-of-scope file.

## Maintenance notes

- New colors must be added as `--color-*` tokens in the `@theme static` block — never as
  literals or arbitrary values like `bg-[#abc]`. The dead-token and undefined-token tests
  keep the vocabulary exact as plans 004–005 move consumers from modules to utilities.
- Variant records must stay complete static strings so Tailwind's scanner can see them;
  reviewers should reject template-literal class names.
- When plans 004–005 translate media queries, `max-width: 1099px` → `max-poster:`,
  `480px` → `max-phone:`, `760px` → `max-nav:`, `min-width: 1441px` → `min-wide:`.
  **Correction (verified during plan 004 refresh):** do not use arbitrary
  `max-[641px]:` — Tailwind 4.1.18 emits arbitrary breakpoints before named ones, so
  they lose to `max-poster:`. Plan 004 adds a named `--breakpoint-tablet: 40.0625rem`
  (`max-tablet:` ≡ `max-width: 640px`); the 520px query lives only in dead global
  classes plan 005 removes.
- `platform-colors.ts` is the only allowed literal-color file outside `globals.css`;
  plan 005's style check must allow exactly these two files.
