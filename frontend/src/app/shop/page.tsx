import { useParams } from "react-router-dom";
import ShopCatalog from "@/components/shop/ShopCatalog";

export default function ShopPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  return (
    <div className="page-shell py-2">
      <ShopCatalog categorySlug={categorySlug} />
    </div>
  );
}
