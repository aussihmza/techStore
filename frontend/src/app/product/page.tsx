import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Product, ProductDetail } from "@/types/product";
import type { ShopCategory } from "@/types/shop";
import { getCategoriesApi, toShopCategory } from "@/lib/api/categories";
import {
  getProductByIdApi,
  getProductsApi,
  toProductCard,
  toProductDetail,
} from "@/lib/api/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductFeatures from "@/components/product/ProductFeatures";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!productId?.trim()) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const id: string = productId.trim();
    let active = true;

    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const [productRes, productsRes, categoriesRes] = await Promise.all([
          getProductByIdApi(id),
          getProductsApi(),
          getCategoriesApi(),
        ]);
        if (!active) return;

        const current = toProductCard(productRes.product);
        const all = productsRes.products.map(toProductCard);
        const cats = categoriesRes.categories.map(toShopCategory);

        setProduct(current);
        setDetail(toProductDetail(productRes.product));
        setCategories(cats);
        setRelated(
          all
            .filter((p) => p.id !== current.id)
            .filter((p) => p.category === current.category || p.brand === current.brand)
            .slice(0, 4),
        );
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return <p className="py-24 text-center text-slate-500">Loading product...</p>;
  }

  if (notFound || !product || !detail) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">Product not found</h1>
        <p className="mt-2 text-slate-500">This product may have been moved or removed.</p>
        <Link
          to="/shop"
          className="mt-6 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const category =
    categories.find((c) => c.productCategories.includes(product.category)) ?? null;
  const categorySlug = category?.slug ?? "accessories";
  const categoryLabel = category?.label ?? product.category;

  return (
    <div className="w-full">
      <div className="page-shell">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 pt-6 text-sm text-slate-400"
        >
          <Link to="/shop" className="transition-colors hover:text-brand">
            Shop
          </Link>
          <span aria-hidden>›</span>
          <Link to={`/shop/${categorySlug}`} className="transition-colors hover:text-brand">
            {categoryLabel}
          </Link>
          <span aria-hidden>›</span>
          <span className="font-medium text-ink">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery key={product.id} images={detail.gallery} alt={product.name} />
          <ProductInfo key={`info-${product.id}`} product={product} detail={detail} />
        </div>

        <ProductFeatures features={detail.features} />
        <div id="reviews" className="scroll-mt-24">
          <ProductReviews
            productId={product.id}
            rating={product.rating}
            reviewsCount={product.reviews}
            onSummaryChange={({ rating, reviewsCount }) => {
              setProduct((prev) =>
                prev
                  ? { ...prev, rating, reviews: reviewsCount }
                  : prev,
              );
            }}
          />
        </div>
        <RelatedProducts products={related} categorySlug={categorySlug} />
      </div>
    </div>
  );
}
