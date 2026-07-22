import { featuredProducts } from "@/lib/products";
import FeaturedCard from "@/components/featured/FeaturedCard";

export default function FeaturedSection() {
  return (
    <section className="py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">Featured Innovations</h2>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-brand" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <FeaturedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
