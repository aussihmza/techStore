import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategoriesApi,
  toCollection,
  type ApiCategory,
} from "@/lib/api/categories";
import CategoryCard from "@/components/categories/CategoryCard";
import ShopCatalog from "@/components/shop/ShopCatalog";
import Newsletter from "@/components/home/Newsletter";
import { useParams } from "react-router-dom";

export default function CategoriesPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  // Avoid a second categories fetch — ShopCatalog loads products + categories once
  if (categorySlug) {
    return (
      <div className="page-shell py-2">
        <ShopCatalog categorySlug={categorySlug} variant="categories" />
      </div>
    );
  }

  return <CategoriesIndex />;
}

function CategoriesIndex() {
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getCategoriesApi();
        if (!active) return;
        setApiCategories(data.categories);
      } catch {
        if (active) setApiCategories([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="py-16 text-center text-slate-500">Loading categories...</p>;
  }

  return (
    <div className="page-shell">
      <nav className="pt-6 text-base text-slate-400">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand">Categories</span>
      </nav>

      <div className="mx-auto max-w-2xl pt-8 text-center">
        <h1 className="section-heading text-3xl sm:text-4xl">Shop by Category</h1>
        <p className="section-sub mt-3 text-lg">
          Find the perfect tools for your professional workflow. From high-performance workstations
          to precision peripherals.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apiCategories.map((category) => (
          <CategoryCard
            key={category.slug}
            collection={toCollection(category)}
            productCount={category.productCount ?? 0}
          />
        ))}
      </div>

      <div className="mt-16">
        <Newsletter />
      </div>
    </div>
  );
}
