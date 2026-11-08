import Image from "next/image";
import { useTranslations } from "next-intl";
import { FAQ_IDS } from "@/content/landing";
import { asset } from "@/content/mochi";
import styles from "./FaqBand.module.css";

function Rays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4.5">
        <path d="M10 4 7 15" /><path d="M24 8 15 19" /><path d="M33 22 20 26" />
      </g>
    </svg>
  );
}

/** Section 7: the FAQ, the same questions as the FAQPage structured data. */
export function FaqBand() {
  const t = useTranslations("FAQ");

  return (
    <section id="faq" className={styles.band}>
      <div className={styles.stage}>
        <div className={styles.side}>
          <h2><span>{t("title1")}</span> <span>{t("title2")}</span> <span>{t("title3")}</span></h2>
          <Rays className={styles.rays} />
          <span className={styles.question} aria-hidden="true">?</span>
          <div className={styles.mascot} aria-hidden="true">
            <Image src={asset.face.wondering} alt="" width={460} height={368} sizes="14vw" />
            <svg className={styles.heart} viewBox="0 0 24 24"><path fill="#f585ad" d="M12 21.2C5.4 16.6 2 13 2 8.8 2 5.7 4.4 3.4 7.3 3.4c2 0 3.6 1 4.7 2.6 1.1-1.6 2.7-2.6 4.7-2.6 2.9 0 5.3 2.3 5.3 5.4 0 4.2-3.4 7.8-10 12.4Z" /></svg>
          </div>
        </div>

        <div className={styles.list}>
          {FAQ_IDS.map((id, index) => (
            <details key={id} name="faq" open={index === 0}>
              <summary>
                <h3>{t(`items.${id}.question`)}</h3>
                <span className={styles.toggle} aria-hidden="true" />
              </summary>
              <p>{t(`items.${id}.answer`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
