import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "@/components/ui/icons";

const faqs = [
  {
    q: "How long does shipping take?",
    a: (
      <>
        Orders usually process within 1–2 business days. Free standard shipping typically arrives in{" "}
        <strong className="font-semibold text-ink">3–5 business days</strong>. See full details on our{" "}
        <Link to="/support#shipping-info" className="font-semibold text-brand hover:underline">
          Shipping Info
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    q: "What is your warranty policy?",
    a: (
      <>
        TechStore products include at least a{" "}
        <strong className="font-semibold text-ink">1-year limited manufacturer warranty</strong> for
        defects in materials and workmanship under normal use. There is no extended coverage add-on
        at checkout. Read{" "}
        <Link to="/support#returns-warranty" className="font-semibold text-brand hover:underline">
          Returns & Warranty
        </Link>{" "}
        for claim steps.
      </>
    ),
  },
  {
    q: "Do you offer volume or team pricing?",
    a: (
      <>
        For multi-unit purchases, use our{" "}
        <Link to="/contact" className="font-semibold text-brand hover:underline">
          contact form
        </Link>{" "}
        with your item list and quantity. Our support team will reply with availability and the best
        pricing we can offer — there is no separate corporate portal.
      </>
    ),
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="section-heading text-3xl sm:text-4xl">Frequently Asked Questions</h2>
        <p className="section-sub mt-3 text-lg">
          Quick answers aligned with how TechStore actually ships, supports, and sells.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-sm"
            >
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
