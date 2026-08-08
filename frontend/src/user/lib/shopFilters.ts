import type { Product } from "@/types/product";
import type { ShopCategory, ShopFilters, SortOption } from "@/types/shop";

/** Maps shop filter keys → product.category values */
export const CATEGORY_MAP: Record<string, string[]> = {
  Laptops: ["Laptops"],
  Phones: ["Smartphones"],
  Audio: ["Audio"],
  Tablets: ["Tablets"],
  Wearables: ["Wearables"],
  Cameras: ["Cameras", "Photography"],
  Accessories: ["Accessories", "Storage"],
};

export function getCategoryBySlug(
  slug: string,
  categories: ShopCategory[],
): ShopCategory | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getMaxCatalogPrice(products: Product[]): number {
  return Math.max(...products.map((p) => p.price), 0);
}

export function matchesFilterCategory(product: Product, filterKeys: string[]): boolean {
  if (filterKeys.length === 0) return true;
  return filterKeys.some((key) => CATEGORY_MAP[key]?.includes(product.category));
}

export function applyFilters(
  products: Product[],
  filters: ShopFilters,
  categories: ShopCategory[],
  categorySlug?: string,
): Product[] {
  let result = [...products];

  const locked = categorySlug ? getCategoryBySlug(categorySlug, categories) : undefined;
  if (locked) {
    result = result.filter((p) => locked.productCategories.includes(p.category));
  }

  if (filters.categories.length > 0) {
    result = result.filter((p) => matchesFilterCategory(p, filters.categories));
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  result = result.filter((p) => p.price <= filters.maxPrice);

  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  return sortProducts(result, filters.sort);
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export function getCategoryFilterCounts(
  products: Product[],
  filters: ShopFilters,
  categories: ShopCategory[],
  categorySlug?: string,
): { label: string; count: number }[] {
  const base = getBaseForFacet(products, filters, categories, "categories", categorySlug);

  return Object.keys(CATEGORY_MAP)
    .map((label) => ({
      label,
      count: base.filter((p) => CATEGORY_MAP[label].includes(p.category)).length,
    }))
    .filter((item) => item.count > 0);
}

export function getBrandFilterCounts(
  products: Product[],
  filters: ShopFilters,
  categories: ShopCategory[],
  categorySlug?: string,
): { label: string; count: number }[] {
  const base = getBaseForFacet(products, filters, categories, "brands", categorySlug);
  const brands = [...new Set(base.map((p) => p.brand))].sort();

  return brands.map((brand) => ({
    label: brand,
    count: base.filter((p) => p.brand === brand).length,
  }));
}

function getBaseForFacet(
  products: Product[],
  filters: ShopFilters,
  categories: ShopCategory[],
  facet: "categories" | "brands",
  categorySlug?: string,
): Product[] {
  const locked = categorySlug ? getCategoryBySlug(categorySlug, categories) : undefined;
  let result = [...products];

  if (locked) {
    result = result.filter((p) => locked.productCategories.includes(p.category));
  }

  if (facet !== "categories" && filters.categories.length > 0) {
    result = result.filter((p) => matchesFilterCategory(p, filters.categories));
  }

  if (facet !== "brands" && filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand));
  }

  result = result.filter((p) => p.price <= filters.maxPrice);

  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  return result;
}

export function createDefaultFilters(maxPrice: number): ShopFilters {
  return {
    categories: [],
    brands: [],
    maxPrice,
    minRating: 0,
    sort: "featured",
  };
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter((p) => {
    const haystack = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
    return haystack.includes(q) || q.split(/\s+/).every((word) => haystack.includes(word));
  });
}
