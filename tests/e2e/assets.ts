import type { Page } from "@playwright/test";

/** Wait for hydration before preloading offscreen artwork for complete visual captures. */
export async function waitForPageAssets(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.images);
    for (const image of images) {
      if (image.loading === "lazy") image.loading = "eager";
    }
    await Promise.all(images.map((image) => image.decode()));
  });
}
