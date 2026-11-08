import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PLATFORM_COLORS } from "./platform-colors";

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");

describe("platform colors", () => {
  for (const [name, { value, cssVariable }] of Object.entries(PLATFORM_COLORS)) {
    it(`${name} equals ${cssVariable} in globals.css`, () => {
      const match = css.match(new RegExp(`^\\s*${cssVariable}:\\s*(#[0-9A-Fa-f]{3,8})\\s*;`, "m"));
      expect(match, `${cssVariable} declaration`).not.toBeNull();
      expect((match?.[1] ?? "").toLowerCase()).toBe(value.toLowerCase());
    });
  }
});
