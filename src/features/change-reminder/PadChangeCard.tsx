"use client";

import { ChangeFaces } from "@/components/ui/ChangeFaces";
import { Icon } from "@/components/ui/Icon";
import { describeCard, type CardButton } from "@/lib/change-timer";
import { useChangeReminder } from "./ChangeReminderProvider";
import styles from "./PadChangeCard.module.css";

function ButtonIcon({ icon }: { icon?: CardButton["icon"] }) {
  if (icon === "check") return <Icon name="check" size={15} strokeWidth={3.4} />;
  if (icon === "timer") return <Icon name="timer" size={15} strokeWidth={2.8} />;
  return null;
}

/**
 * The pad change card on Home (variant B): one layout for all six states, driven by
 * `describeCard`. Every button is live and moves the shared timer.
 */
export function PadChangeCard({ className }: { className?: string }) {
  const { state, act } = useChangeReminder();
  const view = describeCard(state);

  return (
    <div className={[styles.card, styles[view.tone], className].filter(Boolean).join(" ")} data-state={view.state}>
      <div className={styles.row}>
        <div className={`${styles.face} ${view.ringed ? styles.ringed : ""}`}>
          <ChangeFaces face={view.face} width={30} height={24} />
          {view.badge && (
            <span className={styles.badge} aria-hidden="true">
              <Icon name="check" size={11} strokeWidth={4} />
            </span>
          )}
        </div>

        <div className={styles.text} aria-live="polite">
          {view.counter && (
            <>
              <p className={styles.eyebrow}>{view.counter.eyebrow}</p>
              <div className={styles.counterRow}>
                <p className={`tnum ${styles.value}`}>{view.counter.value}</p>
                <p className={styles.detail}>{view.counter.detail}</p>
              </div>
            </>
          )}
          {view.heading && (
            <>
              <p className={styles.title}>{view.heading.title}</p>
              <p className={styles.subtitle}>{view.heading.subtitle}</p>
            </>
          )}
        </div>
      </div>

      {view.progress !== undefined && (
        <div className={styles.progress} role="progressbar" aria-label="Time since last change" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(view.progress * 100)}>
          <i style={{ width: `${Math.round(view.progress * 100)}%` }} />
        </div>
      )}

      <div className={styles.buttons}>
        <button type="button" className={styles.primary} onClick={() => act(view.primary.action)}>
          <ButtonIcon icon={view.primary.icon} />
          {view.primary.label}
        </button>
        {view.secondary && (
          <button type="button" className={styles.secondary} onClick={() => act(view.secondary!.action)}>
            <ButtonIcon icon={view.secondary.icon} />
            {view.secondary.label}
          </button>
        )}
      </div>
    </div>
  );
}
