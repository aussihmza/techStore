import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/ui/ProductImage";
import { PlusIcon } from "@/components/ui/icons";

export default function FeaturedCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-white p-5">
        {product.badge && (
          <div className="absolute left-3 top-3 z-10">
            <Badge label={product.badge} />
          </div>
        )}
        <ProductImage
          src={product.image}
          alt={product.name}
          fit="contain"
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex items-end justify-between gap-3 p-4">
        <Link to={`/product/${product.id}`} className="min-w-0">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {product.category}
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-ink transition-colors group-hover:text-brand">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-bold text-ink">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Link>
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => addToCart(product)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
