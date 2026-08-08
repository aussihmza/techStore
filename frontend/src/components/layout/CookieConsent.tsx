import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "techstore_cookie_consent";

type ConsentValue = "accepted" | "essential";

function readConsent(): ConsentValue | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "essential") return value;
    return null;
  } catch {
    return null;
  }
}

function saveConsent(value: ConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore storage failures
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!readConsent());
  }, []);

  if (!visible) return null;

  const choose = (value: ConsentValue) => {
    saveConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[110] p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-ink">We use cookies</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Essential cookies keep cart and checkout working. You can accept all cookies or continue
            with essentials only. Read our{" "}
            <Link
              to="/legal#cookie-policy"
              className="font-semibold text-brand hover:underline"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-slate-50"
          >
            Essentials only
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
