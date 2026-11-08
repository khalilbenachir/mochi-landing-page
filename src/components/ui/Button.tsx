import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

type Variant = "primary" | "ghost" | "light" | "island" | "dim";

interface StyleProps {
  variant?: Variant;
  block?: boolean;
  large?: boolean;
  children: ReactNode;
}

function classes({ variant = "primary", block, large }: Omit<StyleProps, "children">, extra?: string) {
  return [styles.btn, styles[variant], block && styles.block, large && styles.large, extra].filter(Boolean).join(" ");
}

/** A link styled as Mochi's chunky button (for navigation and downloads). */
export function ButtonLink({ variant, block, large, className, children, ...rest }: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes({ variant, block, large }, className)} {...rest}>
      {children}
    </a>
  );
}

/** A real `<button>` styled the same way (for actions on the page). */
export function Button({ variant, block, large, className, children, type = "button", ...rest }: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ variant, block, large }, className)} {...rest}>
      {children}
    </button>
  );
}
