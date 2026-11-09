import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const srcDir = path.join(root, "src");
const rel = (file: string) => path.relative(root, file).split(path.sep).join("/");

const allFiles = (readdirSync(srcDir, { recursive: true }) as string[]).map((f) =>
  path.join(srcDir, f),
);
const withExt = (re: RegExp) => allFiles.filter((f) => re.test(f));

function scan(files: string[], pattern: RegExp): string[] {
  const hits: string[] = [];
  for (const file of files) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (pattern.test(line)) hits.push(`${rel(file)}:${i + 1}`);
      });
  }
  return hits;
}

const sources = withExt(/\.(ts|tsx)$/);
const landingSources = sources.filter((f) => rel(f).startsWith("src/features/landing/"));

describe("style policy", () => {
  it("rule 1: no CSS Modules", () => {
    const modules = withExt(/\.module\.css$/).map(rel);
    const imports = scan(sources, /\.module\.css["']/);
    expect([...modules, ...imports], "CSS Modules are not allowed").toEqual([]);
  });

  it("rule 2: one stylesheet, no class selectors", () => {
    const sheets = withExt(/\.css$/).map(rel);
    expect(sheets, "the only stylesheet is src/app/globals.css").toEqual(["src/app/globals.css"]);

    const css = readFileSync(path.join(srcDir, "app/globals.css"), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
      .replace(/@custom-variant[^;]*;/g, (m) => m.replace(/[^\n]/g, " "));
    const offenders: string[] = [];
    const selectorRe = /([^{};]+)\{/g;
    let match: RegExpExecArray | null;
    while ((match = selectorRe.exec(css))) {
      const selector = match[1] ?? "";
      if (selector.trim().startsWith("@")) continue;
      if (/(^|[\s,>+~(])\.[A-Za-z_-]/.test(selector)) {
        const line = css.slice(0, match.index + match[0].indexOf(selector.trim())).split("\n").length;
        offenders.push(`src/app/globals.css:${line} ${selector.trim()}`);
      }
    }
    expect(offenders, "class selectors are not allowed; use Tailwind utilities").toEqual([]);
  });

  it("rule 3: color literals only in the theme", () => {
    const allowed = new Set([
      "src/app/globals.css",
      "src/app/platform-colors.ts",
      // This file spells out the patterns it forbids.
      "src/app/style-policy.test.ts",
    ]);
    const files = withExt(/\.(ts|tsx|css)$/).filter((f) => !allowed.has(rel(f)));
    const hits = scan(files, /#[0-9A-Fa-f]{3,8}\b|\b(rgb|rgba|hsl|hsla)\(/);
    expect(hits, "define colors as --color-* tokens in globals.css").toEqual([]);
  });

  it("rule 4: no inline styles in the landing", () => {
    expect(scan(landingSources, /style=\{/), "use Tailwind utilities").toEqual([]);
  });

  it("rule 5: static class names", () => {
    const hits = scan(landingSources, /className=\{`|className=\{"[^"]*"\s*\+/);
    expect(hits, "class names must be static strings or cn()/cva()").toEqual([]);
  });

  it("rule 6: verified Tailwind 4.1.18 pitfalls", () => {
    const hits = scan(sources, /\b(max|min)-\[|\b(drop-shadow|text-shadow|shadow)-\[/);
    expect(hits, "use named breakpoints and [box-shadow:...] arbitrary properties").toEqual([]);
  });

  it("rule 7: poster units and native utilities", () => {
    // This file spells out the patterns it forbids.
    const code = sources.filter((f) => rel(f) !== "src/app/style-policy.test.ts");
    // Poster coordinates are spacing utilities (`mt-14`) now; `--u` is gone.
    const legacyUnit = scan(code, /var\(--u\)|\[--u:/);
    expect(legacyUnit, "use spacing utilities inside PosterStage (mt-14, text-u-41)").toEqual([]);
    // A quarter-step multiple of --spacing in brackets has a bare utility form.
    const spacingUtility =
      /(^|[\s"':])-?(m[trblxyse]?|p[trblxyse]?|gap(-[xy])?|[wh]|size|(min|max)-[wh]|top|left|right|bottom|inset(-[xy])?|translate-[xy])-\[calc\(-?\d+(\.(25|5|75))?\*var\(--spacing\)\)\]/;
    expect(scan(code, spacingUtility), "write mt-[calc(14*var(--spacing))] as mt-14").toEqual([]);
    const posterType = /(^|[\s"':])(text|rounded)-\[calc\([\d.]+\*var\(--spacing\)\)\]/;
    expect(scan(code, posterType), "write text-[calc(12*var(--spacing))] as text-u-12").toEqual([]);
    const transforms = scan(code, /\[transform:/);
    expect(transforms, "use rotate-*, translate-*, scale-* utilities").toEqual([]);
  });

  it("rule 8: shared components size in pixels", () => {
    // PosterStage redefines --spacing, so inside a stage `p-4` is 4 poster units, not 16px.
    // Components outside the landing feature render in and out of stages: they must not
    // depend on the spacing scale. Zero is the same at any unit and stays allowed.
    const shared = sources.filter((f) => rel(f).startsWith("src/components/"));
    const spacingScale =
      /(^|[\s"'`:])-?(m[trblxyse]?|p[trblxyse]?|gap(-[xy])?|space-[xy]|[wh]|size|(min|max)-[wh]|top|left|right|bottom|start|end|inset(-[xy])?|translate-[xy]|scroll-[mp][trblxyse]?|indent|leading)-([1-9]\d*(\.\d+)?|0\.\d+)(?=[\s"'`]|$)/;
    expect(scan(shared, spacingScale), "write p-4 as p-[16px] in src/components").toEqual([]);
  });
});
