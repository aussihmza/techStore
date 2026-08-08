import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import type { SortOption } from "@/types/shop";
import ProductCard from "@/components/shop/ProductCard";
import Pagination from "@/components/shop/Pagination";
import { ChevronDownIcon } from "@/components/ui/icons";

const PAGE_SIZE = 9;

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
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [products, sort]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  }, [products, page]);

  const showingFrom = products.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, products.length);

  return (
    <div className="flex-1">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-base text-slate-500">
          {products.length > 0 ? (
            <>
              Showing{" "}
              <span className="font-medium text-ink">
                {showingFrom}–{showingTo}
              </span>{" "}
              of <span className="font-medium text-ink">{products.length}</span> products
            </>
          ) : (
            <>
              Showing <span className="font-medium text-ink">0</span> of{" "}
              <span className="font-medium text-ink">{total}</span> products
            </>
          )}
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

      {pageProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
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
