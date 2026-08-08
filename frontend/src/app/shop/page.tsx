import { useParams } from "react-router-dom";
import ShopCatalog from "@/components/shop/ShopCatalog";

export default function ShopPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <ShopCatalog categorySlug={categorySlug} />
    </div>
  );
}
