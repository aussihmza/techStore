import { Link } from "react-router-dom";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "@/components/ui/icons";

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
    <footer className="bg-slate-900 text-slate-400">
      <div className="w-full px-4 py-14 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2 text-lg font-extrabold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm">
                T
              </span>
              TechStore
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              Premium hardware picked for industry professionals. We deliver the standard for
              high-performance consumer electronics.
            </p>
            <div className="mt-5 flex gap-3">
              {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © 2024 TechStore. All rights reserved. Designed & developed with care.
        </div>
      </div>
    </footer>
  );
}
