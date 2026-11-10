import { describe, expect, it, vi } from "vitest";
import { NEWSLETTER_RECIPIENT, resolveNewsletterAction } from "./newsletter";

describe("newsletter configuration", () => {
  it("keeps the email-request fallback when no form action is set", () => {
    expect(resolveNewsletterAction(undefined)).toBeUndefined();
    expect(resolveNewsletterAction("   ")).toBeUndefined();
  });

  it("accepts an absolute HTTPS endpoint", () => {
    expect(resolveNewsletterAction(" https://forms.example.com/subscribe ")).toBe("https://forms.example.com/subscribe");
  });

  it("warns and keeps the email-request fallback for an email entered as the form action", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      expect(resolveNewsletterAction(" contact@mochiii.app ")).toBeUndefined();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("expects an HTTPS form endpoint"));
      expect(warn).toHaveBeenCalledWith(expect.stringContaining(NEWSLETTER_RECIPIENT));
    } finally {
      warn.mockRestore();
    }
  });

  it("fails the build for relative, malformed or insecure endpoints", () => {
    expect(() => resolveNewsletterAction("/subscribe")).toThrow(/absolute HTTPS URL/);
    expect(() => resolveNewsletterAction("forms.example.com")).toThrow(/absolute HTTPS URL/);
    expect(() => resolveNewsletterAction("http://forms.example.com")).toThrow(/must use HTTPS/);
    expect(() => resolveNewsletterAction("javascript:alert(1)")).toThrow(/must use HTTPS/);
  });

  it("uses a plain recipient address that cannot inject mailto headers", () => {
    expect(NEWSLETTER_RECIPIENT).toMatch(/^[^\s@?&#]+@[^\s@?&#]+\.[a-z]+$/);
  });
});
