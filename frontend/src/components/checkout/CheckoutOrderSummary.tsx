import type { CartLine } from "@/types/order";
import ProductImage from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/cart";
import { PlaceOrderButton } from "@/components/checkout/CheckoutForms";

interface CheckoutOrderSummaryProps {
  items: CartLine[];
  subtotal: number;
  taxes: number;
  total: number;
  submitting?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
}

export default function CheckoutOrderSummary({
  items,
  subtotal,
  taxes,
  total,
  submitting = false,
  submitLabel = "Place Order",
  loadingLabel = "Placing order...",
}: CheckoutOrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm lg:sticky lg:top-24">
      <h2 className="font-display text-xl font-bold text-ink">Order Summary</h2>

      <ul className="mt-5 space-y-4 border-b border-slate-200 pb-5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
              <ProductImage
                src={item.image}
                alt={item.name}
                fit="contain"
                className="h-full w-full p-1"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-400">{item.category}</p>
              <p className="mt-0.5 text-xs text-slate-500">Qty: {item.qty}</p>
            </div>
            <p className="shrink-0 text-sm font-bold text-brand">
              {formatPrice(item.price * item.qty)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-2 text-base">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Shipping</dt>
          <dd className="font-semibold text-emerald-500">Free</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Tax</dt>
          <dd className="font-medium text-ink">{formatPrice(taxes)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-5">
        <span className="text-lg font-bold text-ink">Total</span>
        <span className="text-3xl font-extrabold text-brand">{formatPrice(total)}</span>
      </div>

      <PlaceOrderButton
        disabled={submitting}
        label={submitLabel}
        loadingLabel={loadingLabel}
      />

      <p className="mt-4 text-center text-xs text-slate-400">
        By placing your order, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
