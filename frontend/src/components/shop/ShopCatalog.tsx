import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import type { Product } from "@/types/product";
import type { ShopCategory, ShopFilters } from "@/types/shop";
import { getCategoriesApi, toShopCategory } from "@/lib/api/categories";
import { getProductsApi, toProductCard } from "@/lib/api/products";
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

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const maxPrice = getMaxCatalogPrice(products);
  const category = categorySlug ? getCategoryBySlug(categorySlug, categories) : undefined;

  const [filters, setFilters] = useState<ShopFilters>(() => createDefaultFilters(0));

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProductsApi(),
          getCategoriesApi(),
        ]);
        if (!active) return;
        setProducts(productsData.products.map(toProductCard));
        setCategories(categoriesData.categories.map(toShopCategory));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!products.length) return;
    setFilters((prev) => ({
      ...createDefaultFilters(getMaxCatalogPrice(products)),
      sort: prev.sort,
      categories: category ? [category.filterKey] : [],
    }));
  }, [categorySlug, category, products]);

  const searchedProducts = useMemo(
    () => searchProducts(products, searchQuery),
    [products, searchQuery],
  );

  const totalInScope = useMemo(() => {
    const pool = searchedProducts;
    if (!category) return pool.length;
    return pool.filter((p) => category.productCategories.includes(p.category)).length;
  }, [category, searchedProducts]);

  const filteredProducts = useMemo(
    () => applyFilters(searchedProducts, filters, categories, categorySlug),
    [searchedProducts, filters, categories, categorySlug],
  );

  const clearFilters = () => {
    setFilters({
      ...createDefaultFilters(maxPrice || 0),
      categories: category ? [category.filterKey] : [],
    });
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  if (loading) {
    return <p className="py-16 text-center text-slate-500">Loading products...</p>;
  }

  if (error) {
    return <p className="py-16 text-center text-rose-600">{error}</p>;
  }

  if (categorySlug && !category) {
    return <Navigate to={variant === "categories" ? "/categories" : "/shop"} replace />;
  }

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
        <h1 className="section-heading text-3xl sm:text-4xl">
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
            products={products}
            categories={categories}
            filters={filters}
            categorySlug={categorySlug}
            onCategoriesChange={(next) => setFilters((prev) => ({ ...prev, categories: next }))}
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
