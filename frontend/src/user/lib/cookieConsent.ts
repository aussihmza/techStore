export const COOKIE_CONSENT_KEY = "techstore_cookie_consent";

export type ConsentValue = "accepted" | "essential";

export function readCookieConsent(): ConsentValue | null {
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "accepted" || value === "essential") return value;
    return null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(value: ConsentValue) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // ignore storage failures
  }
}

export function hasAnalyticsConsent() {
  return readCookieConsent() === "accepted";
}
