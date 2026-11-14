"use client";

import { CONSENT_OPEN_EVENT } from "./consent";

/** Footer link that reopens the analytics consent banner so visitors can change their choice. */
export function ConsentSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      {label}
    </button>
  );
}
