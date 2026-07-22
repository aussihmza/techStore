import { Link } from "react-router-dom";
import type { ComponentType, SVGProps } from "react";
import {
  AccessoriesIcon,
  ArrowRightIcon,
  CameraIcon,
  HeadphonesIcon,
  LaptopIcon,
  MobileIcon,
  WatchIcon,
} from "@/components/ui/icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const categories: { label: string; slug: string; Icon: IconType }[] = [
  { label: "Laptop", slug: "laptops", Icon: LaptopIcon },
  { label: "Mobile", slug: "smartphones", Icon: MobileIcon },
  { label: "Headphones", slug: "audio", Icon: HeadphonesIcon },
  { label: "Smart Watch", slug: "wearables", Icon: WatchIcon },
  { label: "Camera", slug: "cameras", Icon: CameraIcon },
  { label: "Accessories", slug: "accessories", Icon: AccessoriesIcon },
];

export default function CategoryShowcase() {
  return (
    <section className="py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">Shop by Category</h2>
          <p className="mt-1 text-base text-slate-500">Find the perfect tool for your trade</p>
        </div>
        <Link
          to="/categories"
          className="inline-flex shrink-0 items-center gap-1.5 text-base font-semibold text-brand hover:text-brand-dark"
        >
          Browse all
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ label, slug, Icon }) => (
          <Link
            key={slug}
            to={`/categories/${slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand/30 hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
              <Icon className="h-7 w-7" />
            </span>
            <span className="text-sm font-semibold text-ink">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
