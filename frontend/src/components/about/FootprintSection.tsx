const hubs = [
  { color: "bg-brand", title: "North America Hub", location: "Silicon Valley, CA" },
  { color: "bg-emerald-500", title: "European Design Studio", location: "Milan, Italy" },
  { color: "bg-amber-500", title: "APAC Logistics Center", location: "Singapore" },
];

export default function FootprintSection() {
  return (
    <section className="py-16">
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-8">
        <div className="lg:pr-2">
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">Global Footprint</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
            With flagship experience centers across three continents, we provide a grounded
            foundation for the digital elite — wherever your work takes you.
          </p>

          <ul className="mt-6 space-y-3">
            {hubs.map((hub) => (
              <li
                key={hub.title}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${hub.color}`} />
                <div>
                  <p className="text-sm font-semibold text-ink sm:text-base">{hub.title}</p>
                  <p className="text-xs text-slate-500 sm:text-sm">{hub.location}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-lg shadow-slate-200/60">
          <img
            src="/global.webp"
            alt="Global network map"
            className="aspect-[16/11] w-full object-cover lg:aspect-[5/4]"
          />
        </div>
      </div>
    </section>
  );
}
