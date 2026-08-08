import { Link } from "react-router-dom";
import type { Collection } from "@/types/product";
import ProductImage from "@/user/components/ui/ProductImage";
import { ArrowRightIcon } from "@/user/components/ui/icons";

export default function CategoryCard({
  collection,
  productCount = 0,
}: {
  collection: Collection;
  productCount?: number;
}) {
  return (
    <Link
      to={`/categories/${collection.slug}`}
      className="surface-card group block overflow-hidden rounded-2xl"
    >
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <ProductImage
          src={collection.image}
          alt={collection.title}
          fit="cover"
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand">
          {collection.tag}
        </span>
        <h3 className="font-display mt-1 text-xl font-bold tracking-tight text-ink">
          {collection.title}
        </h3>
        <p className="section-sub mt-2 text-base">{collection.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">
            {productCount} {productCount === 1 ? "product" : "products"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-base font-semibold text-brand transition-colors group-hover:text-brand-dark">
            Browse Collection
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
