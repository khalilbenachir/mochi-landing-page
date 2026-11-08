import Image from "next/image";
import { asset } from "@/content/mochi";
import styles from "./SiteFooter.module.css";

/** Point these at the real pages (the same links as the app's Config/Base.xcconfig). */
const LINKS = [
  { href: "#privacy", label: "Privacy policy" },
  { href: "#get", label: "Terms" },
  { href: "#get", label: "Help" },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.row}`}>
        <div className={styles.brand}>
          <Image src={asset.appIcon} alt="" width={34} height={34} className={styles.icon} />
          <span>Mochi</span>
        </div>
        <nav aria-label="Footer" className={styles.nav}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <p className={styles.legal}>© {new Date().getFullYear()} Mochi. Predictions are estimates; Mochi is not contraception or medical advice.</p>
      </div>
    </footer>
  );
}
