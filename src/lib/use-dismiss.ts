import { useEffect, useRef, type RefObject } from "react";

export type DismissReason = "escape" | "outside";

/**
 * Closes a popover while it is open: on Escape, or on a pointer press outside `rootRef`.
 * The latest `onDismiss` is always used without re-subscribing the listeners.
 */
export function useDismiss(
  rootRef: RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss: (reason: DismissReason) => void,
) {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismissRef.current("escape");
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onDismissRef.current("outside");
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, rootRef]);
}
