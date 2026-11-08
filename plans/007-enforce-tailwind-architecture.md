# Plan 007: Enforce the Tailwind-only architecture (globals cleanup, policy tests, assets, README)

> **Executor instructions**: Follow every step in order and run each gate. **No visual
> change is approved**: any screenshot difference is a STOP. Do not update
> `plans/README.md` and never edit anything under `plans/`.
>
> **Working mode (owner's instruction)**: work directly in
> `/Users/khalil/Desktop/mochi-landing-page` on branch `main`. **No branches, worktrees,
> commits, stashes, PRs, and never `git add` to the real index.** Earlier plans are
> applied as uncommitted changes (HEAD stays `0fa9683`). Never revert or clean anything
> you did not change. The baseline is the snapshot tree `d3042eba` (working tree
> after plan 005).
>
> **Changed-files command** (temporary index; never touches the real index):
>
> ```sh
> ( export GIT_INDEX_FILE="${TMPDIR:-/tmp}/plan-check.idx"; rm -f "$GIT_INDEX_FILE"; git read-tree d3042eba && git add -A && git diff --cached --name-status d3042eba -- . ':!plans'; rm -f "$GIT_INDEX_FILE" )
> ```
>
> **Drift check (run first)**: the changed-files command → empty output. Otherwise STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: `plans/005-finish-tailwind-migration-and-enforce-boundaries.md`
- **Category**: dx, docs, architecture
- **Planned at**: snapshot `d3042eba`, 2026-11-08 (split from the original plan 005)

## Why this matters

Plans 003–005 moved every color into theme tokens and every section onto Tailwind
utilities. Nothing yet stops the old patterns from returning: `globals.css` still
carries 13 dead helper classes and 9 unused keyframes, an unused animation plugin is
imported, the README still says poster coordinates belong in CSS Modules, and
`public/mochi` holds 18 unshipped design-reference images that would deploy publicly if
committed. This plan removes the dead weight and turns the architecture rules into
tests that fail on violation.

## Current state (advisor verified; re-confirm in Step 0)

- `src/app/globals.css`:
  - Imports `tw-animate-css` (line 2). No component uses any of its classes
    (`rg 'animate-in|fade-in-|zoom-in-|slide-in-from|spin-in' src` → nothing).
  - After the `@layer base { … }` block: the global classes `.wrap`, `.tnum`,
    `.visually-hidden`, `.eyebrow`, `.h2`, `.lead`, a `@media (max-width: 520px)` block
    for `.h2`/`.lead`, the "Motion" comment, nine `@keyframes` (`jelly`,
    `shadow-squish`, `bob`, `twinkle`, `blob`, `spin`, `fade-in`, `rise`, `pop-in`),
    the classes `.jelly`, `.shadow-squish`, `.bob`, `.blob`, a comment and `.reveal,
    .reveal-pop`, then the `@media (prefers-reduced-motion: reduce)` block (keep).
    None of these classes or keyframes has a consumer in `src` (plans 004–005 replaced
    `.tnum` → `tabular-nums` and `.visually-hidden` → `sr-only`).
  - `:root` variables `--navy-deep`, `--body`, `--page-gutter` are referenced only by
    those dead classes. Keep `--navy` (body), `--pink-ink`/`--pink-deep` (`a` rules),
    `--pink` (manifest + `mochi-pink`), `--font`, `--spring`, all shadcn roles.
  - `@custom-variant dark (&:is(.dark *));` is shadcn infrastructure — keep it.
- `src/app/theme.test.ts`: its `loadStylesheet` has a `tw-animate-css` branch.
- `src/features/landing/components/sections/HeroSection.tsx`: `AppStoreBadge`'s compact
  variant uses `font-black!` because `Button asChild` (Radix `Slot`) concatenates
  Button's `font-extrabold` without tailwind-merge. Plan 005 established the clean
  pattern: pass the classes through `<Button className={cn(…)}>`.
- `public/mochi/` contains 43 files: the 25 declared in
  `src/features/landing/content/assets.ts` (`LANDING_ASSET_PATHS`) plus 18 **untracked**
  owner images with no consumer: `dynamic-island-phone.webp`, `hero-cushion.webp`,
  `mood-lineup.webp`, `poster-closing.webp`, `poster-faq.webp`, `poster-flavors.webp`,
  `poster-footer.webp`, `poster-hero.webp`, `poster-island.webp`, `poster-moods.webp`,
  `poster-predictions.webp`, `poster-privacy.webp`, `reference-closing.webp`,
  `reference-hero.webp`, `reference-island.webp`, `reference-moods.webp`,
  `reference-prediction.webp`, `reference-why-plus.webp`. **Owner decision**: move them
  to `design/references/` (kept, never deployed).
- `src/features/landing/content/assets.test.ts` checks declared files exist (25) and ID
  coverage; it does not reject undeclared files.
- No CI workflow exists (`.github/` absent); enforcement runs through `npm test` and a
  new `npm run check`.
- `README.md` "Architecture" tree says `components/ … scoped CSS Modules` and the
  "Design-system layers" principle says "Complex poster coordinates stay scoped in CSS
  Modules". The scripts table lacks the e2e/check scripts.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all pass (baseline count recorded in Step 0) |
| Build | `npm run build` | exit 0 |
| Browser + visual | `npm run test:e2e` | `17 passed` |
| Clean install | `npm ci --ignore-scripts` | exit 0 |

## Scope

**In scope**:

- Move (not copy) the 18 listed files from `public/mochi/` to `design/references/`
  (create the directory). They stay untracked.
- `src/app/globals.css` — deletions listed above and the `tw-animate-css` import only.
- `src/app/theme.test.ts` — remove the `tw-animate-css` branch only.
- `src/app/style-policy.test.ts` (create)
- `src/features/landing/content/assets.test.ts`
- `src/features/landing/components/sections/HeroSection.tsx` — `AppStoreBadge` only.
- `package.json`, `package-lock.json` — remove `tw-animate-css`; add three scripts.
- `README.md` — scripts table, Architecture tree, Principles bullet, new "Styling rules"
  and "Visual tests" sections.

**Out of scope**: every other source file, `tests/**` (no snapshot may change),
`messages/**`, the 25 declared assets, `components.json`, the reduced-motion block and
`@layer base` block in `globals.css`, all theme tokens.

## Git workflow

- No git writes: no `commit`, `add` (real index), `stash`, `checkout`, `switch`,
  `restore`, `reset`, `branch`, `worktree`, no PR.
- **Checkpoint** = run the changed-files command and confirm every path is in scope.
  (The moved images are untracked in both locations and appear as deletions/additions
  in the snapshot diff — that is expected.)

## Steps

### Step 0: Confirm the baseline

```sh
cd /Users/khalil/Desktop/mochi-landing-page
# drift check → empty
( find tests -type f -exec shasum {} + ) > "${TMPDIR:-/tmp}/plan007-tests.sha"
npm run typecheck && npm run lint && npm test && npm run test:e2e
```

**Verify**: drift empty; record the unit-test count; `17 passed`. Re-run the
consumer checks from "Current state":
`rg -n '\b(wrap|tnum|visually-hidden|eyebrow|h2|lead|jelly|shadow-squish|bob|blob|reveal|reveal-pop)\b' src --glob '*.tsx' | rg 'className'`
→ no output (an `<h2>` tag is not a class; only `className` strings count). If any
class consumer exists, STOP.

### Step 1: Move the reference images out of `public/`

```sh
mkdir -p design/references
for f in dynamic-island-phone hero-cushion mood-lineup poster-closing poster-faq poster-flavors poster-footer poster-hero poster-island poster-moods poster-predictions poster-privacy reference-closing reference-hero reference-island reference-moods reference-prediction reference-why-plus; do mv "public/mochi/$f.webp" design/references/ || exit 1; done
```

**Verify**: `ls design/references | wc -l` → `18`; `rg -n 'poster-|reference-|hero-cushion|mood-lineup|dynamic-island-phone' src messages` → no output;
`npm run test:e2e` → `17 passed`. Checkpoint.

### Step 2: Reduce `globals.css` and drop `tw-animate-css`

1. Delete exactly the blocks listed in "Current state" (classes, the 520px media block,
   the nine keyframes, their comments) and the three dead `:root` variables.
2. Delete the `@import "tw-animate-css";` line; run `npm uninstall tw-animate-css`;
   remove the `tw-animate-css` branch from `theme.test.ts`'s `loadStylesheet`.

**Verify**:
- `grep -cE '^\s*\.[A-Za-z]' src/app/globals.css` → `0`.
- `rg -n 'tw-animate' src package.json` → no output; `git diff --stat
  d3042eba -- package.json` shows only that dependency removed (compare with the
  snapshot: `git diff d3042eba -- package.json` — you may run `git diff <tree> --
  <path>` because it is read-only).
- `npm ci --ignore-scripts && npm test && npm run test:e2e` → pass, `17 passed`.
- Checkpoint.

### Step 3: Normalize `AppStoreBadge`

Move `appStoreBadge({ compact, dark })` and the `className` prop from the `<a>` onto
`<Button asChild variant="unstyled" size="unstyled" className={cn(appStoreBadge({ compact, dark }), className)}>`
(Button merges with `cn`, so `font-extrabold` is dropped), and change `font-black!` to
`font-black`. The `<a>` keeps `href` and `aria-label`.

**Verify**: `rg -n 'font-black!' src` → no output; `npm run test:e2e` → `17 passed`
(the compact header badge is in four screenshots; any diff is a STOP). Checkpoint.

### Step 4: Add the policy tests and scripts

Create `src/app/style-policy.test.ts` (Vitest, `node:fs` only; walk `src` with
`readdirSync(dir, { recursive: true })`). One `it` per rule, each failure message
listing offending `file:line`:

1. **No CSS Modules**: no `*.module.css` file under `src`; no `.ts`/`.tsx` import ending
   in `.module.css`.
2. **One stylesheet, no class selectors**: the only `.css` file under `src` is
   `src/app/globals.css`; after stripping `/* … */` comments and `@custom-variant …;`
   lines, no rule selector contains a class (regex on selector text before `{`:
   `(^|[\s,>+~(])\.[A-Za-z_-]`).
3. **Color literals only in the theme**: no `#rgb[a]`/`#rrggbb[aa]` (`#[0-9A-Fa-f]{3,8}\b`),
   `rgb(`, `rgba(`, `hsl(`, `hsla(` in any `.ts`/`.tsx`/`.css` file under `src` (never
   scan binaries such as `src/app/icon.png`) except `src/app/globals.css` and
   `src/app/platform-colors.ts` (and this test file itself, if its own patterns match —
   exclude it by exact path with a comment).
4. **No inline styles in the landing**: no `style={` under `src/features/landing`.
5. **Static class names**: no ``className={` `` (template literal) and no
   `className={"…" +` under `src/features/landing`.
6. **Verified Tailwind 4.1.18 pitfalls**: no arbitrary breakpoint variants (`max-[`,
   `min-[`) and no `shadow-[`, `drop-shadow-[`, `text-shadow-[` in `.ts`/`.tsx` under
   `src` (use named breakpoints and `[box-shadow:…]`-style arbitrary properties).

Extend `src/features/landing/content/assets.test.ts`: every file under
`public/mochi` (recursive, on disk) is in `LANDING_ASSET_PATHS`, and vice versa (exact
set equality; report extras and missing).

In `package.json` scripts add:

```json
"check:styles": "vitest run src/app/style-policy.test.ts",
"check:assets": "vitest run src/features/landing/content/assets.test.ts",
"check": "npm run check:styles && npm run check:assets && npm run typecheck && npm run lint && npm test && npm run build"
```

**Verify** — mutation-test every rule, reverting each mutation immediately after:

| Mutation (temporary) | Command | Must fail with |
|---|---|---|
| create `src/features/landing/components/Probe.module.css` containing `.x{}` | `npm run check:styles` | rules 1 and 2 |
| add `.probe { color: red; }` at the end of `globals.css` | `npm run check:styles` | rule 2 |
| add `const c = "#123456";` to `src/features/landing/content/landing.ts` | `npm run check:styles` | rule 3 |
| add `style={{}}` to one element in `AccountSection.tsx` | `npm run check:styles` | rule 4 |
| change one `className="…"` in `AccountSection.tsx` to ``className={`${"a"} b`}`` | `npm run check:styles` | rule 5 |
| add `max-[700px]:hidden` to a class string in `AccountSection.tsx` | `npm run check:styles` | rule 6 |
| `touch public/mochi/zz-probe.webp` | `npm run check:assets` | undeclared file |

After reverting all, `npm run check:styles && npm run check:assets` → pass. Report each
failing output line. Confirm with the changed-files command that no probe file remains.
Checkpoint.

### Step 5: Rewrite the README architecture documentation

Keep the existing voice and all unrelated sections ("Getting started", "Before launch",
the privacy/locale/server-first principles). Change:

- **Scripts table**: add `npm run test:e2e` (production build + Playwright route,
  keyboard, and EN/FR visual tests), `npm run test:e2e:update` (re-record baselines —
  only for reviewed, intentional visual changes), `npm run check` (all policy, type,
  lint, unit, and build checks), `npm run check:styles`, `npm run check:assets`. Update
  `npm test` to "Vitest checks for assets, messages, theme tokens, and style policy".
- **Architecture tree**: `globals.css` → "Tailwind 4 theme (shadcn roles, landing color
  tokens, breakpoints, motion) and base element styles"; `features/landing/components/`
  → "landing composition and sections, styled with Tailwind utilities"; add
  `features/landing/components/shared/` → "`PosterStage`, the poster coordinate
  system"; `features/landing/content/` mention `visual-variants.ts`; add
  `src/app/platform-colors.ts` → "browser/manifest colors (the only literals outside the
  theme)"; add `tests/e2e/` → "Playwright routes, keyboard, and visual baselines"; add
  `design/references/` → "design reference images (untracked, never deployed)".
- **Principles → "Design-system layers"**: replace with: Tailwind utility classes in
  `className` are the only styling mechanism; reusable values live in the Tailwind theme.
- **New section "Styling rules"** (concise bullets): no CSS Modules, custom class
  selectors, or inline styles; colors only as `--color-*` tokens in `globals.css`'s
  `@theme static` block (enforced by `style-policy.test.ts` and `theme.test.ts`); poster
  geometry via `PosterStage` + `calc(N*var(--u))` arbitrary values; breakpoints
  `max-poster` (≤1099px), `max-nav` (≤760px), `max-tablet` (≤640px), `max-phone`
  (≤480px), `min-wide` (≥1441px) — never arbitrary `max-[…]`; shadows/filters with
  `calc()` use arbitrary properties, never `shadow-[…]`; per-ID colors via typed static
  records in `visual-variants.ts`; style `Button asChild` links through `Button`'s
  `className`.
- **New section "Visual tests"**: 17 Playwright tests incl. EN/FR full-page baselines
  at 1600/1440/1099/759/390 and the open phone menu; baselines change only for
  reviewed, intentional changes.

**Verify**: every path and script named in the README exists
(`ls` each path; `npm run` lists each script). Checkpoint.

### Step 6: Final verification from a clean install

```sh
npm ci --ignore-scripts
npm run check
npm run test:e2e
shasum -c "${TMPDIR:-/tmp}/plan007-tests.sha" | grep -v ': OK$'
git diff --check -- README.md src package.json
git log --oneline -1 && git diff --cached --name-only
# then the changed-files command
```

**Verify**: `npm run check` exits 0; `17 passed`; `shasum` prints nothing (no test or
snapshot changed); `git diff --check` prints nothing; HEAD `0fa9683`; nothing staged;
every changed path is in scope.

## Test plan

- New `style-policy.test.ts` (6 rules) and the exact-set asset test, each shown failing
  once on a deliberate violation.
- Existing unit tests (theme, platform colors, variants, messages, assets) and all 17
  Playwright tests pass unchanged.

## Done criteria

- [ ] `design/references/` holds the 18 images; `public/mochi` holds exactly the 25
  declared assets.
- [ ] `globals.css` has zero class-selector rules, no `tw-animate-css`, no dead
  variables/keyframes; `tw-animate-css` removed from `package.json`/lock.
- [ ] `AppStoreBadge` has no `!` workaround.
- [ ] `npm run check` exits 0 and includes `check:styles`/`check:assets`; each policy
  rule was shown to fail on a probe.
- [ ] README documents the Tailwind-only architecture, scripts, and visual-test policy.
- [ ] `17 passed`; no test/snapshot file changed; no git writes.

## STOP conditions

- Baseline not green, port 3100 busy, or any listed class/keyframe has a consumer.
- Any screenshot difference.
- `npm uninstall tw-animate-css` changes any other dependency version in the lockfile.
- A policy rule cannot pass without an exception broader than the two named literal
  files (report the offending lines instead of loosening the rule).

## Maintenance notes

- `npm run check` is the pre-merge gate; add it to CI when one is introduced.
- New colors → `--color-*` tokens; new assets → `assets.ts`; new breakpoints → named
  `--breakpoint-*` tokens. The policy tests will fail otherwise.
