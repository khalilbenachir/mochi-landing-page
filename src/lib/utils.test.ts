import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("reads poster-unit text as a font size, not a color", () => {
    expect(cn("text-white", "text-u-12")).toBe("text-white text-u-12");
    expect(cn("text-u-[13.6]", "text-ink-navy")).toBe("text-u-[13.6] text-ink-navy");
  });

  it("lets a later font size replace a poster-unit one, and the other way round", () => {
    expect(cn("text-u-12", "text-[14px]")).toBe("text-[14px]");
    expect(cn("text-[14px]", "text-u-10.5")).toBe("text-u-10.5");
    expect(cn("text-u-12", "max-poster:text-[12px]")).toBe("text-u-12 max-poster:text-[12px]");
  });

  it("treats the extra weights as font weights", () => {
    expect(cn("font-bold", "font-max")).toBe("font-max");
    expect(cn("font-heavy", "font-demibold")).toBe("font-demibold");
    expect(cn("font-ultra", "text-white")).toBe("font-ultra text-white");
  });

  it("treats poster-unit radii as border radii", () => {
    expect(cn("rounded-full", "rounded-u-12")).toBe("rounded-u-12");
    expect(cn("rounded-u-12", "max-poster:rounded-[14px]")).toBe("rounded-u-12 max-poster:rounded-[14px]");
  });

  it("merges poster coordinates written as spacing utilities", () => {
    expect(cn("p-4", "px-22")).toBe("p-4 px-22");
    expect(cn("mt-14", "mt-[8px]")).toBe("mt-[8px]");
  });

  it("lets a later arbitrary box-shadow replace an earlier one", () => {
    expect(cn("[box-shadow:0_1px_0_red]", "hover:[box-shadow:0_2px_0_red]", "[box-shadow:none]")).toBe(
      "hover:[box-shadow:0_2px_0_red] [box-shadow:none]",
    );
  });
});
