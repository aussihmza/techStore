import { Link } from "react-router-dom";

const points = [
  {
    color: "bg-brand",
    title: "Online storefront",
    location: "Shop, checkout, and track orders from anywhere",
  },
  {
    color: "bg-emerald-500",
    title: "Customer support",
    location: "Contact form + email — no fake walk-in hubs",
  },
  {
    color: "bg-amber-500",
    title: "Shipping coverage",
    location: "Free standard delivery to checkout addresses",
  },
];

export default function FootprintSection() {
  return (
    <section className="py-16">
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-8">
        <div className="lg:pr-2">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">How we operate</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
            TechStore is an online electronics shop. We focus on a curated catalog, clear shipping,
            and support you can actually use — not fictional global offices.
          </p>

          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li
                key={point.title}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${point.color}`} />
                <div>
                  <p className="text-sm font-semibold text-ink sm:text-base">{point.title}</p>
                  <p className="text-xs text-slate-500 sm:text-sm">{point.location}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className="mt-6 inline-flex text-sm font-semibold text-brand hover:underline"
          >
            Contact support
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-lg shadow-slate-200/60">
          <img
            src="/global.webp"
            alt="TechStore online operations"
            className="aspect-[16/11] w-full object-cover lg:aspect-[5/4]"
          />
        </div>
      </div>
    </section>
  );
}
