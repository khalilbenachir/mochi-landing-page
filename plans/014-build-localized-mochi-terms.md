# Plan 014: Build the localized Mochi Terms of Use page

> Executor: implement this plan and run its verification gates. The user explicitly requests a finished page following the privacy-page workflow, not an audit alone. The advisor owns this plan and its index; do not edit the index. Work in the existing checkout, preserving the prior owner workflow recorded in the index: no branches, worktrees, commits, pushes, or publication. Report obstacles and evidence honestly.
>
> Drift check: `git diff --stat f7a2585..HEAD -- src/features/privacy src/app messages tests/e2e README.md`. Compare the current-state excerpts before starting.

## Status

- Priority: P1
- Effort: L
- Risk: MED (new localized route and editorial legal draft; existing pages should remain unchanged)
- Depends on: existing privacy implementation, already present at HEAD
- Category: direction
- Planned at: commit `f7a2585`, 2026-11-09
- Review: APPROVED 2026-11-09. Implemented uncommitted in the shared checkout. `npm run check` passed (75 unit tests and production build); full Playwright regression passed (143 tests, including 26 Terms tests). Advisor independently reviewed source, all-language preservation of existing messages, desktop/phone screenshots, generated artifact and scope. Existing visual baselines are unchanged. Copy remains a draft for owner review.
- Typography refinement: At the owner's request, summary and contact heading fonts now match Privacy exactly; the email line retains its already-identical styling. French computed font family, size, weight and line height match at 390, 1024 and 1440px. Style/type checks, `build:test` and all 26 Terms browser tests passed; only Terms baselines were refreshed and reviewed.

## Why this matters

The footer already links to `/terms`, which currently resolves to the branded 404. The owner supplied a Terms page mockup and asks to create it following the same steps as Privacy, including creating artwork when needed. Ship a working localized Terms page that fits the existing Mochi site and closely follows the supplied mockup's content and art direction.

## Current state and conventions

- Next.js 15 App Router, React 19, strict TypeScript, Tailwind 4, next-intl, npm; dependencies already installed. `src/i18n/routing.ts` defines EN (unprefixed), FR, DE, ES, pt-BR and pt-PT. All six JSON files under `messages/` must have identical string-only schemas.
- `src/app/[locale]/privacy/page.tsx` validates locales, calls `setRequestLocale`, returns `PrivacyPage`, and exports route-specific metadata including canonical and full alternate cluster. Use it as the exact route pattern for `terms/page.tsx`.
- `src/features/privacy/components/PrivacyPage.tsx` composes a `main`, its `SiteHeader`, hero, four summary cards, reader and contact banner with `PosterStage`. Reuse its established typography and responsive geometry. `SiteFooter` is rendered ONCE by `src/app/[locale]/layout.tsx`; do not add another footer or globally restyle it to match the reference's older footer.
- `SiteHeader` already accepts `homeHref`, `sectionBase`, and `localeRoute`. Terms must pass the localized home for the first two and `/terms` for the last; changing language stays on Terms and feature links return home.
- `src/features/privacy/components/PrivacyContent.tsx:16-47` subscribes to `hashchange` with `useSyncExternalStore`, safely decodes the hash, scrolls its section and focuses the heading. Every section remains in server-rendered HTML. Use the same proven reader behavior for Terms. Avoid a broad Privacy refactor for this request.
- `src/features/privacy/content/contact-email.ts` exports the validated `PRIVACY_CONTACT_EMAIL`, driven by `NEXT_PUBLIC_CONTACT_EMAIL`. Reuse that existing address as the site contact; never invent an email. Development placeholder only; `build:test` pins `privacy@example.test`.
- `src/features/landing/components/shared/SiteFooter.tsx:7-11` already declares `{ key: "terms", slug: "terms" }` and localizes its href. No footer edit is needed.
- `src/app/sitemap.ts:8` currently says `return ["", "privacy"].flatMap((slug) => {`. Add `terms`; keep correct locale-specific alternate clusters, 0.3 priority for secondary routes, and no fabricated last-modified timestamp.
- `src/app/globals.css:188-195` owns privacy tokens. New Terms colors belong only in its `@theme static` block. Classes in `className` are the only styling mechanism: no CSS Modules, custom selectors, inline styles, arbitrary breakpoint names, or color literals in TSX. `PosterStage` defines `--spacing` as poster units. Match Privacy utilities and existing breakpoints (max-poster, max-nav, max-tablet, max-phone).
- Use existing `Button`, `Rays`, `Sparkle`, and lucide icons. Server-first: only the tiny hash reader needs a client boundary; avoid extra packages.

## Design and content brief (self-contained)

The user mockup is 1024px wide. Top: the shared Mochi pink navigation. Then a turquoise hero (~285px at the mockup size): dark navy rotated TERMS pill, large white rounded `Terms of use`, two lines `The simple rules for using Mochi.` / `Short, friendly and written for humans.`, italic localized last-updated date, and a large glossy pink Mochi wearing round purple glasses while holding a parchment, seated on a cream cushion at the right. Yellow rays and white sparkle accents surround the art.

Next is a saturated warm yellow/orange band with `The short version` and four white rounded cards. Use colorful prominent icons (pink HeartPlus, purple CalendarDays with droplet if practical, yellow/orange Crown, blue filled LockKeyhole). Card text:

1. `Not medical\nadvice` — `Mochi helps you track, it doesn’t diagnose.` links to health disclaimer.
2. `Not birth\ncontrol` — `Predictions are estimates, never contraception.` links to health disclaimer.
3. `Mochi Plus\nis optional` — `Billed by Apple, cancel anytime in Settings.` links to subscriptions.
4. `Your data\nis yours` — `See our privacy policy.` links to the localized `/privacy` route (a real link, not a faux hash).

Below is a white reader: sticky rounded white sidebar at left, article at right, navy rounded bold headings prefixed by yellow rays. Seven sidebar sections, in order: `Using Mochi`, `Health disclaimer`, `Mochi Plus subscriptions`, `Your content`, `Acceptable use`, `Changes to these terms`, `Contact`. Stable IDs: `using`, `health`, `subscriptions`, `content`, `acceptable-use`, `changes`, `contact`. Pink selected sidebar state, like Privacy. At mobile widths sidebar becomes a compact grid above the full readable article.

Use the supplied mockup's English first two sections, keeping their meaning:

- Using body: `Mochi is a period tracking app for iPhone that helps you log your cycle, symptoms, moods and more, get predictions and set helpful reminders (such as a pad change reminder), and collect cute flavors through daily check-ins.`
- Using detail: `By using Mochi, you agree to these Terms of Use. If you don’t agree with them, please don’t use the app.`
- Health body: `Mochi is for general wellness and cycle tracking only. It is not a medical device and does not provide medical advice, diagnosis or treatment. Always contact a qualified healthcare professional if you have any health concerns or questions about your cycle.`
- Health detail: `Mochi can help you spot patterns and estimate your next period, fertile window and ovulation day based on the information you log, but these are estimates and may not be accurate for everyone.`
- Warm cream health callout with pink heart/exclamation icon: `Mochi’s predictions are estimates. They are not birth control and don’t replace advice from a doctor.`

Author short plain-language DRAFT copy for the remaining sections, consistent with existing product facts. Subscriptions: optional Plus, App Store purchase sheet displays price and billing period, recurring subscriptions renew until canceled, manage/cancel in iPhone Settings > your name > Subscriptions, deleting the app does not cancel a subscription. Content: user keeps ownership of logged entries; refer to localized Privacy policy for handling; avoid inventing data export functionality or cloud guarantees. Acceptable use: personal lawful use, do not misuse/disrupt the app or access others' data. Changes: dated updates, review when app changes; avoid waiving statutory rights or inventing a jurisdiction or legal entity. Contact: configured email, avoid sharing sensitive health information. Do NOT claim this draft is lawyer-approved. Document the draft status in the feature README and final report, not an intrusive site implementation notice.

Verified editorial references (not a claim that Mochi has adopted Apple's Standard EULA): https://support.apple.com/en-us/118428 and https://www.apple.com/legal/internet-services/itunes/dev/stdeula/ . Link the subscription cancellation support page where useful, using translated link text. No invented price, trial, refund promise, age threshold, publisher address or legal entity.

Complete all six languages with natural locale-specific translations. Keep the primary English text faithful to the brief. A deliberate `TERMS_UPDATED_AT = "2026-11-09T00:00:00Z"` is appropriate for this new draft; format like Privacy with UTC.

Bottom: rounded cream contact banner with small existing wondering/peeking Mochi art, `Questions about these terms?`, `Email us at {email}`, pink `Contact us` button. Use the existing `public/privacy-art/privacy-contact.webp` or existing wondering face under `public/mochi/faces/wondering.webp`; draw a small purple question mark through text/decor if useful. Do not use the full large 404 image where a peeking mascot works better. Keep the shared footer design unchanged.

## Artwork

The advisor generated the final hero with built-in ImageGen. Input PNG:
`/Users/khalil/.codex/generated_images/01a1c212-a4bf-7992-8e10-8aca551e60ad/exec-7a7f8897-37fb-4e20-bc43-35ca3d6eea4f.png`

Inspect then encode with installed `sharp` as `public/terms-art/terms-mochi-scroll.webp`, retaining alpha, fitting within width 1024 without distortion, quality around 88. Inspect metadata; set Image's intrinsic width/height to the actual output size. Preserve the original outside the repo. Do not generate or fabricate a substitute. Document dimensions, size, built-in tool and exact prompt in `src/features/terms/README.md`:

`Use case: stylized-concept. Asset type: transparent website Terms of Use hero illustration for Mochi. Generate a single adorable glossy pastel-pink Mochi rice-cake mascot matching the user reference: a squat rounded soft triangle blob with a bright pink soft edge, white shine on upper left, two closed happy navy curved eyes, tiny smiling mouth, rosy oval cheeks and two small pink oval hands. It wears large thin round dark-purple reading glasses and holds an unfurled cream parchment scroll in front and to its right, with rounded curled top and 4 short tan placeholder strokes, no readable text. It sits on a soft cream flower-shaped mochi cushion. Match the soft illustrated dimensional sticker style in the attached Terms page reference, clean simple smooth painted shading with lovely pink highlights, not a realistic food photograph. Framing: full mascot, entire cushion and scroll visible, tight centered 5:4 landscape composition, small transparent margin. Genuine transparent alpha background, no blue backdrop, no rectangle, no checkerboard baked into the image, no words, no watermark, no scene. The art will sit on a turquoise-blue website hero next to white text. Do not draw website UI.`

## Scope

In scope:
- create `src/app/[locale]/terms/page.tsx`
- create `src/features/terms/{components,content}/` and `src/features/terms/README.md`
- create `public/terms-art/terms-mochi-scroll.webp`
- add Terms messages to all six `messages/*.json` (do not alter existing keys)
- add Terms-only theme tokens in `src/app/globals.css`
- update `src/app/sitemap.ts`, `src/app/sitemap.test.ts`, the sitemap assertions in `tests/e2e/seo.spec.ts`
- create `tests/e2e/terms.spec.ts` and its own desktop/phone snapshots
- update root `README.md` Terms documentation and prelaunch checklist

Out of scope: dependency/lockfile changes, privacy or landing source refactors, existing screenshot baseline changes, shared footer/header visual changes, hosting/publishing, git changes to branch/commits, prices or additional app features. Ask reviewer before expanding scope.

## Commands

| Purpose | Command | Success |
|---|---|---|
| Policy + types + lint + unit + build | `npm run check` | exit 0 |
| Focused Terms baseline capture | `npx playwright test tests/e2e/terms.spec.ts --update-snapshots` | all pass, only Terms baselines added |
| Full regression after the same build | `npx playwright test` | all pass without changing old baselines |
| Fast targeted unit verification | `npm test -- src/features/terms src/app/sitemap.test.ts src/i18n/messages.test.ts` | all pass |
| Diff/scope | `git status --short` and `git diff --check` | only in-scope files plus advisor plans; no whitespace errors |

Use inherited environment; never inspect or print `.env` values. `npm run build:test` sets deterministic public values. If a server is needed, read Sites local-preview guidance before starting; respect any existing server. Production build and Playwright may need network/browser permissions: report real failures, do not pretend they passed.

## Steps

### 1. Prepare artwork and localized content

Encode the supplied hero, add typed anchor/date/asset contracts under `src/features/terms/content/terms.ts`, and add complete `TermsOfUse` message trees in all languages. Model asset integrity tests on `src/features/privacy/content/policy.test.ts`; meaningfully verify the new artifact exists and retains alpha, dimensions match contract, all declared anchors have localized copy, summary destinations resolve. Avoid tests that merely repeat constants.

Verify: focused unit command above exits 0, and sharp metadata reports the expected alpha WebP.

### 2. Build the server-first page and hash reader

Implement a `TermsPage`, minimal `TermsContent` client reader and `TermsIcon` with the shared primitives and existing responsive patterns. Keep seven sections readable in normal document flow. Set `localeRoute="/terms"`. Summary/privacy links, contact mailto/fallback, direct hashes, encoded/invalid hash handling, heading focus and browser history must work. The selected hash defaults to `using`. Use accessible text and hide decorative artwork/icons appropriately. Match the supplied composition while retaining the site's shared footer and fonts.

Verify: `npm run typecheck` and `npm run check:styles` exit 0.

### 3. Route and crawler integration

Add localized route-specific metadata exactly following Privacy. Include Terms in sitemap and generalize both sitemap test suites from home/privacy booleans to explicit slugs so each cluster remains correct. Terms must not render landing FAQ/MobileApplication JSON-LD. Keep existing footer hrefs.

Verify: focused unit command exits 0; `npm run check` exits 0 and prerenders six Terms routes.

### 4. Browser coverage and visual inspection

Model `tests/e2e/terms.spec.ts` on `privacy.spec.ts`. Cover all six locales at 320, 390, 759, 800, 1024, 1440px: HTTP 200, correct lang, single main/h1/footer, seven sidebar anchors, four cards, no horizontal or key-text overflow and no browser errors. Cover no-JS reading of all seven sections, summary links, privacy card target, every sidebar anchor, focus, encoded/invalid hashes and back navigation, configured contact mailto, locale switching preserving `/terms`, mobile home links, footer navigation from home/privacy to Terms, metadata/canonicals/alternate cluster and absence of landing JSON-LD. Capture full-page desktop 1440×1000 and phone 390×844 baselines only for Terms. Use `waitForPageAssets` before screenshots. Inspect captured screenshots; fix concrete clipping/overlap or missing art. Do not weaken tests or update existing baselines to hide regressions.

Verify: new Terms capture passes, full `npx playwright test` passes. The advisor independently reviews diffs and screenshots.

### 5. Documentation and handoff

Document Terms feature structure, stable anchors, intentional editorial date, reuse of contact configuration, complete localization, artwork prompt/provenance, and unapproved draft copy status. Remove root README's stale statement that Terms route is unimplemented; retain production configuration checklist. Report the actual test results and any skipped checks.

Verify: `git diff --check` exits 0; full diff stays in scope. Notify reviewer with changed files, check totals, screenshot paths and deviations.

## Done criteria

- [x] `/terms` and five locale-prefixed routes render 200 with correct localized content.
- [x] Four summary cards, seven always-readable sections and working contact/Privacy links.
- [x] Full hash/history/keyboard/no-JS contract passes browser tests.
- [x] New alpha hero ships in repo and displays without background or distortion.
- [x] Sitemap has 18 canonical entries, with correct separate alternate clusters.
- [x] `npm run check` and `npx playwright test` exit 0.
- [x] Desktop and phone screenshots inspected; existing baselines unchanged.
- [x] Only scoped source changes; no new dependencies, branch, commit or deployment.
- [x] Advisor updates index after independent review.

## STOP conditions

Stop and report if the supplied artwork cannot be read, if implementation requires changes outside scope, if verification fails twice after a reasonable attempted fix, or if a needed product/legal fact cannot be established. Never invent a company identity, refund/price promise, data handling feature, contact address, or enforceability claim. Editorial copy may be plain-language draft only.

## Maintenance notes

Future policy changes should update the deliberate Terms date and all six message trees. The owner must review the legal draft before launch. Keep `/terms` route preservation in both locale menus and preserve full no-JS readability if the reader UI changes. Artwork sources stay outside public deployment; the optimized alpha asset and documented prompt are sufficient for the website.
