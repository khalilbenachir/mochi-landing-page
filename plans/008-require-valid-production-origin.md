# Plan 008: Require a valid production origin for every crawler artifact

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat cd31005..HEAD -- src/features/landing/content/landing.ts src/features/landing/content/site-url.ts src/features/landing/content/site-url.test.ts package.json README.md`
> If an in-scope file changed since this plan was written, compare the current
> state below with the live code. Stop on a material mismatch.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `cd31005`, 2026-11-08

## Why this matters

The production build currently succeeds without `NEXT_PUBLIC_SITE_URL`. In
that case the sitemap and JSON-LD publish `http://localhost:3000`, while
canonical links, language alternates, and the robots sitemap declaration are
omitted. A deploy can therefore be healthy from the framework's perspective
and still ship a contradictory crawler contract. This plan makes an absolute,
root-only HTTP(S) origin mandatory for production builds while preserving a
convenient local-development fallback and a deterministic test build.

## Current state

- `src/features/landing/content/landing.ts:3-10` trims one trailing slash but
  does not validate the configured value or require it in production:

  ```ts
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  export const PUBLIC_SITE_URL = configuredSiteUrl
    ? configuredSiteUrl.replace(/\/$/, "")
    : undefined;

  export const SITE_URL = PUBLIC_SITE_URL ?? "http://localhost:3000";
  ```

- `src/app/[locale]/layout.tsx:35-46` adds `metadataBase`, canonical, and
  language alternates only when `PUBLIC_SITE_URL` exists.
- `src/app/robots.ts:6-10` adds `Host` and `Sitemap` only when the same value
  exists.
- `src/app/sitemap.ts:8-20` and
  `src/components/seo/StructuredData.tsx:17-38` always use `SITE_URL`, so the
  fallback leaks into machine-readable production output.
- `package.json:13-17` invokes `next build` without a public origin from both
  `test:e2e` and `check`. Playwright serves at `http://localhost:3100`, defined
  in `tests/e2e/origin.ts`, while the current fallback is port 3000.
- The repository uses colocated Vitest files under `src/**/*.test.ts`. Model
  the new table-driven validation tests after
  `src/i18n/messages.test.ts:34-61`.
- `README.md:18-23` documents the production variable, but describes it as an
  instruction rather than an enforced build contract.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Focused tests | `npm test -- src/features/landing/content/site-url.test.ts` | all new URL-validation tests pass |
| Test build | `npm run build:test` | exit 0; all localized pages and metadata routes prerender |
| Production failure check | `env -u NEXT_PUBLIC_SITE_URL npm run build` | non-zero exit with the intentional configuration error |
| Production success check | `env NEXT_PUBLIC_SITE_URL=https://example.com npm run build` | exit 0 |
| Full check | `npm run check` | exit 0 |

## Scope

**In scope** (the only files to modify or create):

- `src/features/landing/content/site-url.ts` (create)
- `src/features/landing/content/site-url.test.ts` (create)
- `src/features/landing/content/landing.ts`
- `package.json`
- `README.md`
- `plans/README.md` (status only)

**Out of scope**:

- `src/app/[locale]/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, and
  `src/components/seo/StructuredData.tsx` — they should consume the corrected
  constants without behavior-specific rewrites in this plan.
- The real production domain. Do not guess it or commit a placeholder as the
  production value.
- `APP_STORE_URL` and any other launch configuration.
- Hosting-provider, CDN, WAF, DNS, or Search Console configuration.
- `.env*` files and secrets.

## Git workflow

- Work directly in the current `main` checkout, as requested by the owner and
  recorded in `plans/README.md`.
- Do not create a branch, worktree, commit, push, or pull request unless the
  operator explicitly changes that instruction.
- Preserve unrelated changes. If the working tree is not clean at the start,
  stop and report the exact paths before editing.

## Steps

### Step 1: Add a pure site-origin resolver

Create `src/features/landing/content/site-url.ts` with small pure functions so
the rules can be tested without mutating global environment variables or
fighting the module cache.

The resolver must:

1. Trim surrounding whitespace.
2. Accept only absolute `http:` or `https:` URLs.
3. Reject usernames, passwords, non-root paths, query strings, and fragments.
4. Normalize a trailing `/` by returning `URL.origin`.
5. Return `undefined` when the value is absent in `development` or `test`.
6. Throw a clear error mentioning `NEXT_PUBLIC_SITE_URL` when the value is
   absent in `production` or when a supplied value is invalid.

Keep `http://localhost:<port>` valid because test and local preview origins use
HTTP. Do not accept protocol-relative URLs. Prefer an options object such as
`{ value, nodeEnv }` so every branch is directly testable.

**Verify**: `npm run typecheck` → exit 0, no TypeScript errors.

### Step 2: Cover the resolver's complete contract

Create `src/features/landing/content/site-url.test.ts`. Add table-driven cases
for:

- `https://example.com`, `https://example.com/`, and surrounding whitespace;
- `http://localhost:3100`;
- a missing value in `development` and `test`;
- a missing value in `production`;
- malformed input;
- `ftp:` and protocol-relative input;
- embedded credentials;
- a non-root path;
- a query string;
- a fragment.

Assert the exact normalized origin for valid inputs. For invalid inputs, assert
the error mentions `NEXT_PUBLIC_SITE_URL` and the reason category without
asserting a whole stack trace.

**Verify**:
`npm test -- src/features/landing/content/site-url.test.ts` → all cases pass.

### Step 3: Make the landing configuration use the resolver

In `src/features/landing/content/landing.ts`, replace the ad hoc trim and
trailing-slash removal with the new resolver. Pass
`process.env.NEXT_PUBLIC_SITE_URL` and `process.env.NODE_ENV` explicitly.

Preserve these exported contracts:

- `PUBLIC_SITE_URL` remains `string | undefined` in non-production local/test
  execution and is a normalized origin when configured.
- `SITE_URL` remains a string and may use `http://localhost:3000` only outside
  production.
- `SITE_NAME`, `APP_STORE_URL`, IDs, and product configuration remain
  byte-for-byte unchanged.

Do not catch and suppress the production error. The point is to fail the build
before crawler artifacts can be emitted with localhost URLs.

**Verify**:
`npm test -- src/features/landing/content/site-url.test.ts && npm run typecheck`
→ both commands pass.

### Step 4: Give verification builds an explicit non-production origin

Update `package.json` without adding dependencies:

- Add `build:test`, which sets
  `NEXT_PUBLIC_SITE_URL=http://localhost:3100` and runs `next build`.
- Make `test:e2e` and `test:e2e:update` call `npm run build:test` before
  Playwright so built metadata matches `tests/e2e/origin.ts`.
- Make `check` call `npm run build:test` rather than bare `npm run build`.
- Keep `build` as `next build`; it must still require an externally supplied
  production origin.

The repository currently targets Node 22 on macOS and its documented commands
already use POSIX shells. Do not add `cross-env` solely for this change. If CI
or a required supported environment proves POSIX assignment is invalid, stop
and report rather than adding a dependency silently.

**Verify**: `npm run build:test` → exit 0 and the route table includes all six
localized pages plus `/robots.txt` and `/sitemap.xml`.

### Step 5: Prove both sides of the production gate

Run the negative build first:

`env -u NEXT_PUBLIC_SITE_URL npm run build`

It must fail with the intentional message naming `NEXT_PUBLIC_SITE_URL`. It
must not fail earlier for lint, type, import, or unrelated build errors.

Then run:

`env NEXT_PUBLIC_SITE_URL=https://example.com npm run build`

It must succeed. Inspect `.next/server/app/sitemap.xml.body` and confirm it
contains `https://example.com/` and no `localhost`. Inspect
`.next/server/app/robots.txt.body` and confirm both `Host` and `Sitemap` use the
same origin.

**Verify**:
`rg -n "localhost|https://example.com" .next/server/app/{robots.txt.body,sitemap.xml.body}`
→ matches only `https://example.com`; no `localhost` match.

### Step 6: Document the enforced contract

Update `README.md:18-35` to state:

- production `npm run build` fails without a valid root origin;
- the value must look like `https://example.com`, with no path/query/hash;
- `npm run build:test` is the deterministic local/CI build used by checks;
- `npm run test:e2e` builds against the Playwright origin.

Do not document a real production domain until the owner supplies it.

**Verify**:
`rg -n "NEXT_PUBLIC_SITE_URL|build:test|localhost:3100" README.md package.json`
→ the production rule and test-build origin are documented and consistent.

## Test plan

- New file: `src/features/landing/content/site-url.test.ts`.
- Follow the table-driven Vitest style in `src/i18n/messages.test.ts`.
- Cover accepted normalization and every rejected URL component separately.
- Exercise the actual production gate with one expected-failure build and one
  expected-success build.
- Re-run all existing tests through `npm run check`.

## Done criteria

- [ ] Missing `NEXT_PUBLIC_SITE_URL` causes `npm run build` to fail clearly.
- [ ] A valid absolute root HTTP(S) origin makes `npm run build` succeed.
- [ ] Invalid protocols, credentials, paths, queries, and fragments are rejected.
- [ ] `npm run build:test` exists and uses `http://localhost:3100`.
- [ ] `test:e2e`, `test:e2e:update`, and `check` use `build:test`.
- [ ] Generated sitemap and robots files contain the configured origin and no localhost URL in a production build.
- [ ] `npm run check` exits 0.
- [ ] Only in-scope files and ignored build output changed.
- [ ] `plans/README.md` marks plan 008 `DONE`.

## STOP conditions

Stop and report rather than improvising if:

- The current exports or package scripts materially differ from the excerpts.
- The hosting platform intentionally builds production previews without a
  public origin and the owner has not defined what canonical origin previews
  should use.
- A supported environment cannot run POSIX environment assignments.
- Correcting the issue appears to require guessing a real domain or committing
  an `.env` file.
- A verification command fails twice after a reasonable correction.

## Maintenance notes

- Any future metadata route that emits absolute URLs must consume `SITE_URL` or
  `PUBLIC_SITE_URL`; it must not read the environment variable independently.
- Reviewers should verify that the production failure is intentional and that
  local development still works without an environment file.
- Plan 012 adds HTTP-level regression coverage around the generated crawler
  artifacts after all SEO fixes have landed.
