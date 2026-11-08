# Plan 009: Ship manifest icons whose declared sizes match their bitmaps

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If a STOP condition occurs, stop and report — do not improvise.
> When done, update this plan's row in `plans/README.md` unless a reviewer told
> you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat cd31005..HEAD -- src/app/manifest.ts src/app/icon.png src/app/apple-icon.png src/features/landing/content/assets.ts src/features/landing/content/assets.test.ts public/mochi/app-icon.webp public/mochi/app-icon-192.png public/mochi/app-icon-512.png`
> Compare the current state excerpts below with live code. Stop on a material
> mismatch.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `cd31005`, 2026-11-08

## Why this matters

The web manifest advertises a 512×512 icon but serves a 256×256 WebP. Install
surfaces may reject the entry or assume pixels that do not exist. The browser
favicon and Apple touch icon are already correct; this plan preserves them and
adds explicit 192×192 and 512×512 PNG install assets whose dimensions are
enforced by tests.

## Current state

- `src/app/manifest.ts:16-18` declares one icon:

  ```ts
  icons: [
    { src: LANDING_ASSETS.appIcon, sizes: "512x512", type: "image/webp", purpose: "any" },
  ],
  ```

- `src/features/landing/content/assets.ts:3-15` maps
  `LANDING_ASSETS.appIcon` to `/mochi/app-icon.webp`.
- The bitmap at `public/mochi/app-icon.webp` is 256×256. It is also used by
  visible footer UI and JSON-LD, so do not replace or rename it.
- `src/app/icon.png` is a valid 64×64 favicon and
  `src/app/apple-icon.png` is a valid 180×180 Apple touch icon. They are not the
  defect and are out of scope.
- `src/features/landing/content/assets.test.ts:12-39` enforces that every file
  under `public/mochi` appears in `LANDING_ASSET_PATHS`; any new public asset
  must be added to the typed manifest in the same change.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect dimensions | `sips -g pixelWidth -g pixelHeight public/mochi/app-icon-192.png public/mochi/app-icon-512.png` | reports 192×192 and 512×512 |
| Asset tests | `npm run check:assets` | all asset tests pass |
| Unit tests | `npm test` | all tests pass |
| Build | `npm run build:test` | exit 0; manifest route is generated |
| Full check | `npm run check` | exit 0 |

If plan 008 has not landed, replace `npm run build:test` with
`env NEXT_PUBLIC_SITE_URL=http://localhost:3100 npm run build` for this plan's
verification only. Do not edit package scripts as part of plan 009.

## Scope

**In scope**:

- `public/mochi/app-icon-192.png` (create)
- `public/mochi/app-icon-512.png` (create)
- `src/features/landing/content/assets.ts`
- `src/features/landing/content/assets.test.ts`
- `src/app/manifest.ts`
- `plans/README.md` (status only)

**Out of scope**:

- `src/app/icon.png` and `src/app/apple-icon.png` — already correct.
- `public/mochi/app-icon.webp` — keep it for visible content and JSON-LD.
- New mascot art, a maskable icon, adaptive Android layers, or a redesigned
  brand mark.
- Social preview artwork; that belongs to plan 011.
- New image-processing npm dependencies.

## Git workflow

- Work directly in the current `main` checkout; do not create a branch,
  worktree, commit, push, or pull request unless the operator overrides this.
- Preserve unrelated changes. Stop if the working tree is unexpectedly dirty.

## Steps

### Step 1: Create deterministic install-icon derivatives

Use the existing 256×256 app icon as the exact visual source. Create PNG
derivatives without changing the composition, colors, corners, or mascot:

```bash
sips -s format png -z 192 192 public/mochi/app-icon.webp --out public/mochi/app-icon-192.png
sips -s format png -z 512 512 public/mochi/app-icon.webp --out public/mochi/app-icon-512.png
```

The 512 image is an upscaled compatibility asset, not new source art. Do not
apply sharpening, generative repainting, background removal, or a different
crop. A future release can replace it with an owner-supplied high-resolution
master while keeping the same path and dimensions.

**Verify**:
`sips -g pixelWidth -g pixelHeight public/mochi/app-icon-192.png public/mochi/app-icon-512.png`
→ exact dimensions 192×192 and 512×512.

### Step 2: Register both assets in the typed manifest

Add explicit keys such as `manifestIcon192` and `manifestIcon512` to
`LANDING_ASSETS` in `src/features/landing/content/assets.ts`. Keep
`appIcon: "/mochi/app-icon.webp"` unchanged.

Because `LANDING_ASSET_PATHS` flattens `LANDING_ASSETS`, the new files should
become part of the existing no-extra/no-missing invariant automatically. Update
the expected asset count in `assets.test.ts` from 25 to 27.

**Verify**: `npm run check:assets` → the existence and exact-public-directory
tests pass with no undeclared files.

### Step 3: Add dimension assertions without another dependency

Extend `src/features/landing/content/assets.test.ts` with a small PNG header
reader using Node's `readFileSync`. For PNG files, width and height are the
big-endian 32-bit integers at byte offsets 16 and 20 after the PNG signature.

The test must:

- assert the file has the PNG signature before reading dimensions;
- assert `manifestIcon192` is 192×192;
- assert `manifestIcon512` is 512×512;
- name the asset path in assertion messages.

Do not add `sharp`, `image-size`, or another package for two deterministic PNG
checks.

**Verify**: `npm test -- src/features/landing/content/assets.test.ts` → all
existing and new asset tests pass.

### Step 4: Correct the web manifest

In `src/app/manifest.ts`, replace the mismatched WebP entry with two PNG
entries using the new typed asset paths:

- 192×192, `type: "image/png"`, `purpose: "any"`;
- 512×512, `type: "image/png"`, `purpose: "any"`.

Do not declare `purpose: "maskable"`; the current artwork has not been reviewed
against the maskable-icon safe zone.

**Verify**: `npm run typecheck && npm run build:test` → both pass.

### Step 5: Inspect the generated manifest

After the build, read `.next/server/app/manifest.webmanifest.body`. It must
contain exactly the two new PNG icon entries with truthful size/type pairs and
must not claim that `/mochi/app-icon.webp` is 512×512.

**Verify**:
`rg -n "app-icon-(192|512)|app-icon.webp|192x192|512x512|image/png" .next/server/app/manifest.webmanifest.body`
→ both PNGs and both dimensions appear; `app-icon.webp` does not.

## Test plan

- Extend the existing asset-policy test instead of creating an unrelated test
  harness.
- Verify public asset declaration, PNG signature, and exact dimensions.
- Build and inspect the serialized manifest to confirm the TypeScript object is
  emitted as intended.
- No visual-baseline update is expected because the visible 256×256 WebP and
  existing favicon files remain unchanged.

## Done criteria

- [ ] `public/mochi/app-icon-192.png` is exactly 192×192.
- [ ] `public/mochi/app-icon-512.png` is exactly 512×512.
- [ ] Both files are included in `LANDING_ASSET_PATHS` and no undeclared public assets exist.
- [ ] The manifest exposes two truthful PNG entries and no mismatched WebP entry.
- [ ] `src/app/icon.png`, `src/app/apple-icon.png`, and `public/mochi/app-icon.webp` are unchanged.
- [ ] `npm run check` exits 0.
- [ ] Only in-scope files and ignored build output changed.
- [ ] `plans/README.md` marks plan 009 `DONE`.

## STOP conditions

Stop and report if:

- The current app icon is no longer 256×256 or no longer the approved brand
  artwork.
- `sips` is unavailable and no operator-approved deterministic image converter
  is installed. Do not add a dependency without approval.
- The generated PNG changes the crop, background, or colors relative to the
  existing icon.
- A platform requirement forces `maskable` handling; that needs a separate
  safe-zone design review.
- A verification command fails twice after a reasonable correction.

## Maintenance notes

- Replace the upscaled 512 PNG with a real high-resolution master when the app
  team supplies one, keeping the same path and test-enforced dimensions.
- Reviewers should verify the manifest paths and dimensions rather than judging
  only whether an icon appears in a browser tab.
- Plan 011 reuses the asset dimension-test pattern for the social card; plan
  012 verifies the manifest over HTTP.
