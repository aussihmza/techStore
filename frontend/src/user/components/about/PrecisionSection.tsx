import ProductImage from "@/user/components/ui/ProductImage";

const stats = [
  { value: "Curated", label: "Product catalog" },
  { value: "1-Year", label: "Limited warranty" },
  { value: "Free", label: "Standard shipping" },
];

export default function PrecisionSection() {
  return (
    <section className="py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)]">
          <ProductImage
            src="/about/Ram.svg"
            alt="Precision-engineered hardware"
            fit="cover"
            className="aspect-[4/3] w-full"
          />
        </div>

        <div>
          <h2 className="section-heading text-3xl sm:text-4xl">A Decade of Precision</h2>
          <p className="section-sub mt-5 text-lg leading-relaxed">
            TechStore began in a small workshop with a single objective: to bridge the gap between
            industrial-grade performance and consumer-focused design. We noticed that high-caliber
            hardware often lacked elegance, while beautiful devices lacked the power to keep up.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-500">
            Over the last ten years, we have grown into a global destination for tech enthusiasts.
            Our commitment is unwavering — every component we ship must earn its place.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-brand sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
