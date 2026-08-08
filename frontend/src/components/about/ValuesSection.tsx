import type { ComponentType, SVGProps } from "react";
import { CheckCircleIcon, ShieldIcon, ZapIcon } from "@/components/ui/icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const values: { Icon: IconType; title: string; description: string }[] = [
  {
    Icon: ShieldIcon,
    title: "Unrivaled Quality",
    description:
      "We source the finest materials and workspace-grade silicon to ensure every module feels substantial and performs at peak efficiency under stress.",
  },
  {
    Icon: ZapIcon,
    title: "Constant Innovation",
    description:
      "Our R&D teams are obsessed with what's next. From cooling breakthroughs to nano-processing efficiency, we don't follow roadmaps — we draw them.",
  },
  {
    Icon: CheckCircleIcon,
    title: "Total Reliability",
    description:
      "Hardware is an investment. We provide industry-leading warranties and modular designs that let your tech evolve alongside your professional career.",
  },
];

export default function ValuesSection() {
  return (
    <section id="manifesto" className="scroll-mt-28 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="section-heading text-3xl sm:text-4xl">The TechStore DNA</h2>
        <p className="section-sub mt-3 text-lg">
          Every piece that leaves our facility is built upon three non-negotiable pillars that
          define our identity as a hardware pioneer.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
        {values.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="surface-card rounded-2xl p-8 text-center"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
              <Icon className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
            <p className="mt-2 text-base leading-relaxed text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
