import { apiRequest } from "@/lib/api/client";
import type { PlacedOrder, ShippingInfo } from "@/types/order";

export interface OrdersData {
  orders: PlacedOrder[];
  count: number;
}

export function getOrdersApi() {
  return apiRequest<OrdersData>("/orders");
}

export function getOrderByIdApi(orderId: string) {
  return apiRequest<{ order: PlacedOrder }>(
    `/orders/${encodeURIComponent(orderId)}`,
  );
}

export function placeOrderApi(shipping: ShippingInfo) {
  return apiRequest<{ order: PlacedOrder }>("/orders", {
    method: "POST",
    body: JSON.stringify({ shipping }),
  });
}
