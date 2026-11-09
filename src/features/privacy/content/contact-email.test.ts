import { describe, expect, it } from "vitest";
import { DEFAULT_CONTACT_EMAIL, resolveContactEmail } from "./contact-email";

describe("resolveContactEmail", () => {
  it("returns the trimmed address", () => {
    expect(resolveContactEmail({ value: "  privacy@example.com ", nodeEnv: "production" })).toBe("privacy@example.com");
  });

  it("falls back to the default address outside production", () => {
    expect(resolveContactEmail({ value: undefined, nodeEnv: "development" })).toBe(DEFAULT_CONTACT_EMAIL);
    expect(resolveContactEmail({ value: "  ", nodeEnv: "test" })).toBe(DEFAULT_CONTACT_EMAIL);
  });

  it("requires an address in production builds", () => {
    expect(() => resolveContactEmail({ value: undefined, nodeEnv: "production" })).toThrow(/required for production/);
    expect(() => resolveContactEmail({ value: "", nodeEnv: "production" })).toThrow(/required for production/);
  });

  it("rejects values that are not a single email address", () => {
    for (const value of ["[YOUR EMAIL]", "privacy@", "a@b", "a b@example.com", "a@example.com?subject=x", "<a@example.com>"]) {
      expect(() => resolveContactEmail({ value, nodeEnv: "development" }), value).toThrow(/invalid/);
    }
  });
});
