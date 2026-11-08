import { describe, expect, it } from "vitest";
import { resolveSiteOrigin } from "./site-url";

describe("resolveSiteOrigin", () => {
  it.each([
    ["https://example.com", "https://example.com"],
    ["https://example.com/", "https://example.com"],
    ["  https://example.com/  ", "https://example.com"],
    ["http://localhost:3100", "http://localhost:3100"],
  ])("accepts %j", (value, expected) => {
    expect(resolveSiteOrigin({ value, nodeEnv: "production" })).toBe(expected);
  });

  it.each(["development", "test"])("returns undefined when absent in %s", (nodeEnv) => {
    expect(resolveSiteOrigin({ value: undefined, nodeEnv })).toBeUndefined();
    expect(resolveSiteOrigin({ value: "   ", nodeEnv })).toBeUndefined();
  });

  it.each([undefined, "", "  "])("throws when %j in production", (value) => {
    expect(() => resolveSiteOrigin({ value, nodeEnv: "production" })).toThrow(
      /NEXT_PUBLIC_SITE_URL is required/,
    );
  });

  it.each([
    ["not a url", /malformed/],
    ["ftp://example.com", /protocol/],
    ["//example.com", /malformed/],
    ["https://user:pass@example.com", /credentials/],
    ["https://user@example.com", /credentials/],
    ["https://example.com/path", /path/],
    ["https://example.com?a=1", /query/],
    ["https://example.com?", /query/],
    ["https://example.com#top", /fragment/],
    ["https://example.com#", /fragment/],
  ])("rejects %j", (value, reason) => {
    expect(() => resolveSiteOrigin({ value, nodeEnv: "development" })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
    expect(() => resolveSiteOrigin({ value, nodeEnv: "development" })).toThrow(reason);
  });
});
