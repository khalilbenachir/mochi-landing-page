import { describe, expect, it, vi } from "vitest";
import { joinWaitlist, normalizeEmail } from "./waitlist";

const env = { url: "https://example.supabase.co/", key: "anon-key" };
const ok = () => vi.fn(async () => new Response(null, { status: 201 })) as unknown as typeof fetch;

describe("waitlist", () => {
  it("normalizes and validates emails", () => {
    expect(normalizeEmail("  Khalil@Example.COM ")).toBe("khalil@example.com");
    expect(normalizeEmail("no-at-sign.com")).toBeUndefined();
    expect(normalizeEmail("a@b")).toBeUndefined();
    expect(normalizeEmail("two words@example.com")).toBeUndefined();
    expect(normalizeEmail(42)).toBeUndefined();
    expect(normalizeEmail(`${"a".repeat(250)}@example.com`)).toBeUndefined();
  });

  it("inserts the address with the visitor's language", async () => {
    const fetcher = ok();
    const result = await joinWaitlist({ email: "Me@Example.com", locale: "fr" }, env, fetcher);
    expect(result).toEqual({ status: 200, body: { ok: true } });
    const [url, init] = (fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toBe("https://example.supabase.co/rest/v1/waitlist");
    expect(init.headers.Prefer).toBe("return=minimal");
    expect(init.headers.apikey).toBe("anon-key");
    expect(init.headers.Authorization).toBeUndefined();
    expect(JSON.parse(init.body)).toEqual({ email: "me@example.com", locale: "fr", source: "website" });
  });

  it("treats an address that is already on the list as success", async () => {
    const duplicate = vi.fn(async () => new Response(JSON.stringify({ code: "23505" }), { status: 409 })) as unknown as typeof fetch;
    expect(await joinWaitlist({ email: "me@example.com" }, env, duplicate)).toEqual({ status: 200, body: { ok: true } });
    const otherConflict = vi.fn(async () => new Response(JSON.stringify({ code: "42501" }), { status: 409 })) as unknown as typeof fetch;
    expect((await joinWaitlist({ email: "me@example.com" }, env, otherConflict)).status).toBe(502);
  });

  it("also sends legacy JWT anon keys as a bearer token", async () => {
    const fetcher = ok();
    await joinWaitlist({ email: "me@example.com" }, { url: env.url, key: "eyJhbGciOi.legacy" }, fetcher);
    expect((fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0]![1].headers.Authorization).toBe("Bearer eyJhbGciOi.legacy");
  });

  it("drops unknown locales instead of storing them", async () => {
    const fetcher = ok();
    await joinWaitlist({ email: "me@example.com", locale: "xx" }, env, fetcher);
    expect(JSON.parse((fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0]![1].body).locale).toBeNull();
  });

  it("rejects invalid input, swallows honeypot bots and reports configuration or upstream errors", async () => {
    const fetcher = ok();
    expect((await joinWaitlist({ email: "nope" }, env, fetcher)).status).toBe(400);
    expect((await joinWaitlist(null, env, fetcher)).status).toBe(400);
    expect(await joinWaitlist({ email: "bot@example.com", company: "Acme" }, env, fetcher)).toEqual({ status: 200, body: { ok: true } });
    expect(fetcher).not.toHaveBeenCalled();
    expect((await joinWaitlist({ email: "me@example.com" }, {}, fetcher)).status).toBe(503);
    const failing = vi.fn(async () => new Response("{}", { status: 500 })) as unknown as typeof fetch;
    expect((await joinWaitlist({ email: "me@example.com" }, env, failing)).status).toBe(502);
  });
});
