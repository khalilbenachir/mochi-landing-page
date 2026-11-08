# Plan 002: Remove dead code and assets, then establish the landing feature boundary

> **Executor instructions**: Follow this plan step by step. Run every verification gate.
> Deletions in this plan are irreversible for untracked files, so honor the preservation
> gate exactly. On any STOP condition, stop and report. Update plan 002 in
> `plans/README.md` when done.
>
> **Drift check (run first)**:
> `git diff --stat 0fa9683..HEAD -- src/components src/features src/lib src/content src/app public/mochi package.json package-lock.json README.md`
> Plan 001 is expected drift. Any other material change to a deletion candidate or the
> active route is a STOP condition until reconciled.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: `plans/001-add-landing-visual-guardrails.md`,
  `plans/006-stabilize-visual-test-harness.md`
- **Category**: tech-debt, architecture
- **Planned at**: commit `0fa9683`, 2026-11-08

## Why this matters

The repository contains two landing implementations. Only `components/maquette` is
reachable, while the disconnected implementation adds thousands of lines, obsolete
assets, and most of the unit tests. Removing that graph first prevents wasted Tailwind
work; creating a landing feature boundary then gives the production page clear ownership
without polluting shared shadcn primitives.

## Current state

- `src/app/[locale]/page.tsx:2` imports only
  `@/components/maquette/MaquetteLanding`.
- `src/components/maquette/MaquetteLanding.tsx:5-13` imports the complete active band
  graph. No active import reaches `components/sections`, `features/change-reminder`, or
  `lib/change-timer`.
- Dead source totals roughly 2,681 lines across the legacy sections, reminder feature,
  domain-specific UI helpers, and timer code.
- `src/content/mochi.ts:6-23` mixes active assets with legacy clip/flavor/live-activity
  factories. `src/content/mochi.ts:26-97` duplicates flavor and mood data that active code
  does not consume.
- `src/i18n/navigation.ts:4` exports a navigation wrapper with no imports elsewhere.
- `src/components/ui/Icon.tsx` is active only for the account shield; shadcn is configured
  for Lucide in `components.json:20`, and `lucide-react` is already installed.
- `src/components/maquette/MaquetteLanding.module.css` has 205 lines, while live code uses
  only the root/account keys plus `mobileMenu` from `HeroBand.tsx`.
- The verified active runtime asset set is 25 tracked files totaling 672,736 bytes:
  `account-mochi.webp`, `app-icon.webp`, `closing-mochi.webp`,
  `faces/{happy,wondering}.webp`, all twelve `flavor-cards/*.webp`,
  `hero-{mochi,phone}.webp`, `island-mochi.webp`, four `mood-*.webp` files, and
  `predict-mochi.webp`.
- Forty-two tracked legacy media files total 2,180,975 bytes. Eighteen untracked working
  images total 1,956,888 bytes and have no runtime consumer.
- At planning time, many legacy files have unstaged edits, `Pricing.tsx` and its module
  are locally deleted, and all eighteen working images are untracked. A safety stash
  named `pre-pull main 2026-11-08` exists, but the executor must not assume it is the only
  required copy.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect work | `git status --short` | understood before deletion |
| Inspect reachability | `rg -n "components/sections|features/change-reminder|change-timer" src` | only deletion candidates before removal; zero after |
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | surviving locale tests pass |
| Build | `npm run build` | exit 0 |
| Browser tests | `npm run test:e2e` | accepted screenshots and smoke tests pass |

## Suggested executor toolkit

- Use `git-workflow` for preservation, moves, and reviewable commits.
- Use `vercel-react-best-practices` while moving Next.js/React components.

## Scope

**In scope**:

- `src/components/sections/**` (delete)
- `src/features/change-reminder/**` (delete)
- `src/lib/change-timer.ts` and `src/lib/change-timer.test.ts` (delete)
- `src/components/ui/{ChangeFaces,MochiClip,Phone}.tsx` and `ui.module.css` (delete)
- `src/components/ui/Icon.tsx` (replace the one live shield use with Lucide, then delete)
- `src/content/mochi.ts` and `src/content/product-catalog.ts`
- `src/i18n/navigation.ts` (delete only after a fresh reference scan)
- `src/components/maquette/**`, moved to `src/features/landing/**`
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/layout.tsx`, `src/app/manifest.ts`, `src/app/robots.ts`, and
  `src/app/sitemap.ts` for import-path updates required by the content move only
- `src/components/seo/StructuredData.tsx` for the same import-path-only update
- `public/mochi/clips/**`, `public/mochi/flavors/**`,
  `public/mochi/live-activity/**`, and `public/mochi/faces/{privacy,thinking}.webp`
- The exact eighteen untracked files listed in step 4
- `README.md` only for the new source tree; final styling rules wait for plan 005

**Out of scope**:

- Tailwind conversion of active styles
- Translation-key or marketing-copy changes
- SEO/manifest behavior; `app-icon.webp` must remain
- Deleting an edited/untracked file before the preservation gate is satisfied
- Moving cross-cutting `src/i18n` infrastructure into the landing feature

## Git workflow

- Branch: `advisor/002-landing-cleanup`
- Use separate conventional commits for preservation-approved deletions and structure,
  e.g. `refactor(landing): remove disconnected implementation` and
  `refactor(landing): establish feature boundary`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Preserve or explicitly discard every local change

Run `git status --short` and compare it with the current-state list. For every modified,
deleted, or untracked in-scope path, require one of:

1. it is committed on a named preservation branch;
2. it is stored in a verified patch/archive outside the deletion target; or
3. the operator explicitly approves discarding that exact path.

Do not rely only on an old stash without inspecting its file list. Record the disposition
in the commit/PR description. Plans and Playwright files are expected and are not cleanup
candidates.

**Verify**: `git status --short` plus the preservation record accounts for every in-scope
dirty/untracked path; no path is ambiguous.

### Step 2: Create an explicit active asset manifest

Create `src/features/landing/content/assets.ts` with static, typed entries for the 25 live
files listed in Current state. Represent the twelve flavor-card and four mood entries as
typed records keyed by the existing catalog/mood IDs; do not build paths dynamically.
Switch active components and `src/app/manifest.ts` consumers without changing rendered
URLs. Add a small Vitest test that asserts every manifest path exists under `public` and
that the ID sets match the product catalog.

**Verify**: the new asset test passes; `rg -n '/mochi/' src/features/landing src/app` finds
only the manifest and any documented metadata exception.

### Step 3: Delete the disconnected source graph and trim mixed modules

Delete the legacy source paths listed in Scope. In `src/content/mochi.ts`, preserve only
live configuration until it is moved, then delete the obsolete file once no imports
remain. Use `ShieldCheck` (or the closest already-installed Lucide shield) in the account
section and delete the custom multi-icon file only after `rg` shows no consumers.

Delete `src/i18n/navigation.ts` only if a new repository-wide scan still finds no imports.
Do not delete `src/components/ui/Button.tsx` or `src/lib/utils.ts`; they are shared shadcn
infrastructure.

**Verify**: `rg -n "components/sections|features/change-reminder|change-timer|ChangeFaces|MochiClip|Phone" src`
returns no matches; `npm run typecheck && npm run lint && npm test` exits 0.

### Step 4: Remove only verified dead media

After step 3, delete these tracked groups:

- `public/mochi/clips/**` (24 files)
- `public/mochi/flavors/**` (12 files)
- `public/mochi/live-activity/**` (4 files)
- `public/mochi/faces/privacy.webp`
- `public/mochi/faces/thinking.webp`

For these untracked files, either delete them after explicit preservation approval or
archive them outside `public` and outside the repository if they remain design sources:

- `dynamic-island-phone.webp`, `hero-cushion.webp`, `mood-lineup.webp`
- `poster-{closing,faq,flavors,footer,hero,island,moods,predictions,privacy}.webp`
- `reference-{closing,hero,island,moods,prediction,why-plus}.webp`

`hero-cushion.webp` is byte-identical to the active tracked hero artwork and does not
need a second runtime copy.

**Verify**: the asset-manifest test passes; `git ls-files public/mochi | wc -l` reports 25;
`find public/mochi -type f | wc -l` also reports 25 if the untracked working art was
deleted rather than archived.

### Step 5: Move the active implementation into a feature boundary

Use `git mv` where possible and target this shape:

```text
src/features/landing/
  components/
    LandingPage.tsx
    sections/
      HeroSection.tsx
      IslandSection.tsx
      MoodSection.tsx
      FlavorsSection.tsx
      PredictionSection.tsx
      PrivacySection.tsx
      ComparisonSection.tsx
      PlansSection.tsx
      AccountSection.tsx
      FaqSection.tsx
      ClosingSection.tsx
  content/
    assets.ts
    landing.ts
    product-catalog.ts
```

Keep currently active CSS Modules beside their section temporarily; plans 004-005 remove
them. Split `AccountBand` out of `MaquetteLanding.tsx`, and split comparison/plans exports
without changing markup. Rename production language from `Maquette`/`Band` to
`Landing`/`Section`. Keep `src/app/[locale]/page.tsx` as a thin locale adapter.

Do not create barrel files; use direct imports to keep server/client boundaries visible.

**Verify**: `rg -n "components/maquette|MaquetteLanding|Band" src/app src/features/landing`
returns no production architecture names (ordinary HTML wording excluded); browser tests
pass unchanged.

### Step 6: Prune dead styles in the still-live root module

Move the hero mobile menu rule into the hero section module so one CSS Module never
targets another module's hashed classes. Reduce the root landing module to only rules
still consumed by the account/root composition. Do not convert those remaining rules to
Tailwind yet. Preserve the complete account typography contract when renaming
`.bandCopy` to `.copy`, including `line-height: 0.96` on the account heading; omitting it
falls back to the browser's `normal` line height and shifts every lower section. At the
existing `max-width: 760px` breakpoint, also preserve the paragraph centering rule as
`.copy p { margin-inline: auto; }`; `text-align: center` on the grid is not equivalent
because the paragraph has a constrained width and otherwise remains left-positioned.

**Verify**: extract every `styles.foo`/`landing.foo` reference and confirm every retained
selector has a consumer. `npm run test:e2e` must pass without snapshot updates except for
the explicitly planned custom-shield-to-Lucide replacement: if and only if every section
box is geometrically identical and the screenshot diff is isolated to that icon, a human
reviewer may approve regenerating the eight baselines.

### Step 7: Document the feature tree

Update only the README tree and ownership statement: `src/features/landing` owns landing
components/content/assets; `src/components/ui` contains reusable shadcn primitives;
`src/i18n` remains shared. Defer the final Tailwind-only rule until plan 005 actually
enforces it.

**Verify**: every documented path exists; the README no longer lists the deleted timer or
legacy sections.

## Test plan

- Asset manifest: all 25 declared paths exist; catalog/mood IDs are exhaustive.
- Existing next-intl message parity tests remain green.
- Browser smoke tests prove `/`, `/en`, and `/fr` still render.
- Existing EN/FR screenshots pass without updates.
- Build verifies no deleted dynamic asset or source import remains.

## Done criteria

- [ ] Every pre-existing dirty target was preserved or explicitly approved for discard.
- [ ] The disconnected source graph and 42 tracked legacy assets are gone.
- [ ] Exactly the 25 declared runtime assets remain under `public/mochi` unless an
  explicitly documented non-runtime archive is outside `public`.
- [ ] The active implementation lives under `src/features/landing` and the route is thin.
- [ ] Shared `components/ui` contains no landing-domain components.
- [ ] `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and
  `npm run test:e2e` all pass; any baseline update is limited to the reviewed Lucide
  shield replacement described in step 6.
- [ ] `plans/README.md` marks plan 002 `DONE`.

## STOP conditions

Stop and report if:

- Any deletion candidate has unpreserved modifications or uncertain provenance.
- Any candidate asset appears in the active manifest, CSS `url()`, metadata, manifest,
  or a remaining runtime component.
- A legacy component is referenced by a route, story, test fixture, or external package
  not captured in this plan.
- The accepted screenshots change during a move-only/cleanup step, except for a
  reviewer-approved pixel diff isolated to the plan's explicit Lucide shield replacement.
- The target feature structure would require introducing a circular dependency.
- A verification fails twice after a reasonable correction.

## Maintenance notes

- Keep the asset manifest explicit; generated public paths defeat orphan detection.
- Do not reintroduce a second landing implementation under generic `components`.
- A reviewer should scrutinize the preservation record and `git diff --summary` before
  reviewing naming or formatting.
