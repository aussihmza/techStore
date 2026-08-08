import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminOrderApi,
  getAdminOrdersApi,
  updateAdminOrderApi,
  type AdminOrder,
} from "@/admin/api/admin";
import OrdersTable, { PAYMENT } from "@/admin/components/OrdersTable";
import { useStore } from "@/context/StoreContext";
import { ApiError } from "@/lib/api/client";

export default function AdminOrderHistoryPage() {
  const { removeLocalOrder, refreshOrders } = useStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");

  const load = async () => {
    const data = await getAdminOrdersApi();
    setOrders(data.orders);
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        await load();
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Load failed.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const delivered = useMemo(
    () => orders.filter((order) => order.status === "delivered"),
    [orders],
  );

  const filtered = useMemo(() => {
    if (paymentFilter === "all") return delivered;
    return delivered.filter(
      (order) => (order.paymentStatus || "pending") === paymentFilter,
    );
  }, [delivered, paymentFilter]);

  const patch = async (
    orderId: string,
    body: { paymentStatus?: string; fulfillmentStatus?: string },
  ) => {
    try {
      await updateAdminOrderApi(orderId, body);
      await load();
      await refreshOrders();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
      throw err;
    }
  };

  const remove = async (orderId: string) => {
    try {
      await deleteAdminOrderApi(orderId);
      removeLocalOrder(orderId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
      throw err;
    }
  };

  if (loading) return <p className="text-slate-500">Loading order history...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Order History</h2>
          <p className="mt-1 text-slate-500">
            Delivered orders. Active ones stay on{" "}
            <Link to="/admin/orders" className="font-semibold text-brand hover:underline">
              Orders
            </Link>
            .
          </p>
        </div>
        <p className="text-sm text-slate-400">{filtered.length} delivered</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Payment</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
          >
            <option value="all">All</option>
            {PAYMENT.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <OrdersTable
        orders={filtered}
        emptyMessage="No delivered orders yet."
        onPatch={patch}
        onDelete={remove}
      />
    </div>
  );
}
