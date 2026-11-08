# Plan 001: Add localized landing visual guardrails

> **Executor instructions**: Follow this plan step by step. Run every verification
> command and confirm the expected result before moving on. If a STOP condition occurs,
> stop and report; do not improvise. When done, update plan 001 in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 0fa9683..HEAD -- package.json package-lock.json src/app src/components/maquette src/i18n messages tests playwright.config.ts`
> If an in-scope file changed, compare this plan with the live code. STOP on a material
> mismatch in route structure, locale behavior, or test tooling.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `0fa9683`, 2026-11-08

## Why this matters

The requested rewrite replaces more than a thousand lines of pixel-sensitive CSS. The
current tests cannot detect a broken `/fr` route, a missing section, a breakpoint shift,
or a visual regression. Establishing accepted EN/FR screenshots and route smoke tests
first turns the migration from subjective guesswork into a controlled change.

## Current state

- `src/app/[locale]/page.tsx:2-13` is the only landing route and renders
  `MaquetteLanding` after `setRequestLocale(locale)`.
- `src/components/maquette/MaquetteLanding.tsx:32-43` composes eleven visible bands.
- `package.json:12` runs only `vitest run`; no browser test dependency or command exists.
- `src/i18n/messages.test.ts:16` verifies locale message parity, not rendering.
- `src/lib/change-timer.test.ts` owns 21 of the current 23 tests and will be deleted with
  the disconnected legacy feature.
- Important visual boundaries are 1099/1100px for poster-to-stack transitions, 760px for
  navigation, and 480px for small-phone rules.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `npm ci --ignore-scripts` | exit 0 |
| Install browser | `npx playwright install chromium` | exit 0 |
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0, no errors |
| Unit tests | `npm test` | 23 tests pass before cleanup |
| Browser tests | `npm run test:e2e` | all EN/FR smoke and screenshot tests pass |
| Build | `npm run build` | exit 0; localized routes compile |

## Suggested executor toolkit

- Use `vercel-react-best-practices` when touching Next.js test setup or route code.
- Use Playwright's screenshot assertions; do not introduce a second browser-test tool.

## Scope

**In scope**:

- `package.json`
- `package-lock.json`
- `playwright.config.ts` (create)
- `tests/e2e/landing.spec.ts` (create)
- `tests/e2e/landing.spec.ts-snapshots/**` (create after human review)
- `.gitignore` for Playwright output only
- CI workflow file, but only if this repository already uses CI

**Out of scope**:

- Production component, CSS, message, and asset changes
- Updating screenshots to hide an unexplained visual change
- Cross-browser coverage beyond Chromium in this prerequisite

## Git workflow

- Branch: `advisor/001-landing-visual-guardrails`
- Use conventional commits, e.g. `test(landing): add localized visual baselines`.
- Do not push or open a PR unless the operator instructs it.

## Steps

### Step 1: Add Playwright without changing runtime dependencies

Install `@playwright/test` as a dev dependency. Add scripts:

- `test:e2e`: run Playwright normally.
- `test:e2e:update`: update snapshots deliberately.

Create `playwright.config.ts` with Chromium only, `baseURL` set to
`http://127.0.0.1:3000`, trace/screenshot capture on failure, and a `webServer` that runs
`npm run dev` and reuses an existing local server outside CI.

**Verify**: `npm ls @playwright/test` -> one valid dev dependency; `npm run typecheck` ->
exit 0.

### Step 2: Add route and localization smoke tests

In `tests/e2e/landing.spec.ts`, cover `/`, `/en`, and `/fr`:

- `/` returns 200 and renders one `main`.
- `/en` follows the configured redirect to `/` rather than looping.
- `/fr` returns 200, keeps `/fr` in the final URL, and sets the document language to
  French.
- The eleven section/footer landmarks are present in composition order: hero/top,
  island, mood, flavors, predictions, privacy, why, plus, account, FAQ, closing/footer.
- Primary App Store calls to action are keyboard-focusable.
- FAQ details can be opened by keyboard.
- No `pageerror`, uncaught console error, or failed same-origin document/image request is
  emitted. Ignore only explicitly documented third-party requests.

Use stable roles and section IDs; do not assert CSS Module names.

**Verify**: `npm run test:e2e -- --grep "route|locale|landmarks"` -> all smoke tests pass.

### Step 3: Create reviewed visual baselines

Capture full-page snapshots for both `/` and `/fr` at:

- desktop: 1440 x 1200;
- poster transition: 1099 x 1000;
- navigation transition: 759 x 1000;
- phone: 390 x 844.

Disable animation through Playwright's screenshot option and wait for `document.fonts`
plus all visible images before capture. Use deterministic names containing locale and
viewport. Generate with `npm run test:e2e:update`, then have a human compare every image
to the current page before committing it.

**Verify**: `npm run test:e2e` -> eight visual assertions and all smoke tests pass with no
new snapshots generated.

### Step 4: Wire the complete verification path

If CI exists, install Chromium and run `npm run test:e2e` after build/unit checks. If no
CI exists, document the exact local command in the README but do not invent a hosting
workflow in this plan.

**Verify**: `npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e`
-> every command exits 0.

## Test plan

- Happy paths: English root and French localized route render completely.
- Redirect: `/en` resolves once to the default-locale root.
- Interaction: keyboard opens an FAQ and focuses main CTAs.
- Failure capture: page errors, same-origin asset failures, and image failures fail tests.
- Visual cases: EN and FR at four load-bearing widths.

## Done criteria

- [ ] `@playwright/test` is a dev dependency and the lockfile is current.
- [ ] `/`, `/en`, and `/fr` smoke tests pass.
- [ ] Eight human-reviewed screenshot baselines exist and pass without updating.
- [ ] `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and
  `npm run test:e2e` all exit 0.
- [ ] Production source, styling, translations, and runtime assets are unchanged.
- [ ] `plans/README.md` marks plan 001 `DONE`.

## STOP conditions

Stop and report if:

- `/fr` returns 500 or any route is unstable on a clean install and fresh dev server.
- Fonts or images cannot be made deterministic without production changes.
- A human reviewer rejects any generated baseline.
- The live route no longer uses the locale structure described above.
- Browser installation requires changing production hosting or security policy.

## Maintenance notes

- Never update snapshots in the same commit as an unexplained styling change.
- Future visual changes should include a before/after review for both locales.
- Add more browsers only when cross-browser support becomes a product requirement.
