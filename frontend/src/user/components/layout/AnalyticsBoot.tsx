import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readCookieConsent } from "@/user/lib/cookieConsent";
import { syncAnalyticsWithConsent, trackPageView } from "@/user/lib/analytics";

/** Applies saved consent on load and tracks SPA navigations when allowed. */
export default function AnalyticsBoot() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    syncAnalyticsWithConsent(readCookieConsent());
  }, []);

  useEffect(() => {
    trackPageView(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
}
