import { apiRequest } from "@/lib/api/client";
import { createCachedRequest } from "@/lib/api/cache";
import type { CartLine } from "@/types/order";

export interface CartData {
  items: CartLine[];
  count: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export const getCartApi = createCachedRequest(
  () => "/cart",
  () => apiRequest<CartData>("/cart"),
  10_000,
);

async function mutateCart(
  path: string,
  options: RequestInit,
): Promise<CartData> {
  const data = await apiRequest<CartData>(path, options);
  getCartApi.invalidateAll();
  return data;
}

export function addCartItemApi(productSlug: string, qty = 1) {
  return mutateCart("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productSlug, qty }),
  });
}

export function updateCartItemApi(productSlug: string, qty: number) {
  return mutateCart(`/cart/items/${encodeURIComponent(productSlug)}`, {
    method: "PUT",
    body: JSON.stringify({ qty }),
  });
}

export function removeCartItemApi(productSlug: string) {
  return mutateCart(`/cart/items/${encodeURIComponent(productSlug)}`, {
    method: "DELETE",
  });
}

export function clearCartApi() {
  return mutateCart("/cart", { method: "DELETE" });
}
