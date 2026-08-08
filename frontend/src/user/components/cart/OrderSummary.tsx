import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ShieldIcon } from "@/user/components/ui/icons";
import { ApiError } from "@/lib/api/client";
import {
  clearStoredPromo,
  setStoredPromo,
  validatePromoApi,
  type PromoValidation,
} from "@/user/api/promo";
import { formatPrice } from "@/user/lib/cart";

interface OrderSummaryProps {
  subtotal: number;
  taxes: number;
  total: number;
  discount?: number;
  appliedPromo?: PromoValidation | null;
  onPromoChange?: (promo: PromoValidation | null) => void;
}

export default function OrderSummary({
  subtotal,
  taxes,
  total,
  discount = 0,
  appliedPromo = null,
  onPromoChange,
}: OrderSummaryProps) {
  const [code, setCode] = useState(appliedPromo?.code || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setError("");
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter a promo code.");
      return;
    }

    setLoading(true);
    try {
      const promo = await validatePromoApi(trimmed, subtotal);
      setStoredPromo(promo);
      onPromoChange?.(promo);
      setCode(promo.code);
    } catch (err) {
      clearStoredPromo();
      onPromoChange?.(null);
      setError(err instanceof ApiError ? err.message : "Invalid promo code.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    clearStoredPromo();
    onPromoChange?.(null);
    setCode("");
    setError("");
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm lg:sticky lg:top-24">
      <h2 className="font-display text-xl font-bold text-ink">Order Summary</h2>

      <dl className="mt-5 space-y-3 border-b border-slate-100 pb-5 text-base">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between">
            <dt className="text-emerald-600">
              Discount{appliedPromo ? ` (${appliedPromo.code})` : ""}
            </dt>
            <dd className="font-semibold text-emerald-600">
              -{formatPrice(discount)}
            </dd>
          </div>
        ) : null}
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
        <span className="font-display text-3xl font-extrabold text-brand">
          {formatPrice(total)}
        </span>
      </div>
      <p className="mt-1 text-right text-xs text-slate-400">Includes applicable VAT/Sales Tax</p>

      <Link to="/checkout" className="btn-primary mt-5 w-full">
        Proceed to Checkout
        <ArrowRightIcon className="h-5 w-5" />
      </Link>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand/5 px-4 py-3 text-sm text-slate-600">
        <ShieldIcon className="h-5 w-5 shrink-0 text-brand" />
        Secure encrypted checkout powered by TechStore Trust
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm text-slate-500">Have a promo code?</label>
        {appliedPromo ? (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-emerald-700">{appliedPromo.code}</p>
              <p className="truncate text-xs text-emerald-600">{appliedPromo.description}</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 text-sm font-semibold text-rose-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="CODE10"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm uppercase text-ink outline-none placeholder:normal-case placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleApply()}
              className="rounded-xl bg-slate-100 px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-60"
            >
              {loading ? "..." : "Apply"}
            </button>
          </div>
        )}
        {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
        <p className="mt-2 text-xs text-slate-400">Try CODE10, SAVE20, or TECH5</p>
      </div>
    </div>
  );
}
