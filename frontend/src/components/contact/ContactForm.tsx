import { useState, type FormEvent } from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import SuccessModal from "@/components/ui/SuccessModal";
import { ApiError } from "@/lib/api/client";
import { submitContactApi } from "@/lib/api/contact";

const SUBJECTS = [
  "Technical Inquiry",
  "Order Support",
  "Project Consultation",
  "Corporate & Bulk Orders",
] as const;

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subject) {
      setError("Please select a topic.");
      return;
    }

    setLoading(true);
    try {
      await submitContactApi({ fullName, email, subject, message });
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSuccessOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.2)] backdrop-blur-sm sm:p-8">
      <h2 className="font-display text-2xl font-bold text-ink">Send us a Message</h2>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name">
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </Field>
          <Field label="Email Address">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </Field>
        </div>

        <Field label="Subject">
          <select
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-brand"
          >
            <option value="">Select a topic</option>
            {SUBJECTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Message">
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you today?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </Field>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Message"}
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </form>

      <SuccessModal
        open={successOpen}
        title="Message sent successfully"
        message="Thanks for reaching out. We'll get back to you soon."
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
