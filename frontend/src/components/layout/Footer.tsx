import { Link } from "react-router-dom";

const columns = [
  {
    title: "Shop Selection",
    links: [
      { label: "Laptops & PCs", href: "/shop/laptops" },
      { label: "Smartphones", href: "/shop/smartphones" },
      { label: "Audio & Sound", href: "/shop/audio" },
      { label: "Cameras", href: "/shop/cameras" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Shipping Info", href: "/contact" },
      { label: "Returns & Warranty", href: "/support#returns-warranty" },
      { label: "Order Tracking", href: "/support#order-tracking" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal#privacy-policy" },
      { label: "Terms of Service", href: "/legal#terms-of-service" },
      { label: "Cookie Policy", href: "/legal#cookie-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden bg-[#0b1220] text-slate-400">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-brand/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="page-shell relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2.5 font-display text-lg font-extrabold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm shadow-lg shadow-brand/40">
                T
              </span>
              TechStore
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Premium hardware picked for industry professionals. We deliver the standard for
              high-performance consumer electronics.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} TechStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
