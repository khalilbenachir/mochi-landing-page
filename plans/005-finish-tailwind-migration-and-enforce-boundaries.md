# Plan 005: Migrate the lower landing sections to Tailwind and remove every CSS Module

> **Executor instructions**: Migrate one section at a time and run its gate before the
> next. Preserve markup semantics, next-intl calls, assets, focus behavior, and poster
> coordinates. **No visual change is approved in this plan**: any screenshot difference
> is a STOP after two correction attempts. Do not update `plans/README.md` and never
> edit anything under `plans/`.
>
> **Working mode (owner's instruction)**: work directly in
> `/Users/khalil/Desktop/mochi-landing-page` on branch `main`. **No branches, worktrees,
> commits, stashes, PRs, and never `git add` to the real index.** Earlier plans are
> applied as uncommitted changes (HEAD stays `0fa9683`); `git status` is intentionally
> noisy. Never revert or clean anything you did not change. The 18 untracked
> `public/mochi/*.webp` files belong to the owner. The baseline is the snapshot tree
> `c36ee76a` (working tree after plan 004).
>
> **Changed-files command** (temporary index; never touches the real index):
>
> ```sh
> ( export GIT_INDEX_FILE="${TMPDIR:-/tmp}/plan-check.idx"; rm -f "$GIT_INDEX_FILE"; git read-tree c36ee76a && git add -A && git diff --cached --name-status c36ee76a -- . ':!plans'; rm -f "$GIT_INDEX_FILE" )
> ```
>
> **Drift check (run first)**: the changed-files command → empty output. Otherwise STOP.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: `plans/004-migrate-upper-landing-to-tailwind.md` (DONE; uncommitted)
- **Category**: migration
- **Planned at**: commit `0fa9683`, 2026-11-08; **refreshed and narrowed** against
  snapshot `c36ee76a`, 2026-11-08. The enforcement half of the original plan (globals
  cleanup, policy checks, README) moved to `plans/007-enforce-tailwind-architecture.md`.

## Why this matters

After plan 004, the upper half of the page is pure Tailwind but the lower half still
runs on seven CSS Modules plus the root `LandingPage.module.css`. Two styling systems
coexist, and the unlayered module rules can silently override utilities. This plan
finishes the migration so plan 007 can delete the global helper classes and enforce
"no CSS Modules, no literal colors" automatically.

## Current state (verified at snapshot `c36ee76a`)

### Files to migrate

| Component | Module | Notes |
|---|---|---|
| `sections/PredictionSection.tsx` | `PredictionSection.module.css` (126 lines) | conic-gradient ring (8 stop tokens), calendar, `.facts div + div` divider, passes its own class to `StatusIcons` |
| `sections/PrivacySection.tsx` | `PrivacySection.module.css` (81) | `.promises > li + li::before` dividers, gold token |
| `sections/ComparisonSection.tsx` | `ComparisonSection.module.css` (74) | semantic `<table>` with `<caption className="visually-hidden">` (global class), many `tbody tr:first-child` / `:last-child` rules, 800-unit grid |
| `sections/PlansSection.tsx` | `PlansSection.module.css` (54) | 800-unit grid |
| `sections/AccountSection.tsx` | `../LandingPage.module.css` (35) | uses `.section`, `.account`, `.inner`, `.accountGrid`, `.copy`, `.kicker`, `.accountCard` |
| `sections/FaqSection.tsx` | `FaqSection.module.css` (84) | native `details`/`summary` accordion (`name="faq"`, first open), `::before`/`::after` toggle, `[open]` rules, `:focus-visible` outline |
| `sections/ClosingSection.tsx` | `ClosingSection.module.css` (94) | `StoreBadge` (`Button asChild`), footer, uses Hero's `FreeSticker` / `AppleLogo` |
| `LandingPage.tsx` | `LandingPage.module.css` | root `<main className={\`${styles.posterStack} isolate bg-background text-foreground\`}>` — `.posterStack { background: var(--color-landing-canvas); }` |

All color values are already theme tokens (plan 003): modules contain only
`var(--color-…)`, `white`, or `black`.

### Patterns established by plan 004 (reuse them)

- `src/features/landing/components/shared/PosterStage.tsx`: `<PosterStage grid="1024"
  | "800" className="aspect-[…] …">` owns `relative mx-auto @container
  max-poster:@container-normal max-poster:aspect-auto max-poster:[--u:1px]` plus the
  grid's width and `--u`. Comparison and Plans use `grid="800"`. FAQ's stage has no
  aspect ratio but the same `--u`/container setup, so it can use `PosterStage` with its
  grid classes; Closing's `.footerStage` (container + `--u`, no `position`) may use it
  only if the rendered layout is unchanged.
- Hero (`HeroSection.tsx`) is the reference for translated code style: static class
  strings, CVA for real variants, `cn` only to merge props/conditions.

### Traps the advisor verified (read all before Step 1)

1. **`Button asChild` does not tailwind-merge the child's classes.** Radix `Slot`
   concatenates `Button`'s classes (`inline-flex shrink-0 items-center justify-center
   whitespace-nowrap font-extrabold transition-[color,background-color,box-shadow,transform]
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
   focus-visible:ring-offset-2 …`) with the child `<a>`'s classes, so conflicts are
   decided by CSS order, not class order. Today the unlayered `.store` module rule wins
   them all. **In Closing's `StoreBadge`, pass the translated `.store` classes through
   `<Button className={cn(…)}>`** (Button runs `cn`, which drops the conflicting base
   classes), not on the `<a>`. Plan 004 hit this in Hero and used `font-black!`; do not
   copy that workaround.
2. **Focus states are not screenshot-tested.** `.store:focus-visible { outline: 3px solid
   white; outline-offset: 3px }` currently combines with Button's
   `focus-visible:ring-2 ring-ring ring-offset-2` (the module overrides only `outline`).
   FAQ's `.list summary:focus-visible` sets outline, offset, and radius. Reproduce both
   exactly; the reviewer compares focused computed styles old vs new.
3. **`FreeSticker` in Closing**: `.free > svg + svg { display: none; }` hides the
   sticker's rays (`FreeSticker`'s second child, now utility-styled by plan 004) and
   `.free svg:first-child { display: block; width: 100%; height: auto; }` sizes the art.
   Translate as `[&>svg+svg]:hidden [&>svg:first-child]:block [&>svg:first-child]:w-full
   [&>svg:first-child]:h-auto` on the `className` Closing passes. Do not edit
   `HeroSection.tsx`.
4. **Unlayered CSS beats utilities**: while any module remains, its rules override
   utilities on the same element/property. Migrate each component's module completely
   before judging its screenshots.
5. Tailwind 4.1.18 (verified in plan 004):
   - Breakpoints: 1099 → `max-poster:`, 760 → `max-nav:`, 640 → `max-tablet:`,
     480 → `max-phone:`, `min-width: 1441px` → `min-wide:`. **Never** arbitrary
     `max-[…]`/`min-[…]` (emitted before named breakpoints → wrong cascade).
   - **Never** `shadow-[…]`, `drop-shadow-[…]`, `text-shadow-[…]` with `calc()` (the
     offset is misparsed as a color). Use `[box-shadow:…]`, `[filter:drop-shadow(…)]`,
     `[text-shadow:…]`.
   - Math in arbitrary values is auto-spaced; use `_` for other spaces.
   - `hover:`/`group-hover:` are wrapped in `@media (hover: hover)` (accepted).
   - `group-open:` matches a `group` ancestor with `[open]`; `not-first:` matches
     `:not(:first-child)`; `before:`/`after:` need `content-['']`.
6. A media query without a module counterpart rule set (e.g. FAQ has **two**
   `@media (max-width: 1099px)` blocks, lines 53 and 70) must be merged in source order:
   later declarations win.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass (baseline: 5 files, 12 tests) |
| Build | `npm run build` | exit 0 |
| Browser + visual | `npm run test:e2e` | `17 passed` (builds first; port 3100) |
| Targeted visual | `npm run build && npx playwright test --grep "<regex>"` | listed tests pass |
| Module check | `ls src/features/landing/components/*.module.css src/features/landing/components/sections/*.module.css 2>/dev/null` | lists what remains |

When a screenshot fails, open `test-results/**/<name>-diff.png` with your Read tool.

## Scope

**In scope**:

- `src/features/landing/components/sections/{Prediction,Privacy,Comparison,Plans,Account,Faq,Closing}Section.tsx`
- Their modules `{Prediction,Privacy,Comparison,Plans,Faq,Closing}Section.module.css`
  and `src/features/landing/components/LandingPage.module.css` — delete each when its
  last consumer is migrated.
- `src/features/landing/components/LandingPage.tsx`
- `src/features/landing/components/shared/**` — only to add a primitive with ≥ 2
  consumers (e.g. the 800-grid sections already fit `PosterStage`; prefer reuse).

**Out of scope** (do NOT touch):

- `HeroSection.tsx`, `IslandSection.tsx`, `MoodSection.tsx`, `FlavorsSection.tsx`,
  `IslandCountdown.tsx`, `PosterStage.tsx` (unless a bug blocks you: STOP instead).
- `src/app/**` (including `globals.css` and its `.visually-hidden`/`.tnum` classes —
  plan 007 removes them), `src/components/**`, `messages/**`, `public/**`, `tests/**`
  (no baseline may change), `package.json`, `package-lock.json`.

## Git workflow

- No git writes: no `commit`, `add` (real index), `stash`, `checkout`, `switch`,
  `restore`, `reset`, `branch`, `worktree`, no PR.
- **Checkpoint** = run the changed-files command and confirm every path is in scope.

## Translation guide

Worked example — Closing `.copy` (module line 8) and its `h2` (line 9):

```css
.copy { position: absolute; z-index: 2; left: calc(56 * var(--u)); top: calc(7 * var(--u)); }
.copy h2 { margin: 0; color: white; font-size: calc(45 * var(--u)); font-weight: 1000; line-height: 1; letter-spacing: -0.015em; white-space: nowrap; }
```

```tsx
<div className="absolute z-2 left-[calc(56*var(--u))] top-[calc(7*var(--u))] …max-poster:…">
  <h2 className="m-0 text-white text-[calc(45*var(--u))] font-[1000] leading-none tracking-[-0.015em] whitespace-nowrap …">
```

Rules:

1. Every declaration of every live rule moves to the element(s) its selector matches,
   with the same breakpoint. Descendant selectors become utilities on those children in
   JSX. Arbitrary descendant variants (`[&_x]:`, `[&>x]:`) **only** for elements
   rendered by a component you must not change (`FreeSticker`, `AppleLogo`,
   `StatusIcons`, `next/image`'s inner element is fine to style directly via its
   `className`).
2. Numbers stay exact: `calc(56 * var(--u))` → `[calc(56*var(--u))]`; local `--u`/alias
   overrides become arbitrary properties on the same element.
3. Exact-semantics properties use verbatim arbitrary properties: `transform`, `filter`,
   `box-shadow`, `text-shadow`, gradients (`bg-[conic-gradient(…)]` with
   `var(--color-prediction-ring-N)` stops), multi-value `inset`/`padding`/`border-radius`,
   `grid-template-*`, `transition`.
4. Simple 1:1 properties use normal utilities (position, display, sizes, spacing,
   `text-[…]`, `font-[1000]`, `leading-[…]`, `tracking-[…]`, alignment, radius,
   `aspect-[…]`).
5. Colors only via tokens (`bg-faq-band`, `text-ink-navy`, `border-…`, `fill-…`) or
   `var(--color-…)` inside arbitrary properties. Local aliases (`--band-bg`, `--ink`,
   `--pink`, `--sun`, `--gold`) disappear in favor of the token they map to (each
   module's first lines show the mapping). `white`/`black` → `text-white`, `bg-white`,
   etc.
6. Structural pseudo-classes: `li + li` → `not-first:` (when all siblings are `li`);
   `tr:first-child`/`:last-child` → `first:`/`last:` on the `<tr>` or arbitrary
   `[&:first-child_th]:`-style variants on the row; `details[open] x` → `group` on
   `<details>` + `group-open:` on `x`; `summary::-webkit-details-marker` →
   `[&::-webkit-details-marker]:hidden`; `:focus-visible` → `focus-visible:`.
7. `.visually-hidden` (global) → `sr-only`.
8. Static class strings only; `cn` only to merge a prop/condition; never build class
   names from variables. Remove every `styles` import and `${styles.x}` template.
9. Delete a module only when `rg -n '<Name>\.module\.css' src` prints nothing.

## Steps

### Step 0: Confirm the baseline

```sh
cd /Users/khalil/Desktop/mochi-landing-page
# drift check (changed-files command) → empty
shasum package.json package-lock.json > "${TMPDIR:-/tmp}/plan005-frozen.sha"
( find tests -type f -exec shasum {} + ) > "${TMPDIR:-/tmp}/plan005-tests.sha"
npm run typecheck && npm run lint && npm test && npm run test:e2e
```

**Verify**: drift check empty; 12 unit tests; `17 passed`. Otherwise STOP. If port 3100
is busy, STOP (do not kill processes).

### Step 1: Migrate PredictionSection

`<PosterStage className="aspect-[1024/168] …">`. The ring's `conic-gradient` keeps its
angles and uses `var(--color-prediction-ring-1…8)` stops in an arbitrary background.
`.facts div + div` divider → `not-first:` on those rows. Keep `CYCLE_LEGEND_CLASS` /
`CYCLE_FACT_CLASS`. Pass the translated `.statusIcons` utilities to `StatusIcons`.
Delete the module.

**Verify**: `npm run test:e2e` → `17 passed`; typecheck/lint exit 0. Checkpoint.

### Step 2: Migrate PrivacySection

`<PosterStage className="aspect-[1024/152] …">`. The `.promises > li + li::before`
divider becomes `not-first:before:…` utilities (with `before:content-['']`) on each
`<li>`. Delete the module.

**Verify**: `17 passed`; typecheck/lint exit 0. Checkpoint.

### Step 3: Migrate ComparisonSection and PlansSection

Both use `<PosterStage grid="800" className="aspect-[800/170] …">`. Preserve the table:
one `<caption>` (now `sr-only`), scoped column/row headers, row order, cell classes.
Translate every `tbody tr:first-child` / `:last-child` / `.mochiCell` rule onto the
matching rows/cells. The non-color inline `style={flip ? { transform: "scaleX(-1)" } :
undefined}` in each file's `Rays` becomes a static conditional class
`cn(className, flip && "[transform:scaleX(-1)]")` — same for Closing in Step 5. Delete
both modules.

**Verify**: `17 passed`; `rg -n 'visually-hidden' src/features` → no output;
typecheck/lint exit 0. Checkpoint.

### Step 4: Migrate AccountSection, LandingPage root, and FaqSection

- AccountSection: translate `.section`, `.account`, `.inner`, `.accountGrid`, `.copy`,
  `.kicker`, `.accountCard` (and their descendant/media rules in
  `LandingPage.module.css`) onto its elements. Note `.kicker { font-size: 13px
  !important }` → `text-[13px]!` only if needed to beat another utility; otherwise
  plain.
- LandingPage.tsx: today `<main className={\`${styles.posterStack} isolate bg-background
  text-foreground\`}>` renders `--color-landing-canvas`, because the unlayered
  `.posterStack` rule overrides the `bg-background` utility. Replace it with
  `className="isolate bg-landing-canvas text-foreground"` (drop `bg-background`, which
  never took effect). Delete `LandingPage.module.css`.
- FaqSection: `<details>` gets `group`; `group-open:` reproduces the `[open]` rules
  (summary min-height/padding, `h3` size, toggle `after:` rotation). The toggle's
  `::before`/`::after` become `before:`/`after:` utilities with `content-['']`,
  `[transform:translateY(-50%)]` and `after:[transform:translateY(-50%)_rotate(90deg)]`,
  `group-open:after:[transform:translateY(-50%)_rotate(0deg)]`, transition and
  `motion-reduce:` overrides. `summary` keeps `focus-visible:` outline/offset/radius.
  Keep `name="faq"` and `open={index === 0}`. Merge the two `max-width: 1099px` blocks
  in source order. Delete the module.

**Verify**: `17 passed` (the keyboard test opens a FAQ item with Space — it must still
pass); typecheck/lint exit 0. Checkpoint.

### Step 5: Migrate ClosingSection and its footer

`<PosterStage className="aspect-[1024/112] …">` for the band. `StoreBadge`: put all
translated `.store`/`.footerStore`/descendant classes on `<Button asChild variant=
"unstyled" size="unstyled" className={cn(…, className)}>` (trap 1); the `<a>` keeps
only `href` and `aria-label`; `.store span/small/strong` utilities go on those
children. Reproduce `.store:focus-visible` (trap 2) and `--u: inherit` as
`[--u:inherit]`. `FreeSticker className=` per trap 3. Footer: `.footer`, `.footerStage`,
`.panel`, `.brand` (+ `img`, `i`, `b`), `.footerStore`. Rays flip as in Step 3. Delete
the module.

**Verify**: `17 passed`; typecheck/lint exit 0. Checkpoint.

### Step 6: Final verification

```sh
ls src/features/landing/components/*.module.css src/features/landing/components/sections/*.module.css 2>/dev/null
rg -n 'module\.css|styles\.|style=\{' src
rg -n '#[0-9A-Fa-f]{3,8}\b|rgba?\(' src --glob '!src/app/globals.css' --glob '!src/app/platform-colors.ts'
rg -n 'max-\[|min-\[|(^|[" ])(shadow|drop-shadow|text-shadow)-\[' src/features/landing
rg -n 'className=\{`' src/features/landing
rg -n '[a-z]+!(\s|")' src/features/landing/components/sections/{Prediction,Privacy,Comparison,Plans,Account,Faq,Closing}Section.tsx src/features/landing/components/LandingPage.tsx
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
shasum -c "${TMPDIR:-/tmp}/plan005-frozen.sha" | grep -v ': OK$'
shasum -c "${TMPDIR:-/tmp}/plan005-tests.sha" | grep -v ': OK$'
git log --oneline -1 && git diff --cached --name-only
# then the changed-files command
```

**Verify**: every `ls`/`rg` prints nothing (for the `!` scan, any `!` you kept must be
listed and justified in your report); all npm commands pass with `17 passed`; both
`shasum -c` print nothing (no test or snapshot changed); HEAD `0fa9683`; nothing
staged; every changed path is in scope.

## Test plan

- Visual: all 17 existing Playwright tests pass with zero baseline changes (desktop,
  1099, 759, 390, 1600 in EN/FR; phone menu EN/FR).
- Behavior: keyboard test (CTA focus, FAQ Space toggle) passes.
- Reviewer (not you) additionally compares, old vs new build, every element's bounding
  box at 14 widths, computed styles, hover, `:focus-visible`, and reduced motion for
  the seven sections — so hover/focus/640px rules must be translated faithfully even
  though no screenshot covers them.

## Done criteria

- [ ] No `*.module.css` file or import, no `styles.` reference, no `style={…}` anywhere
  in `src`.
- [ ] No hex/rgba literal outside `globals.css` and `platform-colors.ts`.
- [ ] No arbitrary breakpoint variants, no `shadow-[`-family utilities, no template-literal
  `className` in `src/features/landing`.
- [ ] `StoreBadge` styles pass through `Button`'s `className`; no `!` workaround in
  migrated files (or each one justified).
- [ ] `17 passed`, no snapshot/test file changed; typecheck, lint, unit tests, build pass.
- [ ] `package.json`/lock unchanged; no git writes.

## STOP conditions

- Baseline not green, or port 3100 busy.
- Any screenshot difference that two correction attempts don't remove.
- Preserving rendering seems to require editing an out-of-scope file (including
  `HeroSection.tsx` for `FreeSticker`/`AppleLogo`, or `globals.css`).
- A rule seems to need a dynamically generated class name or a new color token.
- The FAQ accordion stops being native `details`/`summary` or loses `name="faq"`.

## Maintenance notes

- After this plan the only stylesheet is `src/app/globals.css`; plan 007 removes its
  dead helper classes and adds automated policy checks.
- `Button asChild` + `Slot` never merges child classes; always style such links through
  `Button`'s `className`. (Hero's `AppStoreBadge` still uses `font-black!`; plan 007
  may normalize it.)
