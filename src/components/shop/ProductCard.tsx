import type { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/ui/Rating";
import ProductImage from "@/components/ui/ProductImage";
import { CartIcon, HeartIcon } from "@/components/ui/icons";

export default function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist, addToCart } = useStore();
  const wished = isWishlisted(product.id);

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
        <ProductImage
          src={product.image}
          alt={product.name}
          fit="contain"
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {product.category}
        </span>
        <h3 className="mt-1 text-lg font-bold text-ink">{product.name}</h3>
        <div className="mt-2">
          <Rating value={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-2xl font-extrabold text-ink">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <button
            type="button"
            aria-label="Add to cart"
            onClick={() => addToCart(product)}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white transition-colors hover:bg-brand-dark"
          >
            <CartIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </article>
  );
}
