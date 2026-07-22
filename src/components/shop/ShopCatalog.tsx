import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { ShopFilters } from "@/types/shop";
import { catalogProducts } from "@/lib/products";
import {
  applyFilters,
  createDefaultFilters,
  getCategoryBySlug,
  getMaxCatalogPrice,
  searchProducts,
} from "@/utils/shopFilters";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";

interface ShopCatalogProps {
  categorySlug?: string;
  variant?: "shop" | "categories";
}

export default function ShopCatalog({ categorySlug, variant = "shop" }: ShopCatalogProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const maxPrice = getMaxCatalogPrice();
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const [filters, setFilters] = useState<ShopFilters>(() => createDefaultFilters(maxPrice));

  useEffect(() => {
    setFilters((prev) => ({
      ...createDefaultFilters(maxPrice),
      sort: prev.sort,
      categories: category ? [category.filterKey] : [],
    }));
  }, [categorySlug, category, maxPrice]);

  const searchedProducts = useMemo(
    () => searchProducts(catalogProducts, searchQuery),
    [searchQuery],
  );

  const totalInScope = useMemo(() => {
    const pool = searchedProducts;
    if (!category) return pool.length;
    return pool.filter((p) => category.productCategories.includes(p.category)).length;
  }, [category, searchedProducts]);

  const filteredProducts = useMemo(
    () => applyFilters(searchedProducts, filters, categorySlug),
    [searchedProducts, filters, categorySlug],
  );

  const clearFilters = () => {
    setFilters({
      ...createDefaultFilters(maxPrice),
      categories: category ? [category.filterKey] : [],
    });
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <nav className="pt-6 text-base text-slate-400">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        {variant === "categories" ? (
          <>
            <Link to="/categories" className="hover:text-brand">
              Categories
            </Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-brand">{category.label}</span>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/shop" className="hover:text-brand">
              Shop
            </Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-brand">{category.label}</span>
              </>
            )}
          </>
        )}
      </nav>

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">
          {searchQuery
            ? `Results for “${searchQuery}”`
            : category
              ? category.label
              : "All Products"}
        </h1>
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="mt-2 text-sm font-semibold text-brand hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      <section className="flex flex-col items-stretch gap-8 pb-16 lg:flex-row">
        <div className="lg:w-80 lg:shrink-0">
          <FilterSidebar
            filters={filters}
            categorySlug={categorySlug}
            onCategoriesChange={(categories) => setFilters((prev) => ({ ...prev, categories }))}
            onBrandsChange={(brands) => setFilters((prev) => ({ ...prev, brands }))}
            onMaxPriceChange={(maxPriceValue) =>
              setFilters((prev) => ({ ...prev, maxPrice: maxPriceValue }))
            }
            onMinRatingChange={(minRating) => setFilters((prev) => ({ ...prev, minRating }))}
            onClear={clearFilters}
          />
        </div>

        <ProductGrid
          products={filteredProducts}
          total={totalInScope}
          sort={filters.sort}
          onSortChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
          emptyHint={
            searchQuery
              ? `No products matched “${searchQuery}”. Try a different keyword.`
              : undefined
          }
        />
      </section>
    </>
  );
}
