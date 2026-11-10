# Homepage spacing and Playwright QA

Tested locally on 10 November 2026 using Chromium. The initial spacing pass was checked against the production build; the latest spacing increase was checked against the development preview, with the seven development-run failures rechecked successfully against a fresh production build.

## Changes

- Increased shared section padding from approximately 39px to 135px per side at 1440px, from 56px to 112px on tablet, and from 44px to 88px on phone. Existing artwork that meets a section edge retains that treatment.
- Increased the hero content margin below navigation on desktop and mobile.
- Changed the account background to lavender (#EEE8FA) to distinguish it from the cream FAQ.
- Matched the account section to the new rhythm, separated its kicker from the heading, and increased its mobile content gaps.
- Increased FAQ row gaps and padding; enforced a minimum 44px button height on desktop and 50px on mobile.
- Made the phone hero heading scale down to fit 320px screens.
- Repositioned the comparison mascot and removed a pricing decoration that interfered with the heading.

## Verification

- Production build: passed, including lint and type validation.
- Style policy: 8 checks passed.
- Unit tests: 168 passed across 18 files.
- Homepage Playwright suite: 22 functional checks passed and 36 visual captures refreshed for the intentional layout changes. The latest development run passed 51 of 58 cases; seven cases reported hot-update JSON 404s and passed on the production recheck after stubbing the Vercel-hosted analytics script for local testing. The production server does not provide that hosting-specific endpoint. Refreshing a baseline records the new layout; it does not independently prove visual correctness.
- Six locales checked: English, French, German, Spanish, Brazilian Portuguese, and European Portuguese.
- Automated locale overflow checks: 390, 759, 1099, and 1440px; no horizontal overflow.
- Additional English layout inspection: 320, 375, 390, 640, 760, 1099, 1100, 1440, and 1600px. Found and fixed the 320px hero clipping and small desktop FAQ targets near 1100px.
- Additional 320px checks across all six locales: no horizontal overflow or heading overflow after the fix.
- Manual Playwright interaction check: all 11 FAQ items opened and closed; no broken images, broken internal section anchors, page errors, or console errors during that production-page check.
- Visually inspected full-page desktop and phone screenshots before and after the spacing changes.

## Scope

Local source changes only. No deployment performed. Browser verification used Chromium; Safari and Firefox were not tested. External App Store destination availability was not tested.

## Artwork adaptation

Resized and repositioned Mochi artwork across the homepage to suit the taller sections. Raised phone mockups, enlarged flavor artwork and the FAQ mascot, restored the full privacy and pricing mascots, centered the account and closing artwork, and positioned decorative SVGs relative to the current section padding. Removed mobile cropping from the account and closing mascots.

Production build and style policy checks passed. Checked all six languages at 390, 1100, and 1440px without horizontal overflow. The full Playwright run passed 57 cases and refreshed visual captures; the remaining landmark check passed on recheck after updating the hero section ID for the extracted header. All 58 cases are now accounted for successfully.
