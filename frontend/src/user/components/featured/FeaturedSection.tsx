import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getProductsApi, toProductCard } from "@/user/api/products";
import FeaturedCard from "@/user/components/featured/FeaturedCard";

export default function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
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
    <section id="featured-innovations" className="scroll-mt-32 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <h2 className="section-heading text-3xl sm:text-4xl">Featured Innovations</h2>
        <p className="section-sub mx-auto mt-2 max-w-lg text-base">
          Hand-picked hardware shaping modern creative and professional workflows.
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand" />
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Loading featured products...</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
