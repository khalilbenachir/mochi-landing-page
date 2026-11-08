import { Icon } from "@/components/ui/Icon";
import { MochiClip } from "@/components/ui/MochiClip";
import { PadChangeCard } from "@/features/change-reminder/PadChangeCard";
import styles from "./TodayScreen.module.css";

/** Mon 2 – Sun 8: the period started Friday, today is Saturday (period day 2), Sunday is predicted. */
const WEEK = ["M", "T", "W", "T", "F", "S", "S"].map((letter, i) => ({
  letter,
  day: 2 + i,
  isToday: i === 5,
  isLogged: i === 4,
  isPredicted: i === 6,
  isPeriod: i >= 4,
}));

const CATEGORIES = [
  { title: "Flow", tint: "var(--pink-tint)", ink: "var(--pink-ink)", icon: <path d="M10 1c3 5 8 9 8 14a8 8 0 0 1-16 0c0-5 5-9 8-14z" fill="currentColor" transform="translate(2 0)" /> },
  {
    title: "Mood",
    tint: "var(--orange-tint)",
    ink: "var(--orange-ink)",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M8 14.5a4.5 4.5 0 0 0 8 0" />
        <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="3" />
      </g>
    ),
  },
  {
    title: "Symptoms",
    tint: "var(--indigo-tint)",
    ink: "var(--indigo)",
    icon: <path fill="currentColor" d="M10 2c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7zM18 13c.3 2.2 1.3 3.2 3.5 3.5-2.2.3-3.2 1.3-3.5 3.5-.3-2.2-1.3-3.2-3.5-3.5 2.2-.3 3.2-1.3 3.5-3.5z" />,
  },
  { title: "Sleep", tint: "var(--teal-tint)", ink: "var(--teal-ink)", icon: <path fill="currentColor" d="M20 15.5A9 9 0 0 1 8.5 4a9 9 0 1 0 11.5 11.5z" /> },
];

/**
 * The app's Home (TodayView.swift), laid out in iPhone points at 390 pt wide and scaled into the
 * phone frame, so every size matches the real screen.
 */
export function TodayScreen() {
  return (
    <div className={styles.app}>
      <div className={styles.scroll}>
        <div className={styles.header}>
          <span className={styles.streak}>
            <svg width="15" height="17" viewBox="0 0 24 28" aria-hidden="true">
              <path d="M12 0c1 6 9 9 9 17a9 9 0 0 1-18 0c0-4 2-7 4-9 0 3 1 5 3 6 0-6 1-10 2-14z" fill="var(--orange)" />
            </svg>
            5 day
          </span>
          <span className={styles.spacer} />
          <span className={styles.circle} aria-hidden="true">
            <Icon name="calendar" size={19} strokeWidth={2.4} />
          </span>
          <span className={styles.circle} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.3 2h3.4l.6 2.6 1.7.7 2.3-1.4 2.4 2.4-1.4 2.3.7 1.7 2.6.6v3.4l-2.6.6-.7 1.7 1.4 2.3-2.4 2.4-2.3-1.4-1.7.7-.6 2.6h-3.4l-.6-2.6-1.7-.7-2.3 1.4-2.4-2.4 1.4-2.3-.7-1.7L2 13.7v-3.4l2.6-.6.7-1.7-1.4-2.3 2.4-2.4 2.3 1.4 1.7-.7zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
            </svg>
          </span>
        </div>

        <div className={styles.cycleHero}>
          <p className={styles.weekday}>Saturday 7 November</p>
          <p className={styles.headline}>Period day 2</p>
          <p className={styles.subtitle}>Cycle day 2</p>
          <span className={styles.editPill}>
            <Icon name="pencil" size={15} strokeWidth={2.8} />
            Edit period
          </span>
        </div>

        <PadChangeCard className={styles.card} />

        <div className={styles.week}>
          {WEEK.map((d) => (
            <div key={d.day} className={styles.day}>
              <span className={styles.dayLetter} style={{ color: d.isToday ? "var(--navy)" : "var(--grey-600)" }}>
                {d.letter}
              </span>
              <span
                className={[styles.dayNum, d.isToday && styles.today, d.isLogged && styles.logged, d.isPredicted && styles.predicted]
                  .filter(Boolean)
                  .join(" ")}
              >
                {d.day}
              </span>
              <span className={styles.dot} style={{ background: d.isPeriod ? "var(--pink)" : "transparent" }} />
            </div>
          ))}
        </div>

        <div className={styles.dayCard}>
          <div className={styles.bubble}>How are you today? Tap me and tell me.</div>
          <MochiClip name="neutral" label="Mochi is waiting to hear about your day" className={styles.clip} />
          <div className={styles.tapRow}>
            <span>Tap Mochi to log how you feel</span>
            <span className={styles.logMore}>Log more</span>
          </div>
          <div className={styles.categories}>
            {CATEGORIES.map((c) => (
              <div key={c.title} className={styles.category}>
                <div className={styles.categoryCircle} style={{ background: c.tint, color: c.ink }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    {c.icon}
                  </svg>
                  <span className={styles.categoryBadge}>
                    <Icon name="plus" size={10} strokeWidth={3.4} />
                  </span>
                </div>
                <span>{c.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The island and home indicator stay put while Home scrolls. */}
      <div className={styles.island} aria-hidden="true" />
      <div className={styles.homeIndicator} aria-hidden="true" />
    </div>
  );
}
