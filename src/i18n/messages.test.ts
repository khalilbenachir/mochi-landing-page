import { describe, expect, it } from "vitest";
import de from "../../messages/de.json";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import ptBR from "../../messages/pt-BR.json";
import ptPT from "../../messages/pt-PT.json";
import { LOCALE_META, localePath, localeSwitchPath, routing, type AppLocale } from "./routing";

const MESSAGES = {
  en,
  fr,
  de,
  es,
  "pt-BR": ptBR,
  "pt-PT": ptPT,
} satisfies Record<AppLocale, unknown>;

function messagePaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    messagePaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function messageValues(value: unknown): unknown[] {
  if (typeof value !== "object" || value === null) return [value];
  return Object.values(value).flatMap(messageValues);
}

describe("localized messages", () => {
  it("ships a message file and metadata for every routed locale", () => {
    expect(Object.keys(MESSAGES).sort()).toEqual([...routing.locales].sort());
    expect(Object.keys(LOCALE_META).sort()).toEqual([...routing.locales].sort());
  });

  for (const locale of routing.locales.filter((candidate) => candidate !== routing.defaultLocale)) {
    it(`keeps ${locale} keys in lockstep with the English source schema`, () => {
      expect(messagePaths(MESSAGES[locale]).sort()).toEqual(messagePaths(en).sort());
    });
  }

  it("only stores strings in message files", () => {
    for (const [locale, messages] of Object.entries(MESSAGES)) {
      for (const value of messageValues(messages)) {
        expect(typeof value, locale).toBe("string");
      }
    }
  });

  it("keeps the default locale canonical while exposing explicit switch URLs", () => {
    expect(routing.defaultLocale).toBe("en");
    expect(localePath("en")).toBe("/");
    for (const locale of routing.locales) {
      expect(localeSwitchPath(locale)).toBe(`/${locale}`);
      if (locale !== "en") expect(localePath(locale)).toBe(`/${locale}`);
    }
  });
});
