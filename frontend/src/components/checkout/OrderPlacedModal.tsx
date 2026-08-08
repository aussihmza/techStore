import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@/components/ui/icons";

interface OrderPlacedModalProps {
  orderId?: string;
  open: boolean;
}

export default function OrderPlacedModal({ orderId, open }: OrderPlacedModalProps) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-placed-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate("/", { replace: true })}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
          <CheckCircleIcon className="h-7 w-7" />
        </span>

        <h2 id="order-placed-title" className="mt-5 text-2xl font-extrabold text-ink">
          Order placed successfully
        </h2>
        <p className="mt-2 text-base text-slate-500">
          {orderId
            ? `Your order ${orderId} has been placed with Cash on Delivery.`
            : "Your order has been placed with Cash on Delivery."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/categories", { replace: true })}
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
