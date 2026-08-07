import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Most orders are processed within 24 hours. Domestic shipping typically takes 2-4 business days, while international shipping ranges from 5-10 business days depending on the destination.",
  },
  {
    q: "What is your warranty policy?",
    a: "All products come with a minimum 2-year limited warranty covering manufacturing defects. Extended coverage is available at checkout for select items.",
  },
  {
    q: "Do you offer corporate discounts?",
    a: "Yes. We offer volume-based pricing and dedicated account management for teams and enterprises. Reach out to our sales team to get started.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">Frequently Asked Questions</h2>
        <p className="mt-3 text-lg text-slate-500">
          Quick answers to the most common questions about our products and services.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-base font-semibold text-ink">{faq.q}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="px-6 pb-5 text-base leading-relaxed text-slate-500">{faq.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
