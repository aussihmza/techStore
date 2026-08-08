import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import ProductImage from "@/user/components/ui/ProductImage";
import { ArrowRightIcon, HeartIcon } from "@/user/components/ui/icons";

interface RelatedProductsProps {
  products: Product[];
  categorySlug: string;
}

export default function RelatedProducts({ products, categorySlug }: RelatedProductsProps) {
  const { isWishlisted, toggleWishlist } = useStore();

  if (products.length === 0) return null;

  return (
    <section className="pb-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="section-heading text-2xl sm:text-3xl">Complete Your Experience</h2>
        <Link
          to={`/shop/${categorySlug}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          View all
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const wished = isWishlisted(product.id);
          return (
            <article
              key={product.id}
              className="surface-card group relative overflow-hidden rounded-2xl"
            >
              <button
                type="button"
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wished}
                onClick={() => toggleWishlist(product)}
                className={`absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition-colors ${
                  wished ? "text-rose-500" : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-500"
                }`}
              >
                <HeartIcon className="h-4 w-4" fill={wished ? "currentColor" : "none"} />
              </button>

              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-[4/3] bg-slate-50 p-6">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    fit="contain"
                    className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {product.category}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-ink group-hover:text-brand">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-lg font-bold text-brand">
                    $
                    {product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
