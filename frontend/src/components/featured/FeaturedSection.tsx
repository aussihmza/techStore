import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getProductsApi, toProductCard } from "@/lib/api/products";
import FeaturedCard from "@/components/featured/FeaturedCard";

export default function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // Reuse the same /products cache as SearchBar (no extra featured request)
        const data = await getProductsApi();
        if (!active) return;
        setProducts(
          data.products
            .filter((product) => product.isFeatured)
            .map(toProductCard),
        );
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="featured-innovations" className="scroll-mt-32 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">Featured Innovations</h2>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-brand" />
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Loading featured products...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
