const hubs = [
  { color: "bg-brand", title: "North America Hub", location: "Silicon Valley, CA" },
  { color: "bg-emerald-500", title: "European Design Studio", location: "Milan, Italy" },
  { color: "bg-amber-500", title: "APAC Logistics Center", location: "Singapore" },
];

export default function FootprintSection() {
  return (
    <section className="py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">Global Footprint</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-500">
            With flagship experience centers across three continents, we provide a grounded
            foundation for the digital elite — wherever your work takes you.
          </p>

          <ul className="mt-8 space-y-5">
            {hubs.map((hub) => (
              <li key={hub.title} className="flex items-start gap-3">
                <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${hub.color}`} />
                <div>
                  <p className="text-base font-semibold text-ink">{hub.title}</p>
                  <p className="text-sm text-slate-500">{hub.location}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl bg-slate-900">
          <img
            src="/about/Footprint.svg"
            alt="Global network map"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
