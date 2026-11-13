import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const srcDir = path.join(root, "src");
const tsxFiles = (readdirSync(srcDir, { recursive: true }) as string[])
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => path.join(srcDir, f));

/** Every inline `<svg ...>` opening tag, with its file and line. */
function svgTags() {
  const tags: { where: string; tag: string }[] = [];
  for (const file of tsxFiles) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/<svg\b[^>]*>/g)) {
      const line = source.slice(0, match.index).split("\n").length;
      tags.push({ where: `${path.relative(root, file)}:${line}`, tag: match[0] });
    }
  }
  return tags;
}

describe("inline SVG policy", () => {
  const tags = svgTags();

  it("finds the inline SVGs", () => {
    // Sanity check that the scan works; the count drops as drawn decor is replaced by Mochi art.
    expect(tags.length).toBeGreaterThan(10);
  });

  it("gives every SVG a viewBox so it scales with its box", () => {
    const missing = tags.filter(({ tag }) => !/\bviewBox="[\d.\s-]+"/.test(tag)).map(({ where }) => where);
    expect(missing).toEqual([]);
  });

  it("hides decorative SVGs from assistive tech or labels meaningful ones", () => {
    const unlabelled = tags
      .filter(({ tag }) => !/aria-hidden="true"/.test(tag))
      .filter(({ tag }) => !(/role="img"/.test(tag) && /aria-label(ledby)?=/.test(tag)))
      .map(({ where }) => where);
    expect(unlabelled).toEqual([]);
  });
});
