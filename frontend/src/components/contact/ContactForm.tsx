import { ArrowRightIcon } from "@/components/ui/icons";

export default function ContactForm() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-ink">Send us a Message</h2>

      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name">
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </Field>
          <Field label="Email Address">
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand"
            />
          </Field>
        </div>

        <Field label="Subject">
          <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none focus:border-brand">
            <option>Select a topic</option>
            <option>Technical Inquiry</option>
            <option>Order Support</option>
            <option>Project Consultation</option>
            <option>Corporate & Bulk Orders</option>
          </select>
        </Field>

        <Field label="Message">
          <textarea
            rows={5}
            placeholder="How can we help you today?"
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </Field>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Send Message
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </form>
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
