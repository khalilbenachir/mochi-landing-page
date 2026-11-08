import type { CSSProperties, ReactNode } from "react";
import styles from "./ui.module.css";

/** An iPhone frame. The screen content is drawn by the caller. */
export function Phone({ children, className, screenStyle }: { children: ReactNode; className?: string; screenStyle?: CSSProperties }) {
  return (
    <div className={[styles.phone, className].filter(Boolean).join(" ")}>
      <div className={styles.screen} style={screenStyle}>
        {children}
      </div>
    </div>
  );
}
