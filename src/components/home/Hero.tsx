import { Link } from "react-router-dom";
import ProductImage from "@/components/ui/ProductImage";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <div className="grid items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-semibold text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            NEW ARRIVALS 2024
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Engineering
            <br />
            Excellence
            <br />
            <span className="text-brand">For Professionals</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-slate-500">
            Elevate your workflow with precision-crafted hardware designed for the modern creator.
            Explore our curated selection of high-performance electronics.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#featured-innovations"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Shop Latest Deals
              <ArrowRightIcon className="h-5 w-5" />
            </a>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-slate-50"
            >
              View Collections
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-100 p-6 shadow-sm">
            <ProductImage
              src="/hero.png"
              alt="Featured workstation"
              fit="contain"
              className="mx-auto h-64 w-full sm:h-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
