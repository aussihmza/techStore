import { apiRequest } from "@/lib/api/client";
import { createCachedRequest } from "@/lib/api/cache";
import { getCartApi } from "@/user/api/cart";
import type { PlacedOrder, ShippingInfo } from "@/types/order";

export interface OrdersData {
  orders: PlacedOrder[];
  count: number;
}

export type PaymentMethodOption = "cod" | "card";

export const getOrdersApi = createCachedRequest(
  () => "/orders",
  () => apiRequest<OrdersData>("/orders"),
  10_000,
);

export const getOrderByIdApi = createCachedRequest(
  (orderId: string) => `/orders/${orderId}`,
  (orderId: string) =>
    apiRequest<{ order: PlacedOrder }>(
      `/orders/${encodeURIComponent(orderId)}`,
    ),
  10_000,
);

export async function placeOrderApi(
  shipping: ShippingInfo,
  paymentMethod: PaymentMethodOption = "cod",
  promoCode?: string | null,
) {
  const data = await apiRequest<{ order: PlacedOrder }>("/orders", {
    method: "POST",
    body: JSON.stringify({ shipping, paymentMethod, promoCode: promoCode || undefined }),
  });
  getOrdersApi.invalidateAll();
  getOrderByIdApi.invalidateAll();
  getCartApi.invalidateAll();
  return data;
}
