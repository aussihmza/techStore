import { useEffect, useState } from "react";
import {
  getAdminOrdersApi,
  updateAdminOrderApi,
  type AdminOrder,
} from "@/admin/api/admin";
import { ApiError } from "@/lib/api/client";

const FULFILLMENT = [
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;

const PAYMENT = ["pending", "paid", "failed", "refunded"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const patch = async (
    orderId: string,
    body: { paymentStatus?: string; fulfillmentStatus?: string },
  ) => {
    try {
      await updateAdminOrderApi(orderId, body);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    }
  };

  if (loading) return <p className="text-slate-500">Loading orders...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Orders</h2>
        <p className="mt-1 text-slate-500">Update payment and fulfillment status.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-slate-400">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="border-b border-slate-50 align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{order.orderId}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.placedAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{order.user?.name || order.shipping.firstName}</p>
                    <p className="text-xs text-slate-400">
                      {order.user?.email || order.shipping.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.paymentStatus || "pending"}
                      onChange={(e) =>
                        void patch(order.orderId, { paymentStatus: e.target.value })
                      }
                      className="rounded-lg border border-slate-200 px-2 py-1"
                    >
                      {PAYMENT.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status || "processing"}
                      onChange={(e) =>
                        void patch(order.orderId, {
                          fulfillmentStatus: e.target.value,
                        })
                      }
                      className="rounded-lg border border-slate-200 px-2 py-1"
                    >
                      {FULFILLMENT.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
