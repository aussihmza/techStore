import { Link, Navigate, useParams } from "react-router-dom";
import { categoryCollections } from "@/lib/products";
import { getCategoryBySlug } from "@/utils/shopFilters";
import CategoryCard from "@/components/categories/CategoryCard";
import ShopCatalog from "@/components/shop/ShopCatalog";
import Newsletter from "@/components/home/Newsletter";

export default function CategoriesPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  if (categorySlug && !getCategoryBySlug(categorySlug)) {
    return <Navigate to="/categories" replace />;
  }

  if (categorySlug) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        <ShopCatalog categorySlug={categorySlug} variant="categories" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <nav className="pt-6 text-base text-slate-400">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand">Categories</span>
      </nav>

      <div className="mx-auto max-w-2xl pt-8 text-center">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">Shop by Category</h1>
        <p className="mt-3 text-lg text-slate-500">
          Find the perfect tools for your professional workflow. From high-performance workstations
          to precision peripherals.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoryCollections.map((collection) => (
          <CategoryCard key={collection.title} collection={collection} />
        ))}
      </div>

      <div className="mt-16">
        <Newsletter />
      </div>
    </div>
  );
}
