export default function EcosystemCta() {
  return (
    <section className="pb-20">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0b1220] px-6 py-16 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-brand/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl"
        />
        <h2 className="font-display relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Join the TechStore Ecosystem
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-slate-300">
          Experience the difference that engineering excellence makes in your daily workflow.
        </p>
        <button type="button" className="btn-secondary relative mt-8 border-white/15 bg-white text-ink">
          Start Your Collection
        </button>
      </div>
    </section>
  );
}
