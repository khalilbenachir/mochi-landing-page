# Plan 006: Stabilize screenshots against Next.js development-only UI

> **Executor instructions**: Follow this plan step by step. Run every verification
> command. Touch only the test files listed in scope. If a STOP condition occurs, stop
> and report; never add visual tolerances or production changes to hide a flake. Skip the
> index update because the reviewer maintains `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 2bd9621..HEAD -- playwright.config.ts tests/e2e package.json package-lock.json`
> Plan-002 work may be present outside these paths. STOP if committed test-harness drift
> other than the accepted plan-001 files is present.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: `plans/001-add-landing-visual-guardrails.md`
- **Category**: tests
- **Planned at**: commit `47960de`, 2026-11-08

## Why this matters

Plan 002 exposed a false screenshot failure from the Next.js development toolbar. The
toolbar's fixed “N” badge changed 29-33 pixels between otherwise identical captures, and
one French full-page height intermittently rounded by one pixel. Production layout cannot
be safely migrated while dev-only UI participates in the baseline.

## Current state

- Plan 001 added `tests/e2e/landing.spec.ts` with eight EN/FR full-page screenshots.
- The tests already freeze Playwright's clock, wait for fonts/images, disable animations,
  and use an isolated `localhost:3100` server.
- Failed plan-002 diff images show the only colored pixel cluster at the Next.js
  development “N” badge on the left edge; the page itself is gray/unchanged.
- Commit `47960de` already contains the reviewer-approved custom-shield-to-Lucide
  replacement from plan-002 cleanup, so the pre-structure snapshot update may also differ
  at that one account-card icon. The current isolated worktree contains uncommitted plan-002 structure work and eight
  regenerated baselines. Those baseline edits must be discarded before this plan; the
  source WIP must be stashed and restored without loss.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit tests | `npm test` | all current tests pass |
| Build | `npm run build` | exit 0 |
| Browser tests | `npm run test:e2e` | 13 pass, repeated three times |

## Scope

**In scope**:

- `tests/e2e/landing.spec.ts`
- `tests/e2e/landing.spec.ts-snapshots/**`
- `tests/e2e/visual-stability.css` (optional create)
- `playwright.config.ts`
- `package.json` for making `test:e2e` build before starting the production server

**Out of scope**:

- Any production source, Next configuration, CSS, messages, or assets
- Pixel/ratio tolerance increases
- Fixed-height crops that can conceal missing lower-page content
- Updating baselines while plan-002 source WIP is applied

## Git workflow

- Continue on isolated branch `advisor/execute-all-plans`.
- Commit: `test(landing): exclude dev toolbar from visual baselines`.
- Do not push, merge, or touch the user's main worktree.

## Steps

### Step 1: Preserve plan-002 WIP and restore plan-001 baselines

In the isolated worktree only:

1. Restore the eight snapshot files to `HEAD`, discarding only the uncommitted baseline
   update that included the Lucide shield.
2. Stash all remaining tracked and untracked plan-002 structure WIP with a descriptive
   name such as `plan-002-structure-wip`.
3. Confirm the worktree is clean and `HEAD` is `47960de` (or its reviewed descendant
   containing only plan-002 steps 2-4).

Do not inspect or touch the user's original workspace or its stash.

**Verify**: `git status --short` is empty; `git stash list` contains the named isolated
WIP; the eight snapshots match commit `2bd9621` before regeneration.

### Step 2: Exclude dev-only UI in the screenshot harness

Add a test-only visual stabilization helper before each screenshot. Hide the
`nextjs-portal` host with a persistent page stylesheet (`display: none !important`) and
remove any already-mounted host before capture. Keep this logic next to the visual test;
do not alter `next.config`, application CSS, or runtime components.

Retain the existing frozen clock, font/image waits, full-page capture, zero pixel
tolerance, and four viewport widths.

Run screenshots against a production Next server, not `next dev`: make the E2E command
build first and configure Playwright's web server to use `next start` on the isolated
port. This removes HMR/compiler timing and development-toolbar rendering from the
baseline. Keep the test-side portal exclusion as defense in depth, but do not rely on it
as the only stabilization mechanism.

**Verify**: a diagnostic screenshot contains no Next.js “N” badge and still includes the
complete footer.

### Step 3: Regenerate and review the eight baselines

Run the update command once on the committed pre-structure source. The only intended
differences from plan-001 images are removal of the dev-only badge and the already
reviewed custom-shield-to-Lucide replacement in the account card. A human reviewer must
inspect all eight images before commit.

**Verify**: `npm run test:e2e:update` reports 13 passed and exactly eight reviewed
baselines exist.

### Step 4: Prove repeatability

Run `npm run test:e2e` three separate times, allowing Playwright to build and start/stop
its own isolated production server each time. Do not reuse an external server. All three runs must report
13/13 passed without writing snapshots. Then run typecheck, lint, unit, and build.

**Verify**: three recorded browser runs pass; all standard checks exit 0; `git diff
--check` reports no errors.

### Step 5: Commit the harness and restore plan-002 WIP

Commit only the in-scope test-harness/snapshot files. Then reapply the named isolated
plan-002 WIP. Resolve no conflict by discarding source work; STOP if the stash cannot be
reapplied cleanly. The restored WIP may legitimately fail screenshots only at the planned
custom-shield-to-Lucide pixels until plan 002 updates them after review.

**Verify**: the harness commit contains only in-scope files; plan-002 source WIP is again
present; the named stash is dropped only after a successful apply.

## Test plan

- Eight localized snapshots retain complete page/footer coverage.
- The Next dev portal is absent from captured pixels.
- Three consecutive no-update runs prove zero-pixel repeatability.
- Standard type/lint/unit/build commands remain green.

## Done criteria

- [ ] No production file changed.
- [ ] Dev-only Next UI is excluded test-side, without tolerance changes.
- [ ] Eight human-reviewed baselines contain no dev badge.
- [ ] Three consecutive `npm run test:e2e` runs pass 13/13.
- [ ] Typecheck, lint, unit tests, and build pass.
- [ ] The harness commit is scope-clean and plan-002 WIP is safely restored.

## STOP conditions

Stop and report if:

- The source WIP or its snapshots cannot be separated/restored safely.
- Any baseline difference extends beyond the dev badge and the already approved account
  shield replacement before WIP restoration.
- The one-pixel height instability persists after the dev portal is excluded.
- Stability would require tolerance, cropping, or production changes.
- Any of the three consecutive no-update runs fails.

## Maintenance notes

- Never capture framework development chrome in product baselines.
- A reviewer should inspect the footer in every full-page image after harness changes.
- Keep the zero-pixel policy; diagnose new flakes rather than relaxing assertions.
