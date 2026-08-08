import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const sections = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    updated: "July 22, 2026",
    content: [
      {
        heading: "What we collect",
        body: "When you browse TechStore, place an order, or contact support, we may collect your name, email, shipping address, payment details (processed securely by our payment partners), and basic device or usage data such as browser type and pages visited.",
      },
      {
        heading: "How we use your information",
        body: "We use your data to fulfill orders, provide customer support, improve our product catalog and site experience, send order updates, and — only with your consent — share relevant offers. We do not sell your personal information to third parties.",
      },
      {
        heading: "Sharing & security",
        body: "We share data only with trusted partners who help us operate (payment processors, shipping carriers, and analytics tools), under strict confidentiality. We use industry-standard encryption and access controls to protect your information.",
      },
      {
        heading: "Your choices",
        body: "You may request access, correction, or deletion of your personal data by contacting us at privacy@techstore.com. You can also unsubscribe from marketing emails at any time using the link in those messages.",
      },
    ],
  },
  {
    id: "terms-of-service",
    title: "Terms of Service",
    updated: "July 22, 2026",
    content: [
      {
        heading: "Using TechStore",
        body: "By accessing or purchasing from TechStore, you agree to use the site lawfully and accurately. You must be at least 18 years old (or have a parent/guardian’s consent) to place an order. Accounts must not be shared or used for fraudulent activity.",
      },
      {
        heading: "Orders & pricing",
        body: "All prices are listed in USD unless stated otherwise. We reserve the right to correct pricing or availability errors and to cancel orders affected by those errors. Placing an order is an offer to buy; we confirm acceptance when we send your order confirmation email.",
      },
      {
        heading: "Returns & warranties",
        body: "Eligible products may be returned within the period stated on the product or returns page, unused and in original packaging. Manufacturer warranties apply as described at purchase. Misuse, unauthorized repairs, or physical damage may void warranty coverage.",
      },
      {
        heading: "Limitation of liability",
        body: "To the fullest extent permitted by law, TechStore is not liable for indirect, incidental, or consequential damages arising from use of the site or products. Our total liability for any claim related to a purchase is limited to the amount you paid for that product.",
      },
    ],
  },
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    updated: "July 22, 2026",
    content: [
      {
        heading: "What are cookies?",
        body: "Cookies are small text files stored on your device when you visit TechStore. They help the site remember preferences, keep you signed in to your cart experience, and understand how visitors use our pages.",
      },
      {
        heading: "Types we use",
        body: "Essential cookies enable core features like cart and checkout. Preference cookies remember settings such as language. Analytics cookies help us measure traffic and improve performance. Marketing cookies (if enabled) help us show more relevant product recommendations.",
      },
      {
        heading: "Managing cookies",
        body: "On your first visit we show a cookie banner. “Accept all” enables analytics (for example Google Analytics when configured). “Essentials only” keeps cart and checkout working without analytics scripts. You can also control or delete cookies in your browser settings. Blocking essential cookies may limit site functionality.",
      },
      {
        heading: "Updates",
        body: "We may update this Cookie Policy when our tools or legal requirements change. The “Last updated” date at the top of this section reflects the latest revision. Continued use of TechStore after changes means you accept the updated policy.",
      },
    ],
  },
];

export default function LegalPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      // Wait a tick so layout is ready after route paint
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [hash]);

  return (
    <div className="w-full bg-white">
      <div className="page-shell pb-20 pt-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Legal</p>
          <h1 className="section-heading mt-2 text-3xl sm:text-4xl">Policies & Terms</h1>
          <p className="mt-3 text-base text-slate-500">
            Short, clear summaries of how TechStore handles your data, site use, and cookies.
          </p>

          <nav
            aria-label="Legal sections"
            className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:text-brand"
              >
                {section.title}
              </a>
            ))}
          </nav>

          <div className="mt-12 space-y-16">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border-t border-slate-100 pt-12 first:border-t-0 first:pt-0"
              >
                <h2 className="text-2xl font-bold text-ink sm:text-3xl">{section.title}</h2>
                <p className="mt-2 text-sm text-slate-400">Last updated: {section.updated}</p>

                <div className="mt-8 space-y-8">
                  {section.content.map((block) => (
                    <div key={block.heading}>
                      <h3 className="text-lg font-semibold text-ink">{block.heading}</h3>
                      <p className="mt-2 text-base leading-relaxed text-slate-500">{block.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-16 text-sm text-slate-400">
            Questions?{" "}
            <Link to="/contact" className="font-medium text-brand hover:underline">
              Contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
