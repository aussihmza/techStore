/**
 * Non-essential analytics — only load after cookie consent = "accepted".
 * Set VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXX) in frontend/.env to enable GA4.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __techstoreAnalyticsLoaded?: boolean;
  }
}

const GA_SCRIPT_ID = "techstore-ga4";

function getGaId() {
  return String(import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
}

function injectGaScript(measurementId: string) {
  if (document.getElementById(GA_SCRIPT_ID)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    // GA expects Arguments-like entries on dataLayer
    window.dataLayer?.push(args as unknown as never);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

/** First-party lightweight beacon when GA id is not configured (still consent-gated). */
function enableLocalAnalytics() {
  if (window.__techstoreAnalyticsLoaded) return;
  window.__techstoreAnalyticsLoaded = true;
  document.documentElement.dataset.analytics = "local";

  try {
    const key = "techstore_analytics_hits";
    const prev = Number(sessionStorage.getItem(key) || "0");
    sessionStorage.setItem(key, String(prev + 1));
  } catch {
    // ignore
  }

  if (import.meta.env.DEV) {
    console.info(
      "[analytics] Consent granted. Set VITE_GA_MEASUREMENT_ID to load Google Analytics.",
    );
  }
}

export function enableAnalytics() {
  if (typeof window === "undefined") return;

  const gaId = getGaId();
  if (gaId) {
    injectGaScript(gaId);
    window.__techstoreAnalyticsLoaded = true;
    document.documentElement.dataset.analytics = "ga4";
    return;
  }

  enableLocalAnalytics();
}

export function disableAnalytics() {
  if (typeof window === "undefined") return;

  const script = document.getElementById(GA_SCRIPT_ID);
  if (script) script.remove();

  delete window.gtag;
  window.dataLayer = [];
  window.__techstoreAnalyticsLoaded = false;
  delete document.documentElement.dataset.analytics;
}

/** Call on boot and after consent choice. */
export function syncAnalyticsWithConsent(consent: "accepted" | "essential" | null) {
  if (consent === "accepted") {
    enableAnalytics();
  } else {
    disableAnalytics();
  }
}

export function trackPageView(path: string) {
  if (!window.__techstoreAnalyticsLoaded) return;
  if (typeof window.gtag === "function" && getGaId()) {
    window.gtag("event", "page_view", { page_path: path });
  }
}
