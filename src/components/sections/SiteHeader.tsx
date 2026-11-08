import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { APP_STORE_URL, NAV_LINKS, asset } from "@/content/mochi";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.bar}`}>
        <a href="#top" className={styles.brand}>
          <Image src={asset.appIcon} alt="" width={42} height={42} className={styles.icon} priority />
          <span>Mochi</span>
        </a>
        <nav aria-label="Main" className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </nav>
        <ButtonLink href={APP_STORE_URL} className={styles.cta}>
          Get Mochi
        </ButtonLink>
      </div>
    </header>
  );
}
