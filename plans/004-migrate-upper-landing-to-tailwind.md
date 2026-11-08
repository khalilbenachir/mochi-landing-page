# Plan 004: Migrate the upper landing (Hero, Island, Mood, Flavors) to Tailwind utilities

> **Executor instructions**: Migrate one section at a time and run its gate before the
> next. Preserve markup semantics, next-intl calls, assets, and poster coordinates. A
> screenshot difference is a STOP unless this plan names it as approved. Do not update
> `plans/README.md` and never edit anything under `plans/`.
>
> **Working mode (owner's instruction)**: work directly in
> `/Users/khalil/Desktop/mochi-landing-page` on branch `main`. **No branches, worktrees,
> commits, stashes, and never `git add` to the real index.** Earlier plans are applied as
> uncommitted changes (HEAD stays `0fa9683`); `git status` is intentionally noisy. Never
> revert or clean anything you did not change. The 18 untracked `public/mochi/*.webp`
> files belong to the owner. The baseline is the snapshot tree `7b069b8d` (working tree
> after plan 003).
>
> **Changed-files command** (temporary index; never touches the real index):
>
> ```sh
> ( export GIT_INDEX_FILE="${TMPDIR:-/tmp}/plan-check.idx"; rm -f "$GIT_INDEX_FILE"; git read-tree 7b069b8d && git add -A && git diff --cached --name-status 7b069b8d -- . ':!plans'; rm -f "$GIT_INDEX_FILE" )
> ```
>
> **Drift check (run first)**: the changed-files command → empty output. Otherwise STOP.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: `plans/003-centralize-the-tailwind-theme.md` (DONE; uncommitted)
- **Category**: migration
- **Planned at**: commit `0fa9683`, 2026-11-08; **refreshed** against snapshot `7b069b8d`, 2026-11-08

## Why this matters

Hero, Island, Mood, and Flavors contain every hard pattern on the page: the poster
coordinate system, three responsive regimes, a mobile menu, hover motion, keyframes,
per-ID colors, and components shared with lower sections. Migrating them first proves
the Tailwind architecture before plan 005 repeats it for the rest of the page. Plan 003
already moved every color into named theme tokens, so this plan only translates
structure — and fixes three owner-approved bugs the migration exposes (see "Approved
visual changes").

## Current state (verified at snapshot `7b069b8d`)

### Files

| File | Lines | Notes |
|---|---:|---|
| `src/features/landing/components/sections/HeroSection.module.css` | 182 | header, nav, mobile menu, App Store badge, copy, art |
| `src/features/landing/components/sections/HeroSection.tsx` | 168 | exports `AppleLogo`, `FreeSticker`, `AppStoreBadge`, `HERO_MASCOT`, `HeroSection` |
| `src/features/landing/components/sections/IslandSection.module.css` | 120 | |
| `src/features/landing/components/sections/IslandSection.tsx` | 76 | exports `StatusIcons` (default `className = styles.statusIcons`) |
| `src/features/landing/components/sections/IslandCountdown.tsx` | 20 | receives `${styles.timer} tnum` (global `.tnum` class) |
| `src/features/landing/components/sections/MoodSection.module.css` | 143 | `@keyframes squish`, `.mood:hover img` animation, `--m` variable |
| `src/features/landing/components/sections/MoodSection.tsx` | 170 | already uses `visual-variants.ts` for colors |
| `src/features/landing/components/sections/FlavorsSection.module.css` | 97 | `.card:hover img` transform, a `max-width: 640px` query |
| `src/features/landing/components/sections/FlavorsSection.tsx` | 44 | already uses `FLAVOR_PILL_CLASS` |

**Cross-section consumers you must not break** (they stay on CSS Modules until plan 005):

- `ClosingSection.tsx:6` imports `AppleLogo` and `FreeSticker` from `HeroSection`.
  Closing passes its own module classes; its module hides the sticker's rays with
  `.free > svg + svg { display: none; }` and sizes the art with `.free svg:first-child`.
  Keep both components' props/markup API identical.
- `MoodSection.tsx` and `PredictionSection.tsx:41` import `StatusIcons` from
  `IslandSection`; Prediction passes its own module class. Keep the
  `className` default-parameter API.

### The poster stage pattern (identical base in all ten section modules)

```css
/* HeroSection.module.css:18-25 */
.stage {
  --u: calc(100cqw / 1024);
  position: relative;
  width: min(100%, 1440px);
  margin-inline: auto;
  aspect-ratio: 1024 / 326;          /* differs per section */
  container-type: inline-size;
}
/* HeroSection.module.css:122, inside @media (max-width: 1099px) */
.stage { --u: 1px; aspect-ratio: auto; container-type: normal; padding: 0 clamp(20px, 4vw, 40px); }
```

Every coordinate is `calc(N * var(--u))`: maquette pixels on wide screens, real pixels
(`--u: 1px`) below 1100px. Comparison/Plans (plan 005) use a 800-unit grid with
`width: min(100%, 1200px)`. Some elements redefine `--u` locally in media queries
(e.g. Island `.phone`, Flavors `.grid`, Mood `.mood { --u: var(--m) }`).

### Cascade facts (advisor verified) — read before Step 1

1. `src/app/globals.css:226-266` holds **unlayered** element rules: `*` box-sizing,
   `html`, `body`, `a { color: var(--pink-ink) }`, `a:hover { color: var(--pink-deep) }`,
   `img, video { display: block; max-width: 100% }`, and `section[id]`. Tailwind 4 puts
   utilities in `@layer utilities`, and **unlayered CSS beats layered CSS regardless of
   specificity**. Until these rules are layered, `text-*` on any `<a>`, and `hidden` /
   `max-w-none` / `inline-*` on any `<img>`, silently lose. Step 1 fixes this first.
2. That bug is visible today: `LocaleSwitcher` (desktop header) gives inactive links
   `text-white`, but the global `a` rule wins, so "FR" on the English page renders dark
   pink on the pink band (≈1.2:1 contrast).
3. CSS Module rules are also unlayered. During the migration a still-unmigrated module
   rule will beat a utility on the same element/property; that is why sections migrate
   whole, and why Closing's `.free > svg + svg { display:none }` keeps hiding the sticker
   rays even after `FreeSticker`'s internals become utilities.

### Tailwind 4.1.18 behaviors (advisor verified with the installed compiler)

- Breakpoint tokens (from plan 003): `max-poster:` ≡ `max-width: 1099px`, `max-nav:` ≡
  760px, `max-phone:` ≡ 480px, `min-wide:` ≡ `min-width: 1441px`. Named `max-*` variants
  are emitted widest-first, so phone overrides nav overrides poster — same as the module
  source order.
- **Arbitrary `max-[641px]:` is emitted *before* all named breakpoints** and would lose
  to `max-poster:`. Step 2 therefore adds a named `--breakpoint-tablet: 40.0625rem`
  (`max-tablet:` ≡ `max-width: 640px`). Never use arbitrary `max-[…]`/`min-[…]` variants.
- **`shadow-[…]`, `text-shadow-[…]`, and `drop-shadow-[…]` misparse a `calc()` offset as
  the shadow color** (e.g. emit `0 var(--tw-shadow-color, calc(3 * var(--u))) 0 …`).
  Always use arbitrary properties instead: `[box-shadow:…]`, `[text-shadow:…]`,
  `[filter:drop-shadow(…)]`. These compile verbatim.
- Math in arbitrary values is auto-spaced: `w-[calc(390*var(--u))]` →
  `calc(390 * var(--u))`; `[--u:calc(min(100vw-32px,760px)/445)]` →
  `calc(min(100vw - 32px, 760px) / 445)`. Use `_` for any other literal space.
- `@container` → `container-type: inline-size`; `max-poster:@container-normal` →
  `container-type: normal` inside the poster media query.
- Keyframes declared inside `@theme static` are emitted; `animate-squish` works with
  `group-hover:`.
- `hover:` / `group-hover:` are wrapped in `@media (hover: hover)`: no sticky hover on
  touch screens. This is accepted.
- Arbitrary descendant variants work and carry the extra specificity:
  `[&_a]:text-ink-navy` → `.\[\&_a\]\:text-ink-navy a { … }` (0,1,1), which beats a
  plain utility on the `<a>` itself (0,1,0).

### Approved visual changes (the owner decided these; nothing else may change)

1. **Locale link contrast** (Step 1): after layering the global rules, the inactive
   desktop locale link becomes white as `LocaleSwitcher` intends. Exactly four baselines
   change, in the header switcher area only: `en-desktop-1440x1200`,
   `fr-desktop-1440x1200`, `en-poster-transition-1099x1000`,
   `fr-poster-transition-1099x1000`.
2. **Mobile menu: App Store button** (Step 5): today
   `.mobileMenu nav > a:not(.storeBadge)` (HeroSection.module.css:157) also matches the
   dark `AppStoreBadge` (no element has class `storeBadge`), giving it link padding, a
   bottom border, and dark text `rgb(23,38,71)` on its near-black background — the text
   is invisible. Fixed design: the badge keeps its own dark styling (white text), plus
   `margin-top: 8px; justify-content: center` (the intent of line 158).
3. **Mobile menu: language switcher** (Step 5): today `.mobileMenu nav { position:
   absolute; top: 56px; display: grid; … background: white; box-shadow … }` (line 156)
   also matches the `<nav>` rendered *inside* `LocaleSwitcher`, turning it into a
   floating card that covers the "Flavors" and "Privacy" links. Fixed design: the
   dropdown styles apply only to the menu's own `<nav>`; the switcher is the inline
   pill from `.localeMobile` (line 44-47) below the links.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass (baseline: 5 files, 12 tests) |
| Build | `npm run build` | exit 0 |
| Browser + visual | `npm run test:e2e` | `13 passed` at baseline (builds first; port 3100) |
| Targeted visual | `npm run build && npx playwright test --grep "<regex>"` | listed tests pass |
| Literal scan | `rg -n '#[0-9A-Fa-f]{3,8}\b\|rgba?\(' src --glob '!src/app/globals.css' --glob '!src/app/platform-colors.ts'` | no output |

When a screenshot fails, Playwright writes `test-results/**/<name>-actual.png`,
`-expected.png`, and `-diff.png`. **Open the `-diff.png` with your Read tool** (it shows
images) to see where pixels changed.

## Scope

**In scope**:

- `src/app/globals.css` — Step 1 (layer the element rules at lines 226-266) and Step 2
  (add `--breakpoint-tablet`, `--animate-squish`, `@keyframes squish`). Nothing else.
- `src/app/theme.test.ts` — Step 2 extension only.
- `src/features/landing/components/shared/PosterStage.tsx` (create)
- `src/features/landing/components/sections/{Hero,Island,Mood,Flavors}Section.tsx`,
  `IslandCountdown.tsx`
- Their four `*.module.css` files — delete each after its section is migrated.
- `tests/e2e/landing.spec.ts` — add the new visual cases in Steps 3 and 5 only.
- `tests/e2e/landing.spec.ts-snapshots/` — the 4 approved updates (Step 1) and the new
  baselines `{en,fr}-wide-1600x1200` (Step 3), `{en,fr}-phone-menu-390x844` (Step 5).

**Out of scope** (do NOT touch):

- Prediction, Privacy, Comparison, Plans, Account, FAQ, Closing sections and their
  modules; `LandingPage.tsx`; `LandingPage.module.css` (plan 005).
- `globals.css` class rules (`.wrap`, `.tnum`, `.visually-hidden`, `.eyebrow`, `.h2`,
  `.lead`, animation classes), its other keyframes, and the reduced-motion block
  (plan 005). `.tnum` stays defined even though Island stops using it.
- `src/components/marketing/LocaleSwitcher.tsx`, `src/components/ui/**`,
  `messages/**`, `public/**`, `package.json`, `package-lock.json`.
- Existing baselines other than the four approved in Step 1.

## Git workflow

- No git writes: no `commit`, `add` (real index), `stash`, `checkout`, `switch`,
  `restore`, `reset`, `branch`, `worktree`.
- **Checkpoint** = run the changed-files command and confirm every path is in scope.

## Translation guide (applies to Steps 5-8)

Worked example — HeroSection `.copy` (module lines 75, 131, 162):

```css
.copy { position: absolute; z-index: 5; left: calc(58 * var(--u)); top: calc(50 * var(--u)); width: calc(390 * var(--u)); }
@media (max-width: 1099px) { .copy { position: relative; left: auto; top: auto; width: auto; max-width: 640px; margin: 18px auto 0; text-align: center; } }
@media (max-width: 760px)  { .copy { margin-top: 10px; } }
```

becomes, directly on the element:

```tsx
<div className="absolute z-5 left-[calc(58*var(--u))] top-[calc(50*var(--u))] w-[calc(390*var(--u))] max-poster:relative max-poster:left-auto max-poster:top-auto max-poster:w-auto max-poster:max-w-[640px] max-poster:mx-auto max-poster:mt-[18px] max-poster:mb-0 max-poster:text-center max-nav:mt-[10px]">
```

Rules:

1. **Every declaration of every live rule is carried over** to the element(s) its
   selector matches, with the same breakpoint. Descendant selectors (`.copy h1`,
   `.copy h1 span`, `.nav a`) become utilities written on those child elements in JSX.
   Use arbitrary descendant variants (`[&_a]:…`, `[&>svg:first-child]:…`) **only** when
   the target element is rendered by a component you must not change
   (`LocaleSwitcher`'s links, `FreeSticker`'s inner `<svg>`).
2. **Numbers stay exact**: `calc(58 * var(--u))` → `[calc(58*var(--u))]`. Keep `var(--u)`
   / `var(--m)` references; local overrides become arbitrary properties on the same
   element, e.g. `max-poster:[--u:var(--m)]`.
3. **Media queries**: 1099 → `max-poster:`, 760 → `max-nav:`, 640 → `max-tablet:`,
   480 → `max-phone:`, `min-width: 1441px` → `min-wide:`,
   `prefers-reduced-motion: reduce` → `motion-reduce:`.
4. **Exact-semantics properties use arbitrary properties verbatim**: `transform`,
   `filter`, `box-shadow`, `text-shadow`, gradients, multi-value `inset`,
   `padding-inline: a b`, `grid-template-*`. Example:
   `transform: scaleX(-1) rotate(10deg)` → `[transform:scaleX(-1)_rotate(10deg)]` (do
   **not** use `-scale-x-100 rotate-10`: Tailwind's separate `scale`/`rotate` properties
   compose in a different order). Shadows: never `shadow-[…]`/`drop-shadow-[…]`/
   `text-shadow-[…]` (see Tailwind facts).
5. **Simple 1:1 properties use normal utilities**: position, display, `left/top/right/
   bottom`, width/height, margin/padding, gap, z-index, overflow, `font-size`
   (`text-[…]`), `font-weight` (`font-[950]`), `line-height` (`leading-[…]`),
   `letter-spacing` (`tracking-[…]`), text-align, white-space, flex/grid alignment,
   border-radius, `aspect-[1024/326]`, `@container`.
6. **Colors only via tokens**: `bg-hero-band`, `text-sun`, `fill-…`, `border-…`, or
   `var(--color-…)` inside an arbitrary property. Local module aliases (`--hero-bg`,
   `--ink`, `--sun`, `--petal`, `--band-bg`, `--screen`, `--drop`) disappear: use the
   token they point to (the module's first lines show the mapping). No hex/rgba literal
   may appear in TSX.
7. **Hover/motion**: `.x:hover` → `hover:`; `.parent:hover child` → `group` on the
   parent and `group-hover:` on the child. `transition: transform 0.2s var(--spring,
   ease)` → `[transition:transform_0.2s_var(--spring,ease)]`.
8. **Static class strings only**. Write plain string literals in `className`. Use `cn`
   (from `@/lib/utils`) only to merge a `className` prop or a condition. CVA for real
   variants (`AppStoreBadge` compact/dark). Never build class names from variables.
9. **Delete the module** only when `rg -n 'styles\.' <Section>.tsx` and
   `rg -n '<Section>\.module\.css' src` both print nothing.

## Steps

### Step 0: Confirm the baseline

```sh
cd /Users/khalil/Desktop/mochi-landing-page
# drift check (changed-files command) → empty
npm ls tailwindcss            # → tailwindcss@4.1.18 (if not, run: npm ci --ignore-scripts)
shasum package.json package-lock.json > "${TMPDIR:-/tmp}/plan004-frozen.sha"
npm run typecheck && npm run lint && npm test && npm run test:e2e
```

**Verify**: drift check empty; 12 unit tests pass; `13 passed`. If anything fails here,
STOP. If port 3100 is busy, STOP (do not kill processes).

### Step 1: Layer the global element rules (approved change 1)

In `src/app/globals.css`, wrap exactly these existing rules — `*, *::before, *::after`,
`html`, `body`, `a`, `a:hover`, `img, video`, and `section[id]` — in one
`@layer base { … }` block placed where they are now. Move `section[id]` (currently after
`.wrap`) into that block; leave `.wrap`, `.tnum`, and every other class rule, keyframe,
and the reduced-motion `@media` block exactly as they are.

**Verify**:
1. `npm run test:e2e` → exactly 4 failures: `visual: en desktop 1440x1200`,
   `visual: fr desktop 1440x1200`, `visual: en poster-transition 1099x1000`,
   `visual: fr poster-transition 1099x1000`. Open each `-diff.png`: the changed pixels
   must be only the language switcher in the header's top-right area. If any other test
   fails or any other area differs, STOP.
2. Update only those four:
   `npm run build && npx playwright test --grep "visual: (en|fr) (desktop|poster-transition) " --update-snapshots`
3. `npm run test:e2e` → `13 passed`.
4. Open the new `tests/e2e/landing.spec.ts-snapshots/en-desktop-1440x1200-chromium-darwin.png`
   with Read and confirm the inactive "FR" link is now white.
5. Checkpoint.

### Step 2: Theme additions and test extension

1. In the `@theme static` block of `globals.css`, after `--breakpoint-nav`, add
   `--breakpoint-tablet: 40.0625rem;` and extend the breakpoint comment with
   `max-tablet = 640px`.
2. In the same block, add the Mood animation (copied exactly from
   `MoodSection.module.css`; the module copy is deleted in Step 7):

```css
  /* Motion */
  --animate-squish: squish 0.55s var(--spring, ease-out);
  @keyframes squish {
    0% { transform: scale(1, 1); }
    30% { transform: scale(1.12, 0.86); }
    55% { transform: scale(0.94, 1.08); }
    80% { transform: scale(1.03, 0.98); }
    100% { transform: scale(1, 1); }
  }
```

3. In `src/app/theme.test.ts`:
   - "compiles breakpoints…": add `"max-tablet:hidden"` and assert `width < 40.0625rem`.
   - "has no dead landing tokens": a token also counts as used when any `.ts`/`.tsx`
     file contains `var(--color-<name>)` (arbitrary values such as
     `[filter:drop-shadow(…var(--color-hero-sticker-shadow))]`).
   - "has no undefined color tokens": also scan `.tsx` files for `var(--color-…)`
     references and require each to be declared.

**Verify**: `npm test` → all pass. Then prove the TSX check bites: add the line
`const probe = "[color:var(--color-zz-missing)]";` below the imports of
`FlavorsSection.tsx`, run `npm test` → the undefined-token test fails; delete the line,
rerun → passes. Report both outputs. Checkpoint.

### Step 3: Add wide-screen visual coverage (before migrating)

The existing cases never render `min-wide:` (≥1441px). In `tests/e2e/landing.spec.ts`,
add `{ name: "wide", width: 1600, height: 1200 }` to `visualCases`. Record only the new
baselines on the current (pre-migration) code:

```sh
npm run build && npx playwright test --grep "visual: (en|fr) wide" --update-snapshots=missing
npm run test:e2e   # → 15 passed
npm run test:e2e   # → 15 passed again (stability)
```

**Verify**: exactly two new PNGs exist (`en-wide-1600x1200-chromium-darwin.png`,
`fr-wide-…`); no other snapshot file changed (`shasum` them before/after or check
`ls -l` timestamps). Checkpoint.

### Step 4: Create `PosterStage`

Create `src/features/landing/components/shared/PosterStage.tsx`:

```tsx
import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The maquette's poster coordinate system. On wide screens `--u` is 1/grid of the stage
 * width, so every `calc(N*var(--u))` coordinate scales as one poster; below the poster
 * breakpoint the stage becomes normal flow and `--u` is 1px. Sections pass their
 * aspect ratio and small-screen padding through `className`.
 */
const posterStage = cva(
  "relative mx-auto @container max-poster:@container-normal max-poster:aspect-auto max-poster:[--u:1px]",
  {
    variants: {
      grid: {
        "1024": "w-[min(100%,1440px)] [--u:calc(100cqw/1024)]",
        "800": "w-[min(100%,1200px)] [--u:calc(100cqw/800)]",
      },
    },
    defaultVariants: { grid: "1024" },
  },
);

export function PosterStage({ grid, className, ...props }: ComponentProps<"div"> & VariantProps<typeof posterStage>) {
  return <div className={cn(posterStage({ grid }), className)} {...props} />;
}
```

**Verify**: `npm run typecheck && npm run lint` → exit 0. (It gains consumers in Step 5.)

### Step 5: Migrate HeroSection, including the mobile-menu fixes

Apply the translation guide to every rule in `HeroSection.module.css`. Specifics:

- Section: `<section id="top">` gets `relative overflow-hidden bg-hero-band text-white`
  plus the ≥1441px vignette as
  `min-wide:before:absolute min-wide:before:inset-0 min-wide:before:content-[''] min-wide:before:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_60%,var(--color-hero-vignette))]`.
- Stage: `<PosterStage className="aspect-[1024/326] max-poster:px-[clamp(20px,4vw,40px)]">`.
- `AppStoreBadge`: keep its signature and add an optional `className` merged last with
  `cn`. Express `.badge`/`.badgeCompact`/`.badgeDark` as a CVA with `compact` and
  `dark` boolean variants so later rules override earlier ones exactly as in the
  module. Context rules become `className` from the caller: `.actions .badge` (lines
  135, 170) on the hero CTA; `.headerCta` wrapper stays a `<div>` with its own
  utilities.
- `FreeSticker`: unchanged API. Its inner `Rays` gets the `.stickerRays` utilities
  (`absolute right-[calc(-20*var(--u))] top-[calc(4*var(--u))] w-[calc(22*var(--u))]
  text-sun [transform:scaleX(-1)_rotate(10deg)]`; no `display` utility, so Closing's
  module keeps hiding it). The hero's `.free` rules (lines 88-89, 136) become the
  `className` the hero passes, with the inner-svg rules as
  `[&>svg:first-child]:block [&>svg:first-child]:w-full [&>svg:first-child]:h-auto [&>svg:first-child]:[filter:drop-shadow(0_calc(2*var(--u))_0_var(--color-hero-sticker-shadow))]`.
  Do not move the drop-shadow inside `FreeSticker` (Closing must not gain it).
- `AppleLogo`: unchanged.
- Desktop locale switcher: `<LocaleSwitcher className="ml-auto max-nav:hidden" />`.
- Mobile menu (`<details>`): `hidden! max-nav:relative max-nav:z-30 max-nav:ml-auto max-nav:block!`.
  `summary`: the line-153 utilities under `max-nav:` plus
  `list-none [&::-webkit-details-marker]:hidden`; its three `<i>` get line 155.
  **The dropdown `<nav>` (the menu's own, direct child of `<details>`) alone** gets
  line 156 (`absolute right-0 top-[56px] grid w-[min(290px,calc(100vw-40px))]
  overflow-hidden p-2 rounded-[20px] bg-white [box-shadow:0_20px_50px_var(--color-hero-mobile-menu-nav-shadow)]`).
  **Only the five `MOBILE_NAV` links** get line 157 (`px-[14px] py-3 border-b
  border-hero-menu-link-border text-hero-menu-link-text font-[900] no-underline`).
  Mobile `LocaleSwitcher` className = line 44-47:
  `mt-2 mx-auto mb-[2px] border-hero-locale-mobile-border bg-hero-locale-mobile-bg [&_a]:text-ink-navy [&_a:hover]:text-ink-navy [&_a[aria-current=page]]:bg-brand-coral [&_a[aria-current=page]]:text-white`.
  Dark badge in the menu: `<AppStoreBadge dark className="mt-2 justify-center" />`.
  (These three bullets are approved changes 2 and 3.)
- Delete `HeroSection.module.css` per rule 9.

Then add menu coverage to `tests/e2e/landing.spec.ts`: for `en` and `fr`, a test
`visual: ${locale} phone menu 390x844` with the same setup as the existing visual tests
(clock, viewport 390x844, goto, remove `nextjs-portal`, `waitForPageAssets`), then
`await page.locator("#top details summary").click();`,
`await expect(page.locator("#top details")).toHaveAttribute("open", "");`, and
`await expect(page).toHaveScreenshot(\`${locale}-phone-menu-390x844.png\`, { animations: "disabled" });`
(viewport only — no `fullPage`). Record with
`npm run build && npx playwright test --grep "phone menu" --update-snapshots=missing`.

**Verify**:
1. `npm run test:e2e` → `17 passed` with **no** baseline updates other than the two new
   menu PNGs. Any failure in the 15 existing visual cases is a STOP.
2. Open `en-phone-menu-390x844-chromium-darwin.png` and confirm: five links (Features,
   Flavors, Privacy, Mochi Plus, FAQ) all visible; the EN/FR pill sits inline below
   them (horizontal, not a floating card); the dark App Store button's text and Apple
   logo are white and readable. Describe what you see in your report.
3. Keyboard: the existing keyboard test still passes (it is in the 17).
4. `npm run typecheck && npm run lint` → exit 0. Checkpoint.

### Step 6: Migrate IslandSection and IslandCountdown

Use `<PosterStage className="aspect-[1024/160] …">`. Keep the phone/island mockup,
countdown semantics, status icons, and localized label. `StatusIcons` keeps
`({ className = "<utility string>" }: { className?: string })` — the default becomes the
translated `.statusIcons` utilities so Mood/Prediction overrides still replace it.
`IslandCountdown`: the caller passes the translated `.timer` utilities plus
`tabular-nums` instead of `${styles.timer} tnum`. Local `--u` overrides (module lines
103, 116) become arbitrary properties on the same elements. Delete the module.

**Verify**: `npm run test:e2e` → `17 passed`; `rg -n '\btnum\b' src/features` → no
output; typecheck/lint exit 0. Checkpoint.

### Step 7: Migrate MoodSection

`<PosterStage className="aspect-[1024/132] …">`. `.mood` elements get `group`; their
`img` gets `group-hover:animate-squish motion-reduce:group-hover:animate-none`. `--m`
and `.mood { --u: var(--m) }` become arbitrary properties under `max-poster:` on the
same elements. Pass Mood's translated `.signal` utilities to `StatusIcons`. Keep the
`visual-variants.ts` color classes already in place. Delete the module (its
`@keyframes squish` now lives in the theme).

**Verify**: `npm run test:e2e` → `17 passed`; typecheck/lint exit 0. Checkpoint.

### Step 8: Migrate FlavorsSection

`<PosterStage className="aspect-[1024/212] …">`. `.card` gets `group`; its `img` gets
the transition and `group-hover:[transform:translateY(calc(-3*var(--u)))_rotate(-4deg)]`
plus `motion-reduce:group-hover:[transform:none]`. The 640px query uses `max-tablet:`.
Grid-local `--u` overrides become `max-poster:[--u:…]` / `max-tablet:[--u:…]`. The pill
keeps `FLAVOR_PILL_CLASS[flavor.id]`. Delete the module.

**Verify**: `npm run test:e2e` → `17 passed`; typecheck/lint exit 0. Checkpoint.

### Step 9: Upper-slice architecture check and final verification

```sh
rg -n 'module\.css|style=\{|#[0-9A-Fa-f]{3,8}\b|rgba?\(' src/features/landing/components/sections/{Hero,Island,Mood,Flavors}Section.tsx src/features/landing/components/sections/IslandCountdown.tsx src/features/landing/components/shared
rg -n 'max-\[|min-\[|(^|[" ])(shadow|drop-shadow|text-shadow)-\[' src/features/landing
rg -n '\$\{[^}]*\}' src/features/landing/components --glob '*.tsx' | rg 'className'
ls src/features/landing/components/sections/*.module.css
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
shasum -c "${TMPDIR:-/tmp}/plan004-frozen.sha" | grep -v ': OK$'
git log --oneline -1 && git diff --cached --name-only
# then the changed-files command
```

**Verify**: the three `rg` commands print nothing (the third: no template-literal class
names in migrated files — if a pre-existing one in an out-of-scope section prints,
list it in your report instead); `ls` lists exactly the six out-of-scope section
modules (Prediction, Privacy, Comparison, Plans, Faq, Closing); all npm commands pass with `17 passed`; `shasum` prints nothing; HEAD `0fa9683`; nothing
staged; every changed path is in scope.

## Test plan

- Visual: 17 Playwright tests — the original 13 (4 baselines updated in Step 1 only),
  `{en,fr}-wide-1600x1200` (recorded pre-migration, so they guard the migration), and
  `{en,fr}-phone-menu-390x844` (recorded after the approved menu fix; reviewer inspects).
- Unit: `theme.test.ts` now also proves `max-tablet:` compiles and counts TSX `var()`
  references for the dead/undefined token checks (probe shown failing once).
- Existing keyboard/FAQ/landmark/route tests unchanged and passing.

## Done criteria

- [ ] Hero, Island, Mood, Flavors, and IslandCountdown contain no `styles.`, module
  import, `style={…}`, hex/rgba literal, or template-literal class name.
- [ ] Their four CSS Modules are deleted; `PosterStage` exists and is used by all four.
- [ ] `globals.css`: element rules inside one `@layer base`; `--breakpoint-tablet`,
  `--animate-squish`, `@keyframes squish` added; nothing else changed.
- [ ] No arbitrary `max-[…]`/`min-[…]` variants and no `shadow-[`/`drop-shadow-[`/
  `text-shadow-[` utilities in `src/features/landing`.
- [ ] Only the 4 approved baselines changed; 4 new baselines added; `17 passed`.
- [ ] typecheck, lint, unit tests, build all pass; `package.json`/lock unchanged.
- [ ] No git writes.

## STOP conditions

- Baseline not green, or port 3100 busy.
- Step 1 produces any failure beyond the four named tests, or a diff outside the header
  language switcher.
- Any of the original 15 visual cases fails after a migration step and two correction
  attempts don't fix it.
- The menu-open screenshot does not match the fixed design described in Step 5.
- A migration seems to need a change to an out-of-scope file (including Closing or
  Prediction to keep `FreeSticker`/`AppleLogo`/`StatusIcons` working).
- A rule seems to require a dynamically generated class name or a new color token.

## Maintenance notes

- `PosterStage` is the single owner of the `--u` system; plan 005 uses `grid="800"` for
  Comparison/Plans. Section-specific aspect ratios and padding stay at the call site.
- Keep coordinates next to the element they position; don't extract one-off geometry.
- Reviewers: compare rendered output, not utility-string length. Reject arbitrary
  `max-[…]` breakpoints and `shadow-[…]`-family utilities with `calc()` (both verified
  pitfalls in Tailwind 4.1.18).
