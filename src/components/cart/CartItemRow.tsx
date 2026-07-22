import { Link } from "react-router-dom";
import ProductImage from "@/components/ui/ProductImage";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  qty: number;
}

interface CartItemRowProps {
  item: CartItem;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const formatPrice = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function CartItemRow({ item, onQtyChange, onRemove }: CartItemRowProps) {
  return (
    <div className="grid grid-cols-12 items-center gap-4 border-t border-slate-100 py-5">
      <div className="col-span-12 flex items-center gap-4 sm:col-span-6">
        <Link
          to={`/product/${item.id}`}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100"
        >
          <ProductImage src={item.image} alt={item.name} fit="contain" className="h-full w-full p-1.5" />
        </Link>
        <div>
          <Link to={`/product/${item.id}`} className="text-base font-bold text-ink hover:text-brand">
            {item.name}
          </Link>
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            {item.category}
          </span>
        </div>
      </div>

      <div className="col-span-4 text-sm text-slate-500 sm:col-span-2">{formatPrice(item.price)}</div>

      <div className="col-span-4 sm:col-span-2">
        <div className="inline-flex items-center rounded-lg border border-slate-200">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}
            className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-brand"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-base font-medium text-ink">{item.qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onQtyChange(item.id, item.qty + 1)}
            className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-brand"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="col-span-4 flex items-center justify-between gap-3 sm:col-span-2 sm:justify-end">
        <span className="text-base font-bold text-brand">{formatPrice(item.price * item.qty)}</span>
        <button
          type="button"
          aria-label="Remove item"
          onClick={() => onRemove(item.id)}
          className="text-slate-300 transition-colors hover:text-rose-500"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
