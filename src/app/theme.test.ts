import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";
import {
  CYCLE_FACT_CLASS,
  CYCLE_LEGEND_CLASS,
  FLAVOR_PILL_CLASS,
  MOOD_FACE_CLASS,
  SYMPTOM_CHIP_CLASS,
} from "@/features/landing/content/visual-variants";

const require = createRequire(import.meta.url);
const root = process.cwd();
const srcDir = path.join(root, "src");
const globalsPath = path.join(srcDir, "app/globals.css");
const globals = readFileSync(globalsPath, "utf8");

async function buildUtilities(candidates: string[]) {
  const compiler = await compile(globals, {
    base: path.dirname(globalsPath),
    async loadStylesheet(id, base) {
      const file =
        id === "tailwindcss"
          ? require.resolve("tailwindcss/index.css")
          : require.resolve(id, { paths: [base] });
      return { path: file, base: path.dirname(file), content: readFileSync(file, "utf8") };
    },
  });
  return compiler.build(candidates);
}

function filesUnder(ext: RegExp) {
  return (readdirSync(srcDir, { recursive: true }) as string[])
    .filter((f) => ext.test(f))
    .map((f) => path.join(srcDir, f));
}

const themeStatic = globals.match(/@theme static \{([\s\S]*?)\n\}/)?.[1] ?? "";
const declared = [...themeStatic.matchAll(/^\s*--color-([a-z0-9-]+):/gm)].map((m) => m[1]);

describe("theme", () => {
  it("compiles breakpoints and every variant utility", async () => {
    const variantClasses = [
      ...Object.values(FLAVOR_PILL_CLASS),
      ...Object.values(MOOD_FACE_CLASS).flatMap((v) => [v.chip, v.ink]),
      ...Object.values(SYMPTOM_CHIP_CLASS),
      ...Object.values(CYCLE_LEGEND_CLASS),
      ...Object.values(CYCLE_FACT_CLASS),
    ];
    const out = await buildUtilities(["max-phone:hidden", "max-nav:hidden", "max-tablet:hidden", "max-poster:hidden", "min-wide:block", ...variantClasses]);
    for (const q of ["width < 30.0625rem", "width < 47.5625rem", "width < 40.0625rem", "width < 68.75rem", "width >= 90.0625rem"]) {
      expect(out).toContain(q);
    }
    for (const cls of new Set(variantClasses)) {
      expect(out.includes(`.${cls} {`) || out.includes(`.${cls}{`), cls).toBe(true);
    }
  });

  it("has no undefined color tokens in CSS Modules or TSX", () => {
    const missing: string[] = [];
    for (const file of filesUnder(/\.(module\.css|tsx)$/)) {
      for (const m of readFileSync(file, "utf8").matchAll(/var\(--color-([a-z0-9-]+)/g)) {
        if (!declared.includes(m[1])) missing.push(`${path.relative(root, file)}: --color-${m[1]}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("has no dead landing tokens", () => {
    const cssSources = filesUnder(/\.css$/).filter((f) => f !== globalsPath).map((f) => readFileSync(f, "utf8"));
    const codeSources = filesUnder(/\.(ts|tsx)$/).map((f) => readFileSync(f, "utf8"));
    const dead = declared.filter((name) => {
      const inCss = cssSources.some((s) => s.includes(`var(--color-${name})`) || s.includes(`var(--color-${name},`));
      const utility = new RegExp(`\\b(bg|text|fill|stroke|border(?:-[xytrblse])?|from|via|to|outline|ring|decoration)-${name}(?![\\w-])`);
      const inCode = codeSources.some((s) => s.includes(`var(--color-${name})`) || s.includes(`var(--color-${name},`));
      return !inCss && !inCode && !codeSources.some((s) => utility.test(s));
    });
    expect(dead).toEqual([]);
  });
});
