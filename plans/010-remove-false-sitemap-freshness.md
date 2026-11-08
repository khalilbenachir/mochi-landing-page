# Plan 010: Stop reporting every page as newly modified on every build

> **Executor instructions**: Follow the plan step by step, run every
> verification command, and stop rather than improvising when a STOP condition
> occurs. Update this plan's status in `plans/README.md` when complete unless a
> reviewer told you they own the index.
>
> **Drift check (run first)**:
> `git diff --stat cd31005..HEAD -- src/app/sitemap.ts src/app/sitemap.test.ts src/i18n/routing.ts src/features/landing/content/landing.ts`
> Compare the live sitemap implementation with the excerpt below. Stop on a
> material mismatch.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plan 008 recommended, not technically required
- **Category**: bug
- **Planned at**: commit `cd31005`, 2026-11-08

## Why this matters

The static sitemap assigns `new Date()` to every locale during each build. A
deployment therefore claims that all six pages changed even when no content
changed, making the freshness signal untrustworthy. The repository has no
content revision date or release timestamp that can substantiate `lastmod`, so
the accurate behavior is to omit it until such a source exists.

## Current state

- `src/app/sitemap.ts:15-20` returns one entry per locale:

  ```ts
  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
  ```

- The route is `force-static`, so the timestamp represents build time rather
  than content time.
- `src/i18n/routing.ts` is the source of truth for six locales and canonical
  paths. Preserve its `localePath` behavior and the complete alternate cluster.
- There is no current unit test for `sitemap()`; use the direct-function Vitest
  style in `src/i18n/messages.test.ts` rather than parsing XML in a unit test.
- Plan 012 will later verify the serialized XML over HTTP. This plan must still
  add a focused regression test of its own.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Focused test | `npm test -- src/app/sitemap.test.ts` | new sitemap tests pass |
| Typecheck | `npm run typecheck` | exit 0 |
| Build | `npm run build:test` | exit 0; `/sitemap.xml` is generated |
| Full check | `npm run check` | exit 0 |

If plan 008 is not complete, use
`env NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build` instead of
`npm run build:test` for this plan only.

## Scope

**In scope**:

- `src/app/sitemap.ts`
- `src/app/sitemap.test.ts` (create)
- `plans/README.md` (status only)

**Out of scope**:

- Adding a guessed date, Git commit date, filesystem modification time, build
  time, or deployment time under another name.
- Changing locale routes, canonical paths, `changeFrequency`, priority, or
  alternate-language behavior.
- Search Console submission or hosting configuration.
- Metadata, robots, JSON-LD, and visible page content.

## Git workflow

- Work directly in the current `main` checkout with no branch, worktree,
  commit, push, or pull request unless the operator explicitly changes that
  instruction.
- Preserve unrelated work and stop if the tree is unexpectedly dirty.

## Steps

### Step 1: Characterize the sitemap contract

Create `src/app/sitemap.test.ts` and call the exported `sitemap()` function
directly. Use `routing.locales`, `routing.defaultLocale`, `localePath`, and
`SITE_URL` to derive expectations rather than duplicating locale arrays.

Assert:

- the entry count equals `routing.locales.length`;
- each expected canonical URL appears exactly once;
- every entry carries the complete language map plus `x-default`;
- each language URL uses the correct canonical locale path;
- `changeFrequency` remains `monthly` and priority remains `1`;
- no entry has a `lastModified` property.

The last assertion will fail against the current implementation and is the
regression this plan fixes.

**Verify**: `npm test -- src/app/sitemap.test.ts` → fails only because
`lastModified` is currently present. If it fails for another reason, stop and
correct the test before changing production code.

### Step 2: Remove the unsupported timestamp

Delete only `lastModified: new Date()` from `src/app/sitemap.ts`. Do not replace
it with another dynamic or inferred date. Preserve all other fields and the
typed `MetadataRoute.Sitemap` return value.

**Verify**: `npm test -- src/app/sitemap.test.ts` → all sitemap tests pass.

### Step 3: Verify serialized XML

Build the app with an explicit test origin and inspect
`.next/server/app/sitemap.xml.body`.

The XML must still contain:

- six `<url>` entries;
- canonical `<loc>` values for `/`, `/fr`, `/de`, `/es`, `/pt-BR`, and
  `/pt-PT`;
- all six `hreflang` alternates plus `x-default` on every entry;
- `changefreq` and `priority` if Next.js continues serializing them;
- no `<lastmod>` element.

**Verify**:

```bash
npm run build:test
rg -n "<lastmod>|<loc>|hreflang=\"x-default\"" .next/server/app/sitemap.xml.body
```

Expected: `<loc>` and `x-default` matches exist; `<lastmod>` has no match.

### Step 4: Run the repository gate

Run `npm run check`. No visual snapshots should change because this is a static
metadata route only.

**Verify**: `npm run check` → exit 0.

## Test plan

- New unit test: `src/app/sitemap.test.ts`.
- Derive all expectations from the typed routing source.
- Assert both URL correctness and the deliberate absence of `lastModified`.
- Inspect generated XML after the production-style test build.
- Plan 012 will later add the same invariant at the HTTP boundary.

## Done criteria

- [ ] `sitemap()` returns exactly one entry per routed locale.
- [ ] Every entry contains the complete alternate-language cluster and `x-default`.
- [ ] No sitemap entry has a `lastModified` property.
- [ ] Generated sitemap XML contains no `<lastmod>` element.
- [ ] `npm run check` exits 0.
- [ ] Only `src/app/sitemap.ts`, the new focused test, plan status, and ignored build output changed.
- [ ] `plans/README.md` marks plan 010 `DONE`.

## STOP conditions

Stop and report if:

- The project gains a documented, authoritative per-page content timestamp
  before this plan executes. In that case, the plan needs redesign rather than
  deleting a now-valid signal.
- Locale routing or sitemap generation has materially changed since `cd31005`.
- Removing `lastModified` requires changing locale or canonical behavior.
- A verification command fails twice after a reasonable correction.

## Maintenance notes

- Reintroduce `lastModified` only when it can be derived from an authoritative
  content revision or release date that remains stable across identical builds.
- Do not use the current clock or filesystem mtimes; both recreate the same
  false-freshness problem.
- Reviewers should inspect the serialized XML, not only the TypeScript object.
