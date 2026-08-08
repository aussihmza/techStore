import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Product, ProductDetail } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { CartIcon, MinusIcon, PlusIcon, ShieldIcon, StarIcon, TrashIcon, TruckIcon } from "@/components/ui/icons";

interface ProductInfoProps {
  product: Product;
  detail: ProductDetail;
}

const formatPrice = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ProductInfo({ product, detail }: ProductInfoProps) {
  const { cart, addToCart, updateQty, removeFromCart } = useStore();
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);
  const [storageIndex, setStorageIndex] = useState(0);

  const cartLine = cart.find((line) => line.id === product.id);
  const qty = cartLine?.qty ?? 0;

  const badgeLabel =
    product.badge === "NEW"
      ? "NEW ARRIVAL"
      : product.badge === "SALE"
        ? "ON SALE"
        : product.badge === "BEST SELLER"
          ? "BEST SELLER"
          : product.badge === "EDITOR'S CHOICE"
            ? "EDITOR'S CHOICE"
            : "NEW ARRIVAL";

  const handleBuyNow = () => {
    if (!cartLine) addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col">
      <span className="inline-flex w-fit rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        {badgeLabel}
      </span>

      <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < Math.round(product.rating) ? "text-amber-400" : "text-slate-200"}`}
            />
          ))}
        </div>
        <span className="text-sm text-slate-500">
          ({product.rating.toFixed(1)} / 5.0) —{" "}
          <span className="font-medium text-brand">
            {product.reviews >= 1000
              ? `${(product.reviews / 1000).toFixed(1)}k`
              : product.reviews}{" "}
            Reviews
          </span>
        </span>
      </div>

      <div className="mt-6">
        <p className="font-display text-3xl font-extrabold text-brand sm:text-4xl">
          {formatPrice(product.price)}
        </p>
        {detail.monthlyPrice !== undefined && (
          <p className="mt-1 text-sm text-slate-400">
            or {formatPrice(detail.monthlyPrice)}/mo. for 24 mo. before trade-in
          </p>
        )}
      </div>

      {detail.colors.length > 0 && (
        <div className="mt-8">
          <p className="text-sm font-semibold text-ink">
            Color —{" "}
            <span className="font-normal text-slate-500">{detail.colors[colorIndex]?.name}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {detail.colors.map((color, i) => (
              <button
                key={color.name}
                type="button"
                aria-label={color.name}
                aria-pressed={colorIndex === i}
                onClick={() => setColorIndex(i)}
                className={`h-9 w-9 rounded-full transition-all ${
                  colorIndex === i
                    ? "ring-2 ring-ink ring-offset-2"
                    : "hover:ring-1 hover:ring-slate-300 hover:ring-offset-1"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {detail.storageOptions.length > 0 && (
        <div className="mt-7">
          <p className="text-sm font-semibold text-ink">
            {product.category === "Wearables" ? "Size" : "Storage"}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {detail.storageOptions.map((option, i) => (
              <button
                key={option}
                type="button"
                aria-pressed={storageIndex === i}
                onClick={() => setStorageIndex(i)}
                className={`min-w-[5.5rem] rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                  storageIndex === i
                    ? "border-brand bg-brand/5 text-brand"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-7 text-base leading-relaxed text-slate-500">{detail.description}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {qty > 0 ? (
          <div className="inline-flex flex-1 items-center justify-between rounded-xl border-2 border-slate-400 bg-slate-100 px-2 py-1.5 text-ink sm:min-h-[3.25rem]">
            <button
              type="button"
              aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}
              onClick={() => {
                if (qty <= 1) removeFromCart(product.id);
                else updateQty(product.id, qty - 1);
              }}
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
              onClick={() => updateQty(product.id, qty + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-black/5"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="btn-primary flex-1"
          >
            <CartIcon className="h-5 w-5" />
            Add to Cart
          </button>
        )}
        <button
          type="button"
          onClick={handleBuyNow}
          className="btn-secondary flex-1 border-brand/40 text-brand hover:border-brand"
        >
          Buy Now
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2">
          <TruckIcon className="h-5 w-5 text-brand" />
          Free Shipping
        </span>
        <span className="inline-flex items-center gap-2">
          <ShieldIcon className="h-5 w-5 text-brand" />
          1 Year Warranty
        </span>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Looking for more?{" "}
        <Link to="/shop" className="font-medium text-brand hover:underline">
          Browse the full shop
        </Link>
      </p>
    </div>
  );
}
