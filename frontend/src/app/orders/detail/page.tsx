import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import type { PlacedOrder } from "@/types/order";
import { formatPrice } from "@/lib/cart";
import { formatOrderDate, formatShippingAddress } from "@/lib/order";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import ProductImage from "@/components/ui/ProductImage";

export default function OrderDetailPage() {
  const { orderId = "" } = useParams();
  const { findOrder } = useStore();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      const match = await findOrder(orderId);
      if (!active) return;
      if (!match) {
        setOrder(null);
        setError("We couldn’t find that order on your account.");
      } else {
        setOrder(match);
      }
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [orderId, findOrder]);

  if (loading) {
    return <p className="page-shell py-16 text-center text-slate-500">Loading order...</p>;
  }

  if (!order) {
    return (
      <div className="page-shell py-16 text-center">
        <p className="text-lg font-semibold text-ink">{error || "Order not found"}</p>
        <Link to="/orders" className="btn-primary mt-6 inline-flex">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell pb-16 pt-10">
      <nav className="text-base text-slate-400">
        <Link to="/orders" className="hover:text-brand">
          My Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand">{order.id}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-heading text-3xl sm:text-4xl">{order.id}</h1>
          <p className="section-sub mt-2 text-base">
            Placed {formatOrderDate(order.placedAt)}
            {order.paymentMethod
              ? ` · ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid by card"}`
              : ""}
          </p>
        </div>
        <OrderStatusBadge
          status={order.status}
          statusLabel={order.statusLabel}
          placedAt={order.placedAt}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-ink">Items</h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      fit="contain"
                      className="h-full w-full p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty {item.qty}</p>
                  </div>
                  <p className="font-semibold text-ink">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-ink">Delivery</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Estimated window
                </dt>
                <dd className="mt-1 text-sm font-medium text-ink">
                  {order.deliveryFrom} – {order.deliveryTo}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ship to
                </dt>
                <dd className="mt-1 text-sm font-medium text-ink">
                  {formatShippingAddress(order.shipping)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-ink">Tracking</h2>
            <div className="mt-4">
              <OrderTimeline order={order} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-ink">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-medium text-ink">{formatPrice(order.subtotal)}</dd>
              </div>
              {(order.discount ?? 0) > 0 ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-600">
                    Discount{order.promoCode ? ` (${order.promoCode})` : ""}
                  </dt>
                  <dd className="font-semibold text-emerald-600">
                    -{formatPrice(order.discount ?? 0)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Tax</dt>
                <dd className="font-medium text-ink">{formatPrice(order.taxes)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-slate-100 pt-2 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-extrabold text-brand">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
