export default function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl">
      <img
        src="/about/vission.svg"
        alt="TechStore facility"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/70 to-slate-900/30" />

      <div className="relative max-w-xl px-8 py-20 sm:px-12 sm:py-24">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur">
          Established 2014
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Our Vision:
          <br />
          Engineering Excellence
        </h1>
        <p className="mt-5 max-w-md text-lg text-slate-200">
          We don't just sell electronics. We curate a symphony of hardware designed for those who
          demand professional-grade performance and zero-compromise quality.
        </p>
        <button
          type="button"
          className="mt-8 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-slate-100"
        >
          Our Manifesto
        </button>
      </div>
    </section>
  );
}
