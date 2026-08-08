import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/shop/ProductCard";
import { CartIcon, HeartIcon } from "@/components/ui/icons";

export default function WishlistPage() {
  const { wishlist, addToCart } = useStore();

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-4 pt-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="section-heading text-3xl sm:text-4xl">My Wishlist</h1>
          <p className="section-sub mt-2 max-w-xl text-base">
            Manage your curated list of high-performance tech. Keep track of limited stock items and
            price drops before you upgrade your workstation.
          </p>
        </div>
        {wishlist.length > 0 && (
          <button
            type="button"
            onClick={() => wishlist.forEach(addToCart)}
            className="btn-primary shrink-0"
          >
            <CartIcon className="h-5 w-5" />
            Add All to Cart
          </button>
        )}
      </div>

      {wishlist.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mb-16 mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-white/50 py-20 text-center backdrop-blur-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand/50">
            <HeartIcon className="h-8 w-8" />
          </span>
          <h2 className="font-display mt-5 text-xl font-bold text-ink">Your wishlist is empty</h2>
          <p className="section-sub mt-2 max-w-sm text-base">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link to="/shop" className="btn-primary mt-6">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
