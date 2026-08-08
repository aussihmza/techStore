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

export interface AddCartItemOptions {
  qty?: number;
  color?: string | null;
  storage?: string | null;
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

export function addCartItemApi(
  productSlug: string,
  options: AddCartItemOptions = {},
) {
  const { qty = 1, color, storage } = options;
  return mutateCart("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      productSlug,
      qty,
      color: color || undefined,
      storage: storage || undefined,
    }),
  });
}

export function updateCartItemApi(lineId: string, qty: number) {
  return mutateCart(`/cart/items/${encodeURIComponent(lineId)}`, {
    method: "PUT",
    body: JSON.stringify({ qty }),
  });
}

export function removeCartItemApi(lineId: string) {
  return mutateCart(`/cart/items/${encodeURIComponent(lineId)}`, {
    method: "DELETE",
  });
}

export function clearCartApi() {
  return mutateCart("/cart", { method: "DELETE" });
}
