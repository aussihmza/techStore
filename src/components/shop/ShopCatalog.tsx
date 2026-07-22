import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ShopFilters } from "@/types/shop";
import { catalogProducts } from "@/lib/products";
import {
  applyFilters,
  createDefaultFilters,
  getCategoryBySlug,
  getMaxCatalogPrice,
} from "@/utils/shopFilters";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";

interface ShopCatalogProps {
  categorySlug?: string;
  variant?: "shop" | "categories";
}

export default function ShopCatalog({ categorySlug, variant = "shop" }: ShopCatalogProps) {
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

  const totalInScope = useMemo(() => {
    if (!category) return catalogProducts.length;
    return catalogProducts.filter((p) => category.productCategories.includes(p.category)).length;
  }, [category]);

  const filteredProducts = useMemo(
    () => applyFilters(catalogProducts, filters, categorySlug),
    [filters, categorySlug],
  );

  const clearFilters = () => {
    setFilters({
      ...createDefaultFilters(maxPrice),
      categories: category ? [category.filterKey] : [],
    });
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

      <h1 className="mb-8 mt-2 text-3xl font-bold text-ink sm:text-4xl">
        {category ? category.label : "All Products"}
      </h1>

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
        />
      </section>
    </>
  );
}
