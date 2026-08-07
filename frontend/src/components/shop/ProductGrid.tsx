import type { Product } from "@/types/product";
import type { SortOption } from "@/types/shop";
import ProductCard from "@/components/shop/ProductCard";
import { ChevronDownIcon } from "@/components/ui/icons";

interface ProductGridProps {
  products: Product[];
  total: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  emptyHint?: string;
}

export default function ProductGrid({
  products,
  total,
  sort,
  onSortChange,
  emptyHint,
}: ProductGridProps) {
  return (
    <div className="flex-1">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-base text-slate-500">
          Showing <span className="font-medium text-ink">{products.length}</span> of{" "}
          <span className="font-medium text-ink">{total}</span> products
        </p>
        <label className="flex items-center gap-2 text-base text-slate-500">
          Sort by
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-base font-medium text-ink outline-none focus:border-brand"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </label>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-lg font-semibold text-ink">No products found</p>
          <p className="mt-2 text-base text-slate-500">
            {emptyHint ?? "Try adjusting your filters to see more results."}
          </p>
        </div>
      )}
    </div>
  );
}
