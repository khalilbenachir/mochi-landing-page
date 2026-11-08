import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FLAVOR_CATALOG } from "./product-catalog";
import {
  FLAVOR_CARD_ASSETS,
  LANDING_ASSET_PATHS,
  MOOD_ASSETS,
  MOOD_IDS,
} from "./assets";

describe("landing asset manifest", () => {
  it("declares existing files for all active landing assets", () => {
    expect(LANDING_ASSET_PATHS).toHaveLength(25);
    for (const assetPath of LANDING_ASSET_PATHS) {
      expect(existsSync(join(process.cwd(), "public", assetPath.slice(1))), assetPath).toBe(true);
    }
  });

  it("covers every product flavor and mood asset id", () => {
    expect(Object.keys(FLAVOR_CARD_ASSETS).sort()).toEqual(
      FLAVOR_CATALOG.map(({ id }) => id).sort(),
    );
    expect(Object.keys(MOOD_ASSETS).sort()).toEqual([...MOOD_IDS].sort());
  });

  it("ships exactly the declared files under public/mochi", () => {
    const publicDir = join(process.cwd(), "public");
    const onDisk = (readdirSync(join(publicDir, "mochi"), { recursive: true }) as string[])
      .filter((f) => statSync(join(publicDir, "mochi", f)).isFile())
      .map((f) => `/mochi/${f.split("\\").join("/")}`);
    const declared = new Set<string>(LANDING_ASSET_PATHS);
    const extra = onDisk.filter((f) => !declared.has(f)).sort();
    const missing = [...declared].filter((f) => !onDisk.includes(f)).sort();
    expect({ undeclared: extra, missing }, "public/mochi must match LANDING_ASSET_PATHS").toEqual({
      undeclared: [],
      missing: [],
    });
  });
});
