# Terms of use

`/terms` and the five locale-prefixed Terms routes use the same server-first composition as
Privacy: a shared header, illustrated hero, four summary links, a complete section reader and
contact banner. The locale layout supplies the shared footer once. All user-facing text is in
`TermsOfUse` in the six `messages/*.json` files.

## Content and reader contract

The copy is a **plain-language draft for owner/legal review before launch**, based on the supplied
design and existing product facts; it is not a lawyer-approved agreement. No company identity,
jurisdiction, price, trial, refund promise or new data feature has been invented. Subscription
cancellation wording was checked against [Apple Support](https://support.apple.com/en-us/118428); the page links each locale to its regional edition.
The page does not claim that Mochi has adopted Apple's Standard EULA.

`content/terms.ts` owns stable section IDs (`using`, `health`, `subscriptions`, `content`,
`acceptable-use`, `changes`, `contact`), summary destinations, asset paths and the deliberate
`TERMS_UPDATED_AT` editorial date. Update that date and all six translations when terms change.

Every section is rendered and visible without JavaScript. The small `TermsContent` client island
only highlights the URL hash, scrolls to its section and focuses the heading. It supports direct
URLs, encoded anchors and browser history; malformed or unknown hashes default to `using`.
Summary card four and the content section link to the localized Privacy page. Both locale menus
preserve `/terms`, while feature and download links return to the localized home.

Contact uses Privacy's shared resolver: production builds require a validated
`NEXT_PUBLIC_CONTACT_EMAIL`, and only development and test fall back to `test@mochi.app`. Local verification uses the same deterministic
address through `npm run build:test`.

## Artwork

Generated with the built-in ImageGen tool on 2026-11-09, using the owner's supplied Terms mockup
for its subject and visual style. The generated PNG remains outside the repository; the deployed
asset was resized and encoded with `sharp` at quality 88, retaining its transparent alpha channel.
The contact banner uses the same shared peeking Mochi artwork as Privacy rather than shipping a
Terms-specific duplicate.

| Asset | Dimensions | Size |
| --- | --- | --- |
| `public/terms-art/terms-mochi-scroll.webp` | 1024 × 819 | 85,868 bytes |
| `public/privacy-art/privacy-contact.webp` | Existing shared asset | Reused with Privacy |

Exact generation prompt:

> Use case: stylized-concept. Asset type: transparent website Terms of Use hero illustration for Mochi. Generate a single adorable glossy pastel-pink Mochi rice-cake mascot matching the user reference: a squat rounded soft triangle blob with a bright pink soft edge, white shine on upper left, two closed happy navy curved eyes, tiny smiling mouth, rosy oval cheeks and two small pink oval hands. It wears large thin round dark-purple reading glasses and holds an unfurled cream parchment scroll in front and to its right, with rounded curled top and 4 short tan placeholder strokes, no readable text. It sits on a soft cream flower-shaped mochi cushion. Match the soft illustrated dimensional sticker style in the attached Terms page reference, clean simple smooth painted shading with lovely pink highlights, not a realistic food photograph. Framing: full mascot, entire cushion and scroll visible, tight centered 5:4 landscape composition, small transparent margin. Genuine transparent alpha background, no blue backdrop, no rectangle, no checkerboard baked into the image, no words, no watermark, no scene. The art will sit on a turquoise-blue website hero next to white text. Do not draw website UI.

## Verification

- `npm run check` checks style/asset policies, types, lint, unit contracts and production build.
- `npx playwright test tests/e2e/terms.spec.ts` checks localized layouts at 320–1440px, no-JS
  reading, hash/history/keyboard navigation, footer links, localized privacy/download destinations,
  metadata/alternates, and full-page desktop/phone baselines.
- `npx playwright test` runs the existing regression suite; existing baselines should not change.

Terms theme colors are named tokens in `src/app/globals.css`. Summary icons are decorative
code-native pictograms using those tokens; sidebar icons come from the existing Lucide set.
