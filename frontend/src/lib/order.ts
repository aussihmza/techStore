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
