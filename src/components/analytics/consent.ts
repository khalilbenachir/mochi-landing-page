/** Where the visitor's analytics choice is kept, and the event that reopens the banner. */
export const CONSENT_STORAGE_KEY = "mochi-analytics-consent";
export const CONSENT_OPEN_EVENT = "mochi:open-consent";

export type ConsentChoice = "granted" | "denied";

export function readConsent(): ConsentChoice | undefined {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : undefined;
  } catch {
    return undefined;
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage can be blocked (private mode); the choice then lasts for this page view only.
  }
}

/** Expires Google Analytics cookies (`_ga`, `_ga_<id>`) on this host and its parent domains. */
export function clearAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim() ?? "")
    .filter((name) => name === "_ga" || name.startsWith("_ga_") || name === "_gid");
  const parts = window.location.hostname.split(".");
  const domains = parts.map((_, i) => parts.slice(i).join(".")).filter((domain) => domain.includes("."));
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
  }
}
