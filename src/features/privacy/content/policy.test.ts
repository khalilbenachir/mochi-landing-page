import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRIVACY_ASSETS } from "./policy";

describe("privacy asset manifest", () => {
  it("ships exactly the declared files under public/privacy-art", () => {
    const onDisk = readdirSync(join(process.cwd(), "public", "privacy-art")).map((file) => `/privacy-art/${file}`).sort();
    expect(onDisk).toEqual(Object.values(PRIVACY_ASSETS).sort());
  });
});
