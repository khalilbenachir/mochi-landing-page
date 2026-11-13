# Blog art redrawn from the app's Mochi (13 November 2026)

Every blog illustration was redrawn in ChatGPT so Mochi matches the iOS app's own character.
The JSON prompt files in this folder describe the first set (10 November 2026); the files
they name were replaced by the ones below.

References attached to every prompt: `mochi-face-happy.png` (and `mochi-scene-plus.png` for
new scenes) from `iosApp/Packages/MochiKit/Sources/MochiDesign/Resources/MochiPictures`.

| Old file | New file | How |
| --- | --- | --- |
| `journal-mochi.webp` | `journal-writer.webp` | New scene: Mochi in a lavender beret writing in an open journal |
| `pad-care.webp` | `pad-care-mochi.webp` | Edit of the old picture |
| `cycle-phases.webp` | `cycle-phases-mochi.webp` | Edit of the old picture |
| `period-predictions.webp` | `period-predictions-mochi.webp` | Edit of the old picture |
| `period-cramps.webp` | `period-cramps-mochi.webp` | Edit of the old picture (calm, comforted face kept) |
| `cycle-moods.webp` | `cycle-moods-mochi.webp` | Edit of the old picture |
| `privacy-cutout.webp` | `privacy-cutout-mochi.webp` | Edit of the old picture |
| `getting-started.webp` | `getting-started-mochi.webp` | Edit of the old picture |
| `tracking-cutout.webp` | `tracking-cutout-mochi.webp` | Edit of the old picture |
| `methods-cutout.webp` | `methods-cutout-mochi.webp` | Edit of the old picture |
| `newsletter-mochi.webp` | `newsletter-sleepy.webp` | Edit of the old picture (asleep, "zzz" kept) |

Edit prompt (old picture attached second):

> Create an image: a new version of the SECOND picture (a blog article illustration). Redraw the
> Mochi character so it matches the app's Mochi in the FIRST picture exactly: same rounded soft
> pink mochi body shape, same pink outline, same glossy white highlight, same dark navy
> closed-eye face, same pink cheeks, same flat sticker illustration style and colors. Keep the
> same scene, pose, props, cushion, colors and composition as the second picture, and the same
> mood/expression. Remove ALL yellow stars, sparkles and yellow ray marks completely. No text,
> no letters. Plain pure white background, landscape 3:2, everything fully visible with margin.

Post-processing: white background flood-filled to transparent from the edges, 1 px alpha
erosion with a 0.6 px blur against light fringes, resized to 1200 × 800, WebP quality 88.
New file names so browser and Next image caches pick the new art up.
