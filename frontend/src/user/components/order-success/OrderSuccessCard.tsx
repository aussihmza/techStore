import type { PlacedOrder } from "@/types/order";
import { formatPrice } from "@/user/lib/cart";
import { formatShippingAddress } from "@/user/lib/order";
import OrderStatusBadge from "@/user/components/orders/OrderStatusBadge";
import ProductImage from "@/user/components/ui/ProductImage";
import { TruckIcon } from "@/user/components/ui/icons";

export default function OrderSuccessCard({ order }: { order: PlacedOrder }) {
  const previewItems = order.items.slice(0, 2);
  const extraCount = order.items.reduce((sum, i) => sum + i.qty, 0) - previewItems.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Order Confirmed</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">{order.id}</p>
        </div>
        <OrderStatusBadge
          status={order.status}
          statusLabel={order.statusLabel}
          placedAt={order.placedAt}
        />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand">
          <TruckIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">
            {order.deliveryFrom} – {order.deliveryTo}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Standard Shipping (3–5 Business Days)</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {previewItems.map((item) => (
          <div
            key={item.id}
            className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <ProductImage src={item.image} alt={item.name} fit="contain" className="h-full w-full p-1" />
          </div>
        ))}
        {extraCount > 0 && (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs font-semibold text-slate-400">
            +{extraCount} More
          </div>
        )}
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs text-slate-400">Shipping to</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {formatShippingAddress(order.shipping)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Total Amount</p>
          <p className="mt-0.5 text-xl font-extrabold text-brand">{formatPrice(order.total)}</p>
        </div>
      </div>
    </div>
  );
}
