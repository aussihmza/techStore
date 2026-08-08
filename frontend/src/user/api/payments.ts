import { apiRequest } from "@/lib/api/client";
import type { ShippingInfo } from "@/types/order";

export function createCheckoutSessionApi(
  shipping: ShippingInfo,
  promoCode?: string | null,
) {
  return apiRequest<{ url: string; sessionId: string }>(
    "/payments/create-checkout-session",
    {
      method: "POST",
      body: JSON.stringify({ shipping, promoCode: promoCode || undefined }),
    },
  );
}

export function completeCheckoutSessionApi(sessionId: string) {
  return apiRequest<{
    order: import("@/types/order").PlacedOrder;
    alreadyCompleted?: boolean;
  }>("/payments/complete-checkout", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}
