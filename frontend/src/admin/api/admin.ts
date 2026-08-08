import { apiRequest } from "@/lib/api/client";
import type { ApiProduct } from "@/user/api/products";
import type { PlacedOrder } from "@/types/order";

export interface AdminStats {
  products: number;
  orders: number;
  reviews: number;
  pendingReturns: number;
  users: number;
}

export interface AdminRecentOrder {
  orderId: string;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string | null;
  placedAt: string;
}

export interface AdminOrder extends PlacedOrder {
  orderId: string;
  user: { id: string; name: string; email: string } | null;
}

export interface AdminReview {
  id: string;
  productSlug: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReturn {
  id: string;
  rmaId: string;
  orderId: string;
  type: string;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string } | null;
}

export function getAdminStatsApi() {
  return apiRequest<{ stats: AdminStats; recentOrders: AdminRecentOrder[] }>(
    "/admin/stats",
  );
}

export function getAdminProductsApi() {
  return apiRequest<{ products: ApiProduct[]; count: number }>("/admin/products");
}

export function createAdminProductApi(body: Record<string, unknown>) {
  return apiRequest<{ product: ApiProduct }>("/admin/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateAdminProductApi(id: string, body: Record<string, unknown>) {
  return apiRequest<{ product: ApiProduct }>(
    `/admin/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );
}

export function deleteAdminProductApi(id: string) {
  return apiRequest<null>(`/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function getAdminOrdersApi() {
  return apiRequest<{ orders: AdminOrder[]; count: number }>("/admin/orders");
}

export function updateAdminOrderApi(
  orderId: string,
  body: { paymentStatus?: string; fulfillmentStatus?: string },
) {
  const bareId = String(orderId).trim().replace(/^#/, "");
  return apiRequest<{ order: PlacedOrder }>(
    `/admin/orders/${encodeURIComponent(bareId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
}

export function getAdminReviewsApi() {
  return apiRequest<{ reviews: AdminReview[]; count: number }>("/admin/reviews");
}

export function deleteAdminReviewApi(id: string) {
  return apiRequest<null>(`/admin/reviews/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function getAdminReturnsApi() {
  return apiRequest<{ requests: AdminReturn[]; count: number }>("/admin/returns");
}

export function updateAdminReturnApi(id: string, status: string) {
  return apiRequest<{ request: AdminReturn }>(
    `/admin/returns/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}
