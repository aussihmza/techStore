import { Link } from "react-router-dom";
import { ArrowRightIcon, ShieldIcon } from "@/components/ui/icons";

interface OrderSummaryProps {
  subtotal: number;
  taxes: number;
  total: number;
}

const formatPrice = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function OrderSummary({ subtotal, taxes, total }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-ink">Order Summary</h2>

      <dl className="mt-5 space-y-3 border-b border-slate-100 pb-5 text-base">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Estimated Shipping</dt>
          <dd className="font-semibold text-emerald-500">Free</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Estimated Taxes</dt>
          <dd className="font-medium text-ink">{formatPrice(taxes)}</dd>
        </div>
      </dl>

      <div className="flex items-end justify-between pt-5">
        <span className="text-lg font-bold text-ink">Total</span>
        <span className="text-3xl font-extrabold text-brand">{formatPrice(total)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-slate-400">Includes applicable VAT/Sales Tax</p>

      <Link
        to="/checkout"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Proceed to Checkout
        <ArrowRightIcon className="h-5 w-5" />
      </Link>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <ShieldIcon className="h-5 w-5 shrink-0 text-brand" />
        Secure encrypted checkout powered by TechStore Trust
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm text-slate-500">Have a promo code?</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="CODE10"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-brand"
          />
          <button
            type="button"
            className="rounded-lg bg-slate-100 px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
