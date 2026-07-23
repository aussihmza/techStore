import { Link } from "react-router-dom";
import type { Collection } from "@/types/product";
import { getProductCountForCategory } from "@/utils/shopFilters";
import ProductImage from "@/components/ui/ProductImage";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function CategoryCard({ collection }: { collection: Collection }) {
  const productCount = getProductCountForCategory(collection.slug);

  return (
    <Link
      to={`/categories/${collection.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <ProductImage
          src={collection.image}
          alt={collection.title}
          fit="cover"
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand">
          {collection.tag}
        </span>
        <h3 className="mt-1 text-xl font-bold text-ink">{collection.title}</h3>
        <p className="mt-2 text-base text-slate-500">{collection.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">
            {productCount} {productCount === 1 ? "product" : "products"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-base font-semibold text-brand group-hover:text-brand-dark">
            Browse Collection
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
