import { accessSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import de from "../../../../messages/de.json";
import en from "../../../../messages/en.json";
import es from "../../../../messages/es.json";
import fr from "../../../../messages/fr.json";
import ptBR from "../../../../messages/pt-BR.json";
import ptPT from "../../../../messages/pt-PT.json";
import { routing } from "@/i18n/routing";
import { TERMS_ASSETS, TERMS_HERO_SIZE, TERMS_SECTION_IDS, TERMS_SUMMARY_CARDS, TERMS_SUMMARY_ICONS } from "./terms";

const messages = { en, fr, de, es, "pt-BR": ptBR, "pt-PT": ptPT };

describe("terms content and artwork contracts", () => {
  it("ships an optimized alpha hero with the declared intrinsic dimensions", async () => {
    const hero = join(process.cwd(), "public", TERMS_ASSETS.hero);
    const metadata = await sharp(hero).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.hasAlpha).toBe(true);
    expect({ width: metadata.width, height: metadata.height }).toEqual(TERMS_HERO_SIZE);
    expect(statSync(hero).size).toBeLessThan(150_000);
    const expected = [TERMS_ASSETS.hero, ...Object.values(TERMS_SUMMARY_ICONS)].map((path) => path.replace("/terms-art/", "")).sort();
    expect(readdirSync(join(process.cwd(), "public", "terms-art")).sort()).toEqual(expected);
    expect(() => accessSync(join(process.cwd(), "public", TERMS_ASSETS.contact))).not.toThrow();
  });

  for (const locale of routing.locales) {
    it(`provides complete ${locale} reader copy for every navigation destination`, () => {
      const copy = messages[locale].TermsOfUse;
      expect(Object.keys(copy.sections)).toEqual([...TERMS_SECTION_IDS]);
      for (const id of TERMS_SECTION_IDS) {
        for (const field of ["nav", "title", "body", "detail"] as const) {
          expect(copy.sections[id][field].trim().length, `${id}.${field}`).toBeGreaterThan(0);
        }
      }
      for (const { key, section } of TERMS_SUMMARY_CARDS) {
        expect(copy.cards[key].title.trim().length).toBeGreaterThan(0);
        expect(copy.cards[key].body.trim().length).toBeGreaterThan(0);
        if (section) expect(copy.sections[section].title).toBeTruthy();
      }
      expect(copy.updated).toContain("{date}");
      expect(copy.contactEmail).toContain("{email}");
    });
  }
});
