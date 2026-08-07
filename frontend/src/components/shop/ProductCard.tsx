import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import ProductImage from "@/components/ui/ProductImage";
import { CartIcon, HeartIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";

const COLLAPSE_MS = 4000;

export default function ProductCard({ product }: { product: Product }) {
  const { cart, isWishlisted, toggleWishlist, addToCart, updateQty, removeFromCart } = useStore();
  const wished = isWishlisted(product.id);
  const qty = cart.find((line) => line.id === product.id)?.qty ?? 0;
  const [controlsOpen, setControlsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCollapseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCollapseTimer = () => {
    clearCollapseTimer();
    timerRef.current = setTimeout(() => setControlsOpen(false), COLLAPSE_MS);
  };

  useEffect(() => () => clearCollapseTimer(), []);

  // If item removed from cart elsewhere, reset controls
  useEffect(() => {
    if (qty === 0) {
      setControlsOpen(false);
      clearCollapseTimer();
    }
  }, [qty]);

  const openControls = () => {
    setControlsOpen(true);
    startCollapseTimer();
  };

  const handleAdd = () => {
    addToCart(product);
    openControls();
  };

  const handleDecrease = () => {
    if (qty <= 1) {
      removeFromCart(product.id);
      setControlsOpen(false);
      clearCollapseTimer();
      return;
    }
    updateQty(product.id, qty - 1);
    startCollapseTimer();
  };

  const handleIncrease = () => {
    updateQty(product.id, qty + 1);
    startCollapseTimer();
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-white p-5">
        <div className="absolute left-3 top-3 z-10">
          {product.badge && <Badge label={product.badge} />}
        </div>
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition-colors ${
            wished ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
          }`}
        >
          <HeartIcon className="h-5 w-5" fill={wished ? "currentColor" : "none"} />
        </button>
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <ProductImage
            src={product.image}
            alt={product.name}
            fit="contain"
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/product/${product.id}`} className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {product.category}
          </span>
          <h3 className="mt-1 text-lg font-bold text-ink transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2">
          <Rating value={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3">
            <Link to={`/product/${product.id}`} className="text-2xl font-extrabold text-ink">
              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Link>

            {qty === 0 ? (
              <button
                type="button"
                aria-label="Add to cart"
                onClick={handleAdd}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-dark"
              >
                <CartIcon className="h-6 w-6" />
              </button>
            ) : !controlsOpen ? (
              <button
                type="button"
                aria-label={`Quantity ${qty}. Tap to edit`}
                onClick={openControls}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-slate-400 bg-slate-100 text-lg font-bold text-ink transition-colors hover:bg-slate-200"
              >
                {qty}
              </button>
            ) : null}
          </div>

          {qty > 0 && controlsOpen && (
            <div className="mt-3 inline-flex w-full items-center justify-between rounded-xl border-2 border-slate-400 bg-slate-100 px-2 py-1.5 text-ink">
              <button
                type="button"
                aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}
                onClick={handleDecrease}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-black/5 ${
                  qty === 1 ? "text-rose-500 hover:text-rose-600" : "text-ink"
                }`}
              >
                {qty === 1 ? <TrashIcon className="h-5 w-5" /> : <MinusIcon className="h-5 w-5" />}
              </button>

              <span className="min-w-[2rem] text-center text-lg font-bold tabular-nums" aria-live="polite">
                {qty}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={handleIncrease}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-black/5"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
