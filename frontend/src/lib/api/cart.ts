import { apiRequest } from "@/lib/api/client";
import type { CartLine } from "@/types/order";

export interface CartData {
  items: CartLine[];
  count: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export function getCartApi() {
  return apiRequest<CartData>("/cart");
}

export function addCartItemApi(productSlug: string, qty = 1) {
  return apiRequest<CartData>("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productSlug, qty }),
  });
}

export function updateCartItemApi(productSlug: string, qty: number) {
  return apiRequest<CartData>(`/cart/items/${encodeURIComponent(productSlug)}`, {
    method: "PUT",
    body: JSON.stringify({ qty }),
  });
}

export function removeCartItemApi(productSlug: string) {
  return apiRequest<CartData>(`/cart/items/${encodeURIComponent(productSlug)}`, {
    method: "DELETE",
  });
}

export function clearCartApi() {
  return apiRequest<CartData>("/cart", { method: "DELETE" });
}
