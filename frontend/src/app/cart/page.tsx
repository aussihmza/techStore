import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { calcCartTotals } from "@/lib/cart";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";
import { ArrowLeftIcon, CartIcon } from "@/components/ui/icons";

export default function CartPage() {
  const { cart, updateQty, removeFromCart } = useStore();

  const { subtotal, taxes, total } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    return calcCartTotals(sub);
  }, [cart]);

  return (
    <div className="page-shell">
      <div className="pt-10">
        <h1 className="section-heading text-3xl sm:text-4xl">Shopping Cart</h1>
        <p className="section-sub mt-2 text-base">
          Review your selection of premium high-performance hardware.
        </p>
      </div>

      {cart.length > 0 ? (
        <section className="mt-8 grid gap-8 pb-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.2)] backdrop-blur-sm">
              <div className="hidden grid-cols-12 gap-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 sm:grid">
                <span className="col-span-6">Product</span>
                <span className="col-span-2">Price</span>
                <span className="col-span-2">Quantity</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              {cart.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQtyChange={updateQty}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-brand hover:text-brand-dark"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} taxes={taxes} total={total} />
          </div>
        </section>
      ) : (
        <div className="mb-16 mt-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
            <CartIcon className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-ink">Your cart is empty</h2>
          <p className="mt-2 max-w-sm text-base text-slate-500">
            Add products to your cart to see them here.
          </p>
          <Link
            to="/shop"
            className="mt-6 rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
