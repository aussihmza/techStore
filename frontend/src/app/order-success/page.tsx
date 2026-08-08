import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import type { PlacedOrder } from "@/types/order";
import { orderPathId } from "@/lib/order";
import OrderSuccessCard from "@/components/order-success/OrderSuccessCard";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/ui/icons";

export default function OrderSuccessPage() {
  const { lastOrder, findOrder, isLoggedIn, authReady } = useStore();
  const [params] = useSearchParams();
  const queryId = params.get("id")?.trim() || "";
  const [order, setOrder] = useState<PlacedOrder | null>(lastOrder);
  const [loading, setLoading] = useState(Boolean(queryId));

  useEffect(() => {
    if (!queryId || !authReady || !isLoggedIn) {
      setOrder(lastOrder);
      setLoading(false);
      return;
    }

    let active = true;
    void findOrder(queryId).then((match) => {
      if (!active) return;
      setOrder(match || lastOrder);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [queryId, authReady, isLoggedIn, findOrder, lastOrder]);

  if (!authReady || loading) {
    return <p className="page-shell py-16 text-center text-slate-500">Loading order...</p>;
  }

  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
      <div className="grid items-start gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
            <CheckCircleIcon className="h-7 w-7" />
          </span>

          <h1 className="mt-6 text-3xl font-extrabold text-ink sm:text-4xl">
            Thank you for your purchase!
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-500">
            Your order is confirmed. You can track shipment status anytime from My Orders.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={`/orders/${orderPathId(order.id)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              View Order
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-slate-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        <OrderSuccessCard order={order} />
      </div>

      <p className="pb-16 text-center text-base text-slate-500">
        Need help with your order?{" "}
        <Link to="/contact" className="font-semibold text-brand hover:text-brand-dark">
          Contact our Support Team
        </Link>
      </p>
    </div>
  );
}
