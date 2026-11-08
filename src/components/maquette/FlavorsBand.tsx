import Image from "next/image";
import { FLAVORS, type FlavorId, type UnlockKind } from "@/content/mochi";
import styles from "./FlavorsBand.module.css";

/** The little flavor glyph beside each name. Emoji render as Apple's set on iPhone, like the maquette. */
const ICON: Record<FlavorId, string | "classic" | "sesame"> = {
  strawberry: "🍓",
  classic: "classic",
  matcha: "🍃",
  ube: "🍠",
  mango: "🥭",
  sesame: "sesame",
  yuzu: "🍋",
  chocolate: "🍫",
  hojicha: "🌿",
  sakura: "🌸",
  peach: "🍑",
  coconut: "🥥",
};

function FlavorIcon({ id }: { id: FlavorId }) {
  const icon = ICON[id];
  if (icon === "classic") {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="#fde9ee" stroke="#f3b7c6" strokeWidth="1.4" />
        <path d="M8 9.5q2.5-2.5 5 0M10 14.5q2.5-2.5 5 0" fill="none" stroke="#f3b7c6" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (icon === "sesame") {
    return (
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <g fill="#2f2a28">
          <ellipse cx="7" cy="7" rx="2.6" ry="1.5" transform="rotate(-30 7 7)" />
          <ellipse cx="15" cy="6" rx="2.6" ry="1.5" transform="rotate(25 15 6)" />
          <ellipse cx="11" cy="12" rx="2.6" ry="1.5" transform="rotate(70 11 12)" />
          <ellipse cx="18" cy="13" rx="2.6" ry="1.5" transform="rotate(-15 18 13)" />
          <ellipse cx="6" cy="16" rx="2.6" ry="1.5" transform="rotate(40 6 16)" />
          <ellipse cx="13" cy="19" rx="2.6" ry="1.5" transform="rotate(-50 13 19)" />
        </g>
        <ellipse cx="18" cy="19" rx="2.4" ry="1.4" fill="#e9dcc4" transform="rotate(20 18 19)" />
      </svg>
    );
  }
  return <span className={styles.emoji} aria-hidden="true">{icon}</span>;
}

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
  return (
    <section id="flavors" className={styles.band}>
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h2><span>Keep your</span> <span>streak, collect</span> <span>12 Mochi flavors</span></h2>
          <p>Log a little every day and new Mochi join your collection.</p>
        </div>
        <Rays className={styles.rays} />

        <ul className={styles.grid}>
          {FLAVORS.map((flavor) => (
            <li key={flavor.id} className={styles.card}>
              <Image src={`/mochi/flavor-cards/${flavor.id}.webp`} alt={`${flavor.name} Mochi`} width={380} height={262} sizes="(max-width: 1099px) 22vw, 7vw" />
              <b className={styles.name}>{flavor.name}</b>
              <span className={`${styles.pill} ${flavor.kind === "challenge" ? styles.pillWrap : ""}`} style={{ background: PILL[flavor.id] ?? PILL_BY_KIND[flavor.kind] }}>{flavor.unlock}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
