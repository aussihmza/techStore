import type { FulfillmentStatus, PlacedOrder } from "@/types/order";

export function generateOrderId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `#TS-${num}`;
}

export function getEstimatedDelivery(): { from: string; to: string } {
  const from = new Date();
  from.setDate(from.getDate() + 3);
  const to = new Date();
  to.setDate(to.getDate() + 5);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return { from: fmt(from), to: fmt(to) };
}

export function formatShippingAddress(shipping: {
  address: string;
  city: string;
  state: string;
  zip: string;
}): string {
  return `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`;
}

export function orderPathId(orderId: string) {
  return encodeURIComponent(orderId.trim().replace(/^#/, ""));
}

export function deriveFulfillmentStatus(placedAt?: string | Date | null): {
  status: FulfillmentStatus;
  statusLabel: string;
} {
  const placed = placedAt ? new Date(placedAt).getTime() : NaN;
  if (Number.isNaN(placed)) {
    return { status: "processing", statusLabel: "Processing" };
  }

  const hours = (Date.now() - placed) / (1000 * 60 * 60);

  if (hours < 24) {
    return { status: "processing", statusLabel: "Processing" };
  }
  if (hours < 72) {
    return { status: "shipped", statusLabel: "In transit" };
  }
  if (hours < 120) {
    return { status: "out_for_delivery", statusLabel: "Out for delivery" };
  }
  return { status: "delivered", statusLabel: "Delivered" };
}

export function getOrderStatus(order: Pick<PlacedOrder, "status" | "statusLabel" | "placedAt">) {
  if (order.status && order.statusLabel) {
    return { status: order.status, statusLabel: order.statusLabel };
  }
  return deriveFulfillmentStatus(order.placedAt);
}

export function formatOrderDate(placedAt?: string) {
  if (!placedAt) return "—";
  const date = new Date(placedAt);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
