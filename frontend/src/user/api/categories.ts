import { apiRequest } from "@/lib/api/client";
import { createCachedRequest } from "@/lib/api/cache";
import type { Collection } from "@/types/product";
import type { ShopCategory } from "@/types/shop";

export interface ApiCategory extends ShopCategory {
  id: string;
  tag?: string;
  title?: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export interface CategoriesData {
  categories: ApiCategory[];
  count: number;
}

export const getCategoriesApi = createCachedRequest(
  () => "/categories",
  () => apiRequest<CategoriesData>("/categories"),
);

export const getCategoryBySlugApi = createCachedRequest(
  (slug: string) => `/categories/${slug}`,
  (slug: string) =>
    apiRequest<{ category: ApiCategory }>(
      `/categories/${encodeURIComponent(slug)}`,
    ),
);

export function toShopCategory(category: ApiCategory): ShopCategory {
  return {
    slug: category.slug,
    label: category.label,
    filterKey: category.filterKey,
    productCategories: category.productCategories,
  };
}

export function toCollection(category: ApiCategory): Collection {
  return {
    tag: category.tag || category.filterKey.toUpperCase(),
    title: category.title || category.label,
    description: category.description || "",
    image: category.image || "",
    slug: category.slug,
  };
}
