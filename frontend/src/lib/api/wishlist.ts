import { apiRequest } from "@/lib/api/client";
import type { Product } from "@/types/product";

export interface WishlistData {
  products: Product[];
  count: number;
  wishlisted?: boolean;
}

export function getWishlistApi() {
  return apiRequest<WishlistData>("/wishlist");
}

export function addWishlistItemApi(productSlug: string) {
  return apiRequest<WishlistData>("/wishlist/items", {
    method: "POST",
    body: JSON.stringify({ productSlug }),
  });
}

export function removeWishlistItemApi(productSlug: string) {
  return apiRequest<WishlistData>(
    `/wishlist/items/${encodeURIComponent(productSlug)}`,
    { method: "DELETE" },
  );
}

export function toggleWishlistApi(productSlug: string) {
  return apiRequest<WishlistData>("/wishlist/toggle", {
    method: "POST",
    body: JSON.stringify({ productSlug }),
  });
}
