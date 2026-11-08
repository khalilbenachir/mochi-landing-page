import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import { localePath, localeSwitchPath, routing } from "./routing";

function messagePaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    messagePaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("localized messages", () => {
  it("keeps French keys in lockstep with the English source schema", () => {
    expect(messagePaths(fr).sort()).toEqual(messagePaths(en).sort());
  });

  it("keeps the default locale canonical while exposing explicit switch URLs", () => {
    expect(routing.defaultLocale).toBe("en");
    expect(localePath("en")).toBe("/");
    expect(localePath("fr")).toBe("/fr");
    expect(localeSwitchPath("en")).toBe("/en");
    expect(localeSwitchPath("fr")).toBe("/fr");
  });
});
