import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SuccessModal from "@/user/components/ui/SuccessModal";
import { ApiError } from "@/lib/api/client";
import { subscribeNewsletterApi } from "@/user/api/newsletter";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Thanks for joining. You'll get product drops and tech updates in your inbox.",
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await subscribeNewsletterApi(email.trim());
      setSuccessMessage(
        data.alreadySubscribed
          ? "This email is already on our list. You're all set."
          : "Thanks for joining. You'll get product drops and tech updates in your inbox.",
      );
      setSuccessOpen(true);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not subscribe. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-16 sm:pb-20">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand via-[#2563eb] to-[#1e40af] px-6 py-14 text-center shadow-[0_30px_80px_-40px_rgba(37,99,235,0.7)] sm:px-12">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_40%)]" />

        <div className="relative mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Stay Ahead of the Innovation Curve
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-blue-100">
            Get exclusive first access to product drops, professional reviews, and member-only tech
            insights.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => void handleSubmit(e)}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email address"
              disabled={loading}
              className="flex-1 rounded-xl border border-white/25 bg-white/95 px-4 py-3.5 text-sm text-ink shadow-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white/50 disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>

          {error ? (
            <p className="mx-auto mt-3 max-w-md rounded-xl border border-rose-200/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-50">
              {error}
            </p>
          ) : null}

          <p className="mt-4 text-xs text-blue-100/80">
            By subscribing, you agree to our{" "}
            <Link to="/legal#privacy-policy" className="underline hover:text-white">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/legal#terms-of-service" className="underline hover:text-white">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        title="Subscribed successfully"
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />
    </section>
  );
}
