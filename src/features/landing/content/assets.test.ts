import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FLAVOR_CATALOG } from "./product-catalog";
import {
  FLAVOR_CARD_ASSETS,
  LANDING_ASSETS,
  LANDING_ASSET_PATHS,
  MOOD_ASSETS,
  MOOD_IDS,
} from "./assets";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function readPngSize(assetPath: string) {
  const bytes = readFileSync(join(process.cwd(), "public", assetPath.slice(1)));
  expect([...bytes.subarray(0, 8)], `${assetPath} must have a PNG signature`).toEqual(PNG_SIGNATURE);
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("landing asset manifest", () => {
  it("declares existing files for all active landing assets", () => {
    expect(LANDING_ASSET_PATHS).toHaveLength(34);
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

  it("ships manifest icons whose bitmaps match their declared sizes", () => {
    expect(readPngSize(LANDING_ASSETS.manifestIcon192), LANDING_ASSETS.manifestIcon192).toEqual({
      width: 192,
      height: 192,
    });
    expect(readPngSize(LANDING_ASSETS.manifestIcon512), LANDING_ASSETS.manifestIcon512).toEqual({
      width: 512,
      height: 512,
    });
  });

  it("ships a 1200x630 social card bitmap", () => {
    expect(readPngSize(LANDING_ASSETS.socialCard), LANDING_ASSETS.socialCard).toEqual({
      width: 1200,
      height: 630,
    });
  });

  it("ships the generated square not-found mascot bitmap", () => {
    expect(readPngSize(LANDING_ASSETS.notFoundMascot), LANDING_ASSETS.notFoundMascot).toEqual({
      width: 1254,
      height: 1254,
    });
  });
});
