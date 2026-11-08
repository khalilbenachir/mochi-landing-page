import Image from "next/image";
import { useTranslations } from "next-intl";
import { StatusIcons } from "./IslandBand";
import styles from "./MoodBand.module.css";

const MOODS = [
  { id: "happy", width: 377, height: 327 },
  { id: "sleepy", width: 362, height: 361 },
  { id: "crampy", width: 363, height: 360 },
  { id: "cozy", width: 399, height: 337 },
] as const;

/* Mood faces for the Log Today sheet, drawn to match the app's mood picker. */
function MoodFace({ tone }: { tone: "joy" | "calm" | "meh" | "sad" }) {
  const ink = tone === "joy" ? "#fff" : "#26304a";
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round">
        {tone === "joy" && (
          <>
            <path d="M7 10.5q1.5-2 3 0M14 10.5q1.5-2 3 0" />
            <path d="M8.5 13.5q3.5 3.5 7 0Z" fill={ink} />
          </>
        )}
        {tone === "calm" && (
          <>
            <path d="M7 10.5q1.5-2 3 0M14 10.5q1.5-2 3 0" />
            <path d="M10 14q2 1.6 4 0" />
          </>
        )}
        {tone === "meh" && (
          <>
            <path d="M7.5 9.5l2 1.2M16.5 9.5l-2 1.2" />
            <path d="M10.5 15q1.5-1.2 3 0" />
          </>
        )}
        {tone === "sad" && (
          <>
            <circle cx="9" cy="10.5" r="1" fill={ink} stroke="none" />
            <circle cx="15" cy="10.5" r="1" fill={ink} stroke="none" />
            <path d="M10 15.5q2-1.6 4 0" />
          </>
        )}
      </g>
    </svg>
  );
}

function SymptomIcon({
  name,
}: {
  name: "cramps" | "bloating" | "headache" | "tired";
}) {
  if (name === "cramps")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#ec3f78" d="M13.5 3 6.5 13h5l-1.5 8 7.5-10.5h-5L13.5 3Z" />
      </svg>
    );
  if (name === "bloating")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <g fill="none" stroke="#7a55d6" strokeWidth="1.8" strokeLinecap="round">
          <path d="M5 9q1.75-2 3.5 0t3.5 0 3.5 0 3.5 0" />
          <path d="M5 14q1.75-2 3.5 0t3.5 0 3.5 0 3.5 0" />
        </g>
      </svg>
    );
  if (name === "headache")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#8a5be0" d="M5 16.5c0-5.2 3.1-8.5 7-8.5s7 3.3 7 8.5Z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text x="6" y="17" fontSize="11" fontWeight="900" fill="#5b4fc9">
        z
      </text>
      <text x="13" y="12" fontSize="8" fontWeight="900" fill="#5b4fc9">
        z
      </text>
    </svg>
  );
}

const SYMPTOMS = [
  { id: "cramps", bg: "#fde0ea" },
  { id: "bloating", bg: "#ece2fb" },
  { id: "headache", bg: "#ece2fb" },
  { id: "tired", bg: "#ece2fb" },
] as const;

const FACES = [
  { tone: "joy", bg: "#f2497a" },
  { tone: "calm", bg: "#fbdcea" },
  { tone: "meh", bg: "#ffffff" },
  { tone: "sad", bg: "#dcccf6" },
] as const;

function LogTodayPhone() {
  const t = useTranslations("Moods");

  return (
    <div
      className={styles.phone}
      role="img"
      aria-label={t("phoneLabel")}
    >
      <div className={styles.screen} aria-hidden="true">
        <div className={styles.status}>
          <b>9:41</b>
          <i className={styles.island} />
          <StatusIcons className={styles.signal} />
        </div>
        <div className={styles.sheetHead}>
          <span className={styles.close}>×</span>
          <b>{t("logToday")}</b>
        </div>
        <p className={styles.sheetLabel}>{t("mood")}</p>
        <ul className={styles.faces}>
          {FACES.map((face) => (
            <li key={face.tone} style={{ background: face.bg }}>
              <MoodFace tone={face.tone} />
            </li>
          ))}
        </ul>
        <p className={styles.sheetLabel}>{t("symptoms")}</p>
        <ul className={styles.symptoms}>
          {SYMPTOMS.map((s) => (
            <li key={s.id}>
              <span style={{ background: s.bg }}>
                <SymptomIcon name={s.id} />
              </span>
              {t(`symptomNames.${s.id}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Section 3: four mood Mochis and the Log Today sheet. */
export function MoodBand() {
  const t = useTranslations("Moods");

  return (
    <section id="moods" className={styles.band}>
      <div className={styles.stage}>
        <div className={styles.copy}>
          <h2>
            <span>{t("title1")}</span> <span>{t("title2")}</span>
          </h2>
          <p>{t("body")}</p>
        </div>

        <ul className={styles.moods}>
          {MOODS.map((mood) => (
            <li key={mood.id} className={`${styles.mood} ${styles[mood.id]}`}>
              <Image
                src={`/mochi/mood-${mood.id}.webp`}
                alt={`${t(`moodNames.${mood.id}`)} Mochi`}
                width={mood.width}
                height={mood.height}
                sizes="(max-width: 1099px) 24vw, 10vw"
              />
              <span className={styles.pill}>{t(`moodNames.${mood.id}`)}</span>
            </li>
          ))}
        </ul>

        <LogTodayPhone />
      </div>
    </section>
  );
}
