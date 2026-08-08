import { Link } from "react-router-dom";
import ProductImage from "@/components/ui/ProductImage";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function Hero() {
  return (
    <section className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-10 xl:-mx-14">
      <div className="relative min-h-[min(88vh,46rem)] bg-gradient-to-br from-[#e8f0ff] via-[#f7faff] to-[#eef6ff]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(37,99,235,0.16),transparent_45%),radial-gradient(ellipse_at_10%_80%,rgba(14,165,233,0.1),transparent_40%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full border border-brand/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 bottom-8 h-64 w-64 rounded-full border border-sky-300/20"
        />

        <div className="page-shell relative grid min-h-[min(88vh,46rem)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-16">
          <div className="max-w-xl">
            <p className="animate-fade-up font-display text-sm font-bold uppercase tracking-[0.22em] text-brand">
              TechStore
            </p>

            <h1 className="animate-fade-up animate-delay-1 font-display mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Engineering excellence
              <span className="mt-2 block text-brand">for professionals</span>
            </h1>

            <p className="animate-fade-up animate-delay-2 section-sub mt-6 max-w-md text-lg">
              Precision-crafted hardware for creators and builders. Explore a curated selection of
              high-performance electronics.
            </p>

            <div className="animate-fade-up animate-delay-3 mt-9 flex flex-wrap gap-3">
              <a href="#featured-innovations" className="btn-primary">
                Shop Latest Deals
                <ArrowRightIcon className="h-5 w-5" />
              </a>
              <Link to="/categories" className="btn-secondary">
                View Collections
              </Link>
            </div>
          </div>

          <div className="animate-fade-in animate-delay-2 relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-brand/15 via-transparent to-sky-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/50 p-6 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.55)] backdrop-blur-sm sm:p-10">
              <ProductImage
                src="/hero.png"
                alt="Featured workstation"
                fit="contain"
                className="mx-auto h-64 w-full drop-shadow-xl sm:h-80 lg:h-[22rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
