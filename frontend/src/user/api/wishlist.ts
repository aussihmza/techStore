import { apiRequest } from "@/lib/api/client";
import { createCachedRequest } from "@/lib/api/cache";
import type { Product } from "@/types/product";

export interface WishlistData {
  products: Product[];
  count: number;
  wishlisted?: boolean;
}

export const getWishlistApi = createCachedRequest(
  () => "/wishlist",
  () => apiRequest<WishlistData>("/wishlist"),
  10_000,
);

async function mutateWishlist(
  path: string,
  options: RequestInit,
): Promise<WishlistData> {
  const data = await apiRequest<WishlistData>(path, options);
  getWishlistApi.invalidateAll();
  return data;
}

export function addWishlistItemApi(productSlug: string) {
  return mutateWishlist("/wishlist/items", {
    method: "POST",
    body: JSON.stringify({ productSlug }),
  });
}

export function removeWishlistItemApi(productSlug: string) {
  return mutateWishlist(`/wishlist/items/${encodeURIComponent(productSlug)}`, {
    method: "DELETE",
  });
}

export function toggleWishlistApi(productSlug: string) {
  return mutateWishlist("/wishlist/toggle", {
    method: "POST",
    body: JSON.stringify({ productSlug }),
  });
}
