# Flo alternatives: editorial review (16 November 2026)

Added `/blog/flo-alternatives-private-period-tracking-apps` in all six blog languages. Uses the existing catalog, metadata, canonical/hreflang, sitemap, social-card, source-link and FAQ structured-data paths. Release date: 2026-11-16.

## Marketing review

Applied the marketing-psychology skill with three practical choices:

- **Jobs to Be Done:** lead with what readers need (remember dates, keep symptoms together, make check-ins easier), then explain each app's fit.
- **Hick's Law:** give a five-option comparison with the same criteria for every app and a short decision paragraph. Keep the existing single app-download CTA.
- **Trust through transparency:** disclose that Mochi publishes the comparison, cite provider documentation near the relevant sections and acknowledge trade-offs. Avoid fear-driven switching claims, invented social proof and unsupported superlatives.

The answer-first introduction, descriptive question headings, visible comparison and FAQ support readers and search extraction. No ranking or AI-citation outcome is promised.

## Corrections to the supplied draft

- Five alternatives, not the six promised in the suggested metadata.
- Flo's current free offering includes basic predictions; paid product is Flo Premium. Anonymous Mode means a personal name/email is not a universal requirement.
- Treat the FTC's 2021 settlement as dated history, not proof of current conduct. Omit unverified boycott numbers and broad legal or jurisdiction claims.
- Mochi keeps cycle entries on-device by default but uses technical usage analytics, as its own policy explains. Remove the inaccurate claim of zero analytics. Describe optional encrypted backup separately.
- Clue's EU storage, account requirement and privacy controls are documented; do not claim GDPR categorically prohibits all data processing or automatically makes an app safest. Avoid a fixed regional price.
- Qualify Apple Health's end-to-end encryption with system, passcode and two-factor-authentication conditions.
- Update Flo export instructions and note that its guide requires registration before exporting from Anonymous Mode. Do not promise direct import into Mochi or a two-minute migration.
- Keep subscription cancellation separate from app/account deletion. Distinguish tracking estimates from contraception.

## Primary sources

Current source URLs are registered in `src/lib/editorial-sources.ts`; the article cites the FTC case file, Flo free/Anonymous Mode/export/deletion guides, Euki app/privacy/features pages, Clue account/privacy/free guides, drip project and store listings, Apple Cycle Tracking guidance, and Mochi's own feature and privacy pages. Checked on 16 November 2026; not an independent security audit or hands-on app review.

## Artwork

Built-in image generation, with `public/mochi/faces/header-mochi.webp` as the character reference and `public/blog-art/privacy-cutout-mochi.webp` as the blog-style reference. New state: reassured Mochi holding a locked phone and presenting three comparison cards. The mascot retains its rounded triangular pink body, pink outline, navy face, cheeks and white highlight.

Final project asset: `public/blog-art/flo-alternatives-mochi.webp` (1200 × 800), encoded with `cwebp -q 82 -resize 1200 800`. Generated sources remain in the image tool's output directory. No existing image was replaced.

## Verification

- `npm run check`: style and asset policies, formatting, types, lint, 170 unit tests and production test build passed.
- Rebuilt after the final German heading correction; final typecheck and lint passed.
- Blog and SEO browser suites: 62 non-screenshot tests passed. The repository expected an unavailable Chromium revision, so this run used a temporary config pointing to the existing local Chromium 1255 installation; no dependency or project configuration changed.
- Manually inspected the desktop hero, comparison table and mobile hero. Checked 320, 390, 759 and 1440 px in all six languages with fonts loaded: 24 successful responses and no horizontal overflow.
- Updated two stale browser-test expectations to match the existing header navigation and removed newsletter. No navigation or newsletter UI changed.
- Existing screenshot baselines were not regenerated. Review screenshots are in `artifacts/flo-alternatives-desktop.png`, `artifacts/flo-alternatives-mobile.png` and `artifacts/flo-alternatives-comparison-desktop.png`.
- Prepared for review; no production deployment was performed.

Generation prompt:

> Use case: illustration-story.
Asset type: transparent editorial hero for The Mochi Journal, landscape 3:2 composition.
Primary request: Draw the SAME Mochi character from the attached references in a new thoughtful, reassured decision-making state, choosing a private period tracker.
Input images: Image 1 is the canonical character identity and color reference; Image 2 is the existing blog illustration style reference. Preserve the same rounded triangular soft pink mochi body, thick darker pink contour, glossy upper-left white highlight, little pink cheeks, dark navy curved eyes, tiny friendly smile, and short rounded arms. Do not redesign the character or change its proportions.
Scene: One Mochi seated on a small soft lavender cushion, holding a plain generic lavender smartphone displaying only a simple white padlock symbol. Beside Mochi, three small overlapping pastel cards in lavender, pale mint, and pale pink, each with a single simple checkmark, suggest comparing options. Mochi looks calm and confident, with one small hand gesturing toward the cards.
Style: Same clean flat pastel sticker illustration as references, soft minimal shading, crisp outlines, restrained glossy highlights.
Composition: Entire character and all props visible, centered wide arrangement, generous clear margins, simple readable silhouette at thumbnail size, no frame. Output genuinely transparent alpha background.
Avoid: text, letters, numbers, app logos, competitor logos, stars, sparkles, yellow accents, photorealism, 3D rendering, extra characters.

Cleanup prompt:

> Use case: precise-object-edit. Edit the supplied Mochi comparison illustration. Keep the character identity, pink colors, rounded triangular body, face, cushion, phone with white lock, three checkmark cards, outlines and composition exactly as they are. Remove ALL the broad colored outer glow, haze and bloom around the character, cushion and cards. The area outside the crisp object outlines must be genuinely fully transparent alpha with no colored fog or shadow. Preserve clean antialiased edges and existing highlights inside the objects. Keep everything fully visible with a little margin. Landscape 3:2. No text or logos.
