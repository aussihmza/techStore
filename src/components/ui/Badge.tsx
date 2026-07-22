import type { ProductBadge } from "@/types/product";

const styles: Record<ProductBadge, string> = {
  SALE: "bg-rose-500 text-white",
  NEW: "bg-emerald-500 text-white",
  "BEST SELLER": "bg-brand text-white",
  "EDITOR'S CHOICE": "bg-amber-500 text-white",
};

export default function Badge({ label }: { label: ProductBadge }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles[label]}`}
    >
      {label}
    </span>
  );
}
