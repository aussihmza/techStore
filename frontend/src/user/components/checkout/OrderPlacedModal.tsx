import { useNavigate } from "react-router-dom";
import { orderPathId } from "@/user/lib/order";
import { CheckCircleIcon } from "@/user/components/ui/icons";

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
      <div className="relative w-full max-w-md animate-fade-up rounded-[1.5rem] border border-white/70 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          aria-label="Close"
          onClick={() => navigate("/", { replace: true })}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/35">
          <CheckCircleIcon className="h-7 w-7" />
        </span>

        <h2
          id="order-placed-title"
          className="font-display mt-5 text-2xl font-extrabold text-ink"
        >
          Order placed successfully
        </h2>
        <p className="section-sub mt-2 text-base">
          {orderId
            ? `Your order ${orderId} has been placed with Cash on Delivery.`
            : "Your order has been placed with Cash on Delivery."}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {orderId ? (
            <button
              type="button"
              onClick={() =>
                navigate(`/order-success?id=${orderPathId(orderId)}`, { replace: true })
              }
              className="btn-primary w-full"
            >
              View Order
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => navigate("/categories", { replace: true })}
            className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-slate-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
