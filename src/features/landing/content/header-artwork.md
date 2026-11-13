# Happy header Mochi

Asset: `public/mochi/faces/happy-header.webp` (256 × 238, transparent WebP).
Made from the iOS app's own `mochi-face-happy.png` (MochiDesign/Resources/MochiPictures), so the
header shows exactly the app's Mochi. A raspberry outline (#d63467) and a white sticker rim are
added around its silhouette so it reads on the pink header band and matches the outlined Mochi in
the app reference art. Trimmed to its transparent bounds; the asset manifest exposes it as
`LANDING_ASSETS.faces.headerHappy`.

To rebuild: trim the app picture, scale to 512 px wide, dilate its alpha by 13 px for the outline
and the result by 11 px for the white rim (light 1.2 px blur on each), then resize to 256 px wide.
