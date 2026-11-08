import Image from "next/image";
import { useTranslations } from "next-intl";
import { FLAVOR_CATALOG, type FlavorId, type UnlockKind } from "@/content/product-catalog";
import styles from "./FlavorsBand.module.css";

/** Pill tint, as in the maquette: each starter has its own color, everything you earn is pink. */
const PILL: Partial<Record<FlavorId, string>> = { strawberry: "#fbe9a8", classic: "#fbd5cf", matcha: "#d4f0c8" };
const PILL_BY_KIND: Record<UnlockKind, string> = { starter: "#fbe9a8", streak: "#fcd5de", petals: "#fbd0e3", challenge: "#fcd2dd" };

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 30" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M27 4 23 14" /><path d="M37 9 29 17" /><path d="M5 18 19 21" />
      </g>
    </svg>
  );
}

/** Section 4: the 12 collectible flavors and how each one unlocks. */
export function FlavorsBand() {
  const t = useTranslations("Flavors");

  return (
    <section id="flavors" className={styles.band}>
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h2><span>{t("title1")}</span> <span>{t("title2")}</span> <span>{t("title3")}</span></h2>
          <p>{t("body")}</p>
        </div>
        <Rays className={styles.rays} />

        <ul className={styles.grid}>
          {FLAVOR_CATALOG.map((flavor) => (
            <li key={flavor.id} className={styles.card}>
              <Image src={`/mochi/flavor-cards/${flavor.id}.webp`} alt={`${t(`items.${flavor.id}.name`)} Mochi`} width={380} height={262} sizes="(max-width: 1099px) 22vw, 7vw" />
              <b className={styles.name}>{t(`items.${flavor.id}.name`)}</b>
              <span className={`${styles.pill} ${flavor.kind === "challenge" ? styles.pillWrap : ""}`} style={{ background: PILL[flavor.id] ?? PILL_BY_KIND[flavor.kind] }}>{t(`items.${flavor.id}.unlock`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
