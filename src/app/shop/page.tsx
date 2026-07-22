import { Navigate, useParams } from "react-router-dom";
import ShopCatalog from "@/components/shop/ShopCatalog";
import { getCategoryBySlug } from "@/utils/shopFilters";

export default function ShopPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  if (categorySlug && !getCategoryBySlug(categorySlug)) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <ShopCatalog categorySlug={categorySlug} />
    </div>
  );
}
