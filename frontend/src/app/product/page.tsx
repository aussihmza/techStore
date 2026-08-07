import { Link, useParams } from "react-router-dom";
import {
  getCategoryLabel,
  getCategorySlug,
  getProductById,
  getProductDetail,
  getRelatedProducts,
} from "@/lib/productDetails";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductFeatures from "@/components/product/ProductFeatures";
import RelatedProducts from "@/components/product/RelatedProducts";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? getProductById(productId) : undefined;

  if (!product) {
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

  const detail = getProductDetail(product);
  const related = getRelatedProducts(product);
  const categorySlug = getCategorySlug(product.category);
  const categoryLabel = getCategoryLabel(product.category);

  return (
    <div className="w-full bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 pt-6 text-sm text-slate-400">
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
        <RelatedProducts products={related} categorySlug={categorySlug} />
      </div>
    </div>
  );
}
