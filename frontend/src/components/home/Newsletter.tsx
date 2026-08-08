import { useState, type FormEvent } from "react";
import SuccessModal from "@/components/ui/SuccessModal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessOpen(true);
    setEmail("");
  };

  return (
    <section className="pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full border border-white/15" />

        <div className="relative mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Stay Ahead of the Innovation Curve
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-blue-100">
            Get exclusive first access to product drops, professional reviews, and member-only tech
            insights. Join our community of enthusiasts.
          </p>

          <form
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Subscribe Now
            </button>
          </form>

          <p className="mt-4 text-xs text-blue-100/80">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>

      <SuccessModal
        open={successOpen}
        title="Subscribed successfully"
        message="Thanks for joining. You'll get product drops and tech updates in your inbox."
        onClose={() => setSuccessOpen(false)}
      />
    </section>
  );
}
