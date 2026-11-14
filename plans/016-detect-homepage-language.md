# Plan 016: Select the homepage language automatically

> Executor: follow the steps and verification gates below. Update the index after review.
> Drift check: `git diff --stat 4408666..HEAD -- src/middleware.ts tests/e2e/seo-improvements.spec.ts tests/e2e/locale-detection.spec.ts README.md`
> Compare excerpts and working-tree changes too; stop if assumptions no longer hold.

## Status

- Priority: P1
- Effort: M
- Risk: MED (redirects, preference persistence, crawler behavior)
- Depends on: none
- Category: direction
- Planned at: commit `4408666`, 2026-11-14

## Why this matters

The owner wants automatic language selection so French-speaking visitors do not need to use the menu on arrival. Detect browser language on the unprefixed homepage, while preserving direct content links and manual choices. Browser language is the intended proxy for language; IP location is not part of this plan. A visitor in France using an English browser will receive English unless they have selected another language.

## Behavior contract

- On `/`, priority is valid `NEXT_LOCALE` cookie, then `Accept-Language`, then English.
- Use next-intl's built-in locale negotiation; do not implement header parsing or add a geolocation service.
- Supported locales remain en, fr, de, es, pt-BR, pt-PT.
- A French browser visiting `/` redirects temporarily to `/fr` before rendering. English stays at `/`.
- Every explicit locale prefix wins over cookies and browser preferences, including `/en` (canonicalizes to `/`). The redirect from `/en` must set an English preference so the following `/` request does not bounce back to French.
- Unprefixed content URLs (`/privacy`, `/terms`, `/blog` and articles) retain English regardless of preferences. Prefixed content URLs retain their explicit language. Detection is an arrival-homepage feature only.
- Reading an unprefixed English content URL must not overwrite a previously saved French choice. Visiting an explicit language URL may update the preference, consistent with the current switcher.
- The language menu remains available and preserves the current page. Selecting English on a French browser must persist through subsequent visits to `/`.
- Preserve query strings and destination fragments on ordinary locale navigation. Do not introduce a permanent redirect or shared caching of a preference-dependent response.
- Requests without cookies or language preferences receive English, preserving deterministic crawler access. Do not add user-agent detection.

## Current state and conventions

Next.js 15 App Router, React 19, strict TypeScript, next-intl 4, npm/Node 22, Vitest, Playwright Chromium. Deployment is Vercel via `.github/workflows/ci-cd.yml`. No architecture decision/spec files relevant to this feature were found. README currently explicitly promises URL-only locale selection: change that statement for the homepage only.

`src/middleware.ts:6` currently contains:

```ts
// The URL selects the language; browser preferences and saved cookies must not redirect it.
const localizedMiddleware = createMiddleware({ ...routing, localeDetection: false });
const blogMiddleware = createMiddleware({ ...routing, localeDetection: false, alternateLinks: false });
```

The middleware parses blog routes before choosing the blog handler, and retains a 307 fallback for languages without a published blog. Preserve this fallback and its alternateLinks setting.

`src/i18n/routing.ts:3` defines:

```ts
export const routing = defineRouting({
  locales: ["en", "fr", "de", "es", "pt-BR", "pt-PT"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
```

`localeSwitchPath` returns explicit `/${locale}`. `src/components/marketing/LocaleSwitcher.tsx` builds normal anchor links from that function, adding the current route. Keep that structure, the existing visual design, and server-first behavior.

`tests/e2e/seo-improvements.spec.ts:8` asserts that `/`, `/privacy`, `/terms` ignore preferences. Only remove `/` from this existing invariant. Keep the content-route assertions.

`tests/e2e/blog.spec.ts:171` asserts `/blog` stays English with `NEXT_LOCALE=fr` and `Accept-Language: fr-FR`. Keep it.

Installed next-intl middleware resolves explicit prefix, cookie, header, default in that order when detection is enabled. Its cookie synchronization runs even with detection disabled: an existing cookie differing from the rendered locale is updated. Consequently merely enabling detection on `/` is insufficient: English content reads would reset a saved French choice. For unprefixed content handlers, use `localeCookie: false` alongside `localeDetection: false`; explicit-prefix handlers retain cookie synchronization. Confirm against installed middleware before implementation.

Conventions: double-quoted strings, semicolons, `@/` imports in source, relative imports in Playwright tests, `expect`/`test` from `@playwright/test`. Model response assertions after `tests/e2e/seo-improvements.spec.ts`, menu interactions after its explicit switching test.

## Scope

Only modify:

- `src/middleware.ts`
- `tests/e2e/seo-improvements.spec.ts`
- `tests/e2e/locale-detection.spec.ts` (create)
- `README.md`
- `plans/README.md` (status only)

Do not change translations, locale routes, switcher appearance, metadata, sitemap, blog fallback, dependencies, analytics, consent, or snapshots. No client-side detection, IP lookup, or external services.

## Commands

Commands verified from package scripts/configuration, not executed in this planning pass:

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Unit checks | `npm test` | all pass |
| Production test build | `npm run build:test` | exit 0 |
| Focused HTTP/browser tests after build | `npx playwright test tests/e2e/locale-detection.spec.ts tests/e2e/seo-improvements.spec.ts tests/e2e/blog.spec.ts tests/e2e/seo.spec.ts` | all pass |
| Full browser regression after focused checks | `npx playwright test` | all pass, no snapshot updates |

Playwright starts the production server on the origin configured by `tests/e2e/origin.ts` (default localhost:3100); it probes `/fr`. Do not use a stale build or running server.

## Git workflow

Existing plan index records an owner preference for main-checkout work without commits. This plan itself authorizes no commits, pushes, merges, or deployment. If dispatched under improve execute, follow its isolated-worktree rules and resolve any checkout-policy conflict before mutation.

## Steps

### 1. Separate homepage detection from fixed content routing

In `src/middleware.ts`, create a module-level homepage next-intl handler with `localeDetection: true`. Invoke it only for pathname exactly `/`, before the existing blog branch. Keep `localeDetection: false` on content routes and all explicit prefix paths. For unprefixed content disable locale cookie synchronization; for explicit prefixes retain it. Determine supported prefixes from `routing.locales` by the first whole path segment (never substring matching). Keep module-level handlers instead of recreating them per request. Preserve the matcher, blog routing, and current fallback behavior. Do not globally enable detection in shared routing.

Verify: `npm run typecheck` and `npm run lint` → exit 0.

### 2. Update the old invariant and add regression coverage

Remove only `/` from the preference-ignoring content test in `tests/e2e/seo-improvements.spec.ts`. Add isolated HTTP and browser cases in `tests/e2e/locale-detection.spec.ts` following the patterns below. Avoid cookie leakage between matrix rows: use fresh contexts or explicitly clear cookies. Update README's locale principle to explain homepage detection versus fixed content URLs and saved choices.

Verify: `npm test` → all pass; `npm run build:test` → exit 0; focused test command above → all pass.

### 3. Verify the complete navigation contract

Run the full browser suite against that build. Inspect the final diff for unexpected scope and snapshot changes. Record verification results and update plan status only when reviewed.

Verify: `npx playwright test` → all pass; `git diff --check` → exit 0; `git status --short` → only approved paths changed relative to starting state.

## Test plan

HTTP tests must use `maxRedirects: 0` to assert redirect status and Location pathname, then follow using the same cookie context to verify final HTML language and absence of loops:

1. `/` + fr-FR → temporary redirect `/fr`; query string retained.
2. `/` + each supported locale → expected locale home (English 200).
3. `/` without preferences → 200 English; unsupported header → English.
4. Cookie fr + header en → `/fr`; cookie en + header fr → 200 English.
5. Invalid cookie + header fr → `/fr`; malformed/weighted header handled without 500; `es;q=0.5,fr-FR;q=0.9` selects fr.
6. Explicit `/fr` + English cookie/header → French; `/de` + French preference → German.
7. `/en` + French preference canonicalizes to `/`, saves en, final HTML en, no redirect loop. Repeat on `/en/privacy` and `/en/blog` to exercise existing handlers.
8. French cookie survives sequential reads of `/privacy`, `/terms`, `/blog`, and an existing English article; subsequent `/` still redirects to `/fr`. Assert these reads remain English.
9. French-browser browser context: auto arrive at `/fr`, use desktop menu to choose English, visit `/` again and stay English. Repeat menu selection on mobile using the existing list variant and on a legal page.
10. Explicit blog/localized content behavior and SEO invariants remain covered by existing suites. Verify root preference responses are not publicly cacheable (inspect Cache-Control; prevent shared caching if necessary within middleware scope).

## Done criteria

- All commands above exit 0 and no visual baselines change.
- New automated tests prove detection, saved-choice priority, explicit-English loop prevention, and cookie preservation through content navigation.
- README describes the actual homepage-only behavior.
- Only in-scope files changed; plan index reflects reviewed status.

## STOP conditions

- Relevant excerpts drifted or current tests encode additional incompatible locale requirements.
- Installed middleware does not synchronize the English cookie before the `/en` redirect.
- Meeting cookie/cache requirements requires modifying out-of-scope infrastructure or navigation components.
- A gate fails twice after a reasonable repair attempt; report the failing command and cause.
- Product intent requires country-based selection or detection on all content URLs; this plan intentionally specifies browser-based homepage detection.

## Maintenance notes

New locales must extend the detection matrix via shared routing data. Keep homepage language redirects temporary and preference-specific; review Vercel cache behavior on eventual deployment. The unprefixed English homepage can redirect for humans with non-English preferences, so it no longer has the former preference-independent HTTP contract. Explicit localized content, canonical metadata, sitemap and no-preference English access remain stable. This focused investigation did not audit unrelated application security, performance, content accuracy, or the live deployment.

## Execution and review — 2026-11-14

User explicitly requested this same source tree on a new feature branch, overriding the skill's default isolated-worktree flow and the older main-checkout preference. Implementation is uncommitted on `feat/automatic-homepage-language`; no push or deployment.

Implementation review: scoped middleware, tests and README changes match the contract. Reviewer independently passed typecheck, lint, 163 unit tests, production test build, and diff whitespace checks. Reviewer read the full implementation/test diff. All 22 new language HTTP/browser tests pass in both executor and reviewer full-suite runs. No visual baselines changed.

Accepted test adjustment: Next.js manages RSC Vary headers on the English rewrite, so preference-specific Vary assertions apply to redirects only. Every homepage locale still requires private/no-store and rejects public/shared cache headers. Relative Location headers are resolved against the test origin.

Full regression gate remains unsatisfied: executor run 165 passed / 75 failed; independent reviewer run 166 passed / 74 failed. Failures occur in existing blog, landing, not-found, privacy and terms tests, including screenshots, shell and anchor assertions. Verification-only unchanged HEAD copy in `/tmp/mochi-plan016-baseline.Lwnm6W` reproduced 33 failures from the executor run; partial baseline ended with 48 passed, 39 failed, 4 interrupted and 127 not run. This is partial attribution, not evidence that every full-suite failure predates the feature. Concurrent browser runs also produced timing noise. Privacy network traces identify missing local `/_vercel/insights/script.js` among shell failures. No unrelated code, tests or snapshots were repaired.

Verdict: implementation reviewed; plan BLOCKED on the full regression gate, rather than claiming all original done criteria passed. Remaining work is to resolve or formally accept the existing regression-suite failures before marking the plan DONE. Logs: `/tmp/mochi-plan016-review-build.log`, `/tmp/mochi-plan016-review-tests.log`, `/tmp/mochi-plan016-full-tests.log`, `/tmp/mochi-plan016-baseline-tests.log`.
