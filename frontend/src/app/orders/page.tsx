import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/cart";
import { formatOrderDate, orderPathId } from "@/lib/order";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import ProductImage from "@/components/ui/ProductImage";
import { CartIcon } from "@/components/ui/icons";

export default function OrdersPage() {
  const { orders } = useStore();

  return (
    <div className="page-shell">
      <div className="pt-10">
        <h1 className="section-heading text-3xl sm:text-4xl">My Orders</h1>
        <p className="section-sub mt-2 max-w-xl text-base">
          Track every TechStore order, see delivery estimates, and review what you purchased.
        </p>
      </div>

      {orders.length > 0 ? (
        <ul className="mt-8 space-y-4 pb-16">
          {orders.map((order) => {
            const preview = order.items.slice(0, 3);
            const extra = order.items.length - preview.length;
            return (
              <li key={order.id}>
                <Link
                  to={`/orders/${orderPathId(order.id)}`}
                  className="block rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 hover:border-brand/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Order
                      </p>
                      <p className="mt-1 text-lg font-bold text-ink">{order.id}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Placed {formatOrderDate(order.placedAt)}
                        {order.paymentMethod
                          ? ` · ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"}`
                          : ""}
                      </p>
                    </div>
                    <OrderStatusBadge
                      status={order.status}
                      statusLabel={order.statusLabel}
                      placedAt={order.placedAt}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {preview.map((item) => (
                      <div
                        key={`${order.id}-${item.id}`}
                        className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white"
                      >
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          fit="contain"
                          className="h-full w-full p-1"
                        />
                      </div>
                    ))}
                    {extra > 0 ? (
                      <span className="text-sm font-semibold text-slate-400">
                        +{extra} more
                      </span>
                    ) : null}
                    <span className="ml-auto text-base font-extrabold text-brand">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mb-16 mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/50 py-20 text-center backdrop-blur-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand/50">
            <CartIcon className="h-8 w-8" />
          </span>
          <h2 className="font-display mt-5 text-xl font-bold text-ink">No orders yet</h2>
          <p className="section-sub mt-2 max-w-sm text-base">
            When you place an order, it will show up here with live tracking status.
          </p>
          <Link to="/shop" className="btn-primary mt-6">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
