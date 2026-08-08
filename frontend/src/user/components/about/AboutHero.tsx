export default function AboutHero() {
  return (
    <section className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-10 xl:-mx-14">
      <div className="relative min-h-[28rem] sm:min-h-[32rem]">
        <img
          src="/about/vission.svg"
          alt="TechStore facility"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-900/65 to-slate-900/25" />

        <div className="page-shell relative flex min-h-[28rem] items-center py-16 sm:min-h-[32rem] sm:py-20">
          <div className="max-w-xl animate-fade-up">
            <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-sky-300">
              TechStore
            </p>
            <h1 className="font-display mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Our Vision:
              <br />
              Engineering Excellence
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate-200">
              We don't just sell electronics. We curate hardware for those who demand
              professional-grade performance and zero-compromise quality.
            </p>
            <a
              href="#manifesto"
              className="btn-secondary mt-8 border-white/20 bg-white text-ink"
            >
              Our Manifesto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
