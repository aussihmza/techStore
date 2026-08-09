import { apiRequest } from "@/lib/api/client";
import { createCachedRequest } from "@/lib/api/cache";
import type { Product, ProductDetail, StorageOption } from "@/types/product";
import { normalizeStorageOptions } from "@/user/lib/storageOptions";

export type ApiProduct = Product &
  ProductDetail & {
    slug?: string;
    isFeatured?: boolean;
    isShop?: boolean;
    storageOptions?: StorageOption[] | string[];
  };

export interface ProductsData {
  products: ApiProduct[];
  count: number;
}

export interface ProductQuery {
  featured?: boolean;
  shop?: boolean;
  categorySlug?: string;
  brand?: string;
  search?: string;
  sort?: string;
  maxPrice?: number;
  minRating?: number;
}

function toQuery(params: ProductQuery = {}): string {
  const search = new URLSearchParams();
  if (params.featured) search.set("featured", "true");
  if (params.shop) search.set("shop", "true");
  if (params.categorySlug) search.set("categorySlug", params.categorySlug);
  if (params.brand) search.set("brand", params.brand);
  if (params.search) search.set("search", params.search);
  if (params.sort) search.set("sort", params.sort);
  if (params.maxPrice != null) search.set("maxPrice", String(params.maxPrice));
  if (params.minRating != null) search.set("minRating", String(params.minRating));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const getProductsApi = createCachedRequest(
  (params?: ProductQuery) => `/products${toQuery(params)}`,
  (params?: ProductQuery) => apiRequest<ProductsData>(`/products${toQuery(params)}`),
);

export const getProductByIdApi = createCachedRequest(
  (id: string) => `/products/${id}`,
  (id: string) =>
    apiRequest<{ product: ApiProduct }>(`/products/${encodeURIComponent(id)}`),
);

export function toProductCard(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    quantity: product.quantity,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    badge: product.badge,
  };
}

export function toProductDetail(product: ApiProduct): ProductDetail {
  return {
    description: product.description ?? "",
    colors: [],
    storageOptions: normalizeStorageOptions(
      product.storageOptions,
      product.price,
    ),
    gallery: product.gallery?.length ? product.gallery : [product.image],
    features: product.features ?? [],
  };
}
