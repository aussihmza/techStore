import { useState } from "react";
import type { AdminOrder } from "@/admin/api/admin";
import AdminSuccessModal from "@/admin/components/AdminSuccessModal";
import ConfirmModal from "@/admin/components/ConfirmModal";
import { TrashIcon } from "@/user/components/ui/icons";

const FULFILLMENT = [
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;

const PAYMENT = ["pending", "paid", "failed", "refunded"] as const;

type Props = {
  orders: AdminOrder[];
  emptyMessage?: string;
  fulfillmentOptions?: readonly string[];
  onPatch: (
    orderId: string,
    body: { paymentStatus?: string; fulfillmentStatus?: string },
  ) => void | Promise<void>;
  onDelete: (orderId: string) => void | Promise<void>;
};

export default function OrdersTable({
  orders,
  emptyMessage = "No orders found.",
  fulfillmentOptions = FULFILLMENT,
  onPatch,
  onDelete,
}: Props) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(
    null,
  );

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await onDelete(pendingDeleteId);
      setPendingDeleteId(null);
      setSuccess({
        title: "Successfully deleted",
        message: `${pendingDeleteId} has been removed for admin and the customer.`,
      });
    } catch {
      // parent shows error banner
    } finally {
      setDeleting(false);
    }
  };

  const handlePatch = async (
    orderId: string,
    body: { paymentStatus?: string; fulfillmentStatus?: string },
  ) => {
    try {
      await onPatch(orderId, body);
      setSuccess({
        title: "Successfully updated",
        message: `${orderId} status has been saved.`,
      });
    } catch {
      // parent shows error banner
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Fulfillment</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId} className="border-b border-slate-50 align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{order.orderId}</p>
                    <p className="text-xs text-slate-400">
                      {order.placedAt
                        ? new Date(order.placedAt).toLocaleString()
                        : "—"}
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
                        void handlePatch(order.orderId, {
                          paymentStatus: e.target.value,
                        })
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
                        void handlePatch(order.orderId, {
                          fulfillmentStatus: e.target.value,
                        })
                      }
                      className="rounded-lg border border-slate-200 px-2 py-1"
                    >
                      {fulfillmentOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-label={`Delete order ${order.orderId}`}
                      title="Delete order"
                      onClick={() => setPendingDeleteId(order.orderId)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Delete this order?"
        message={`${pendingDeleteId || "This order"} will be permanently removed for admin and the customer. This cannot be undone.`}
        confirmLabel="Delete order"
        busy={deleting}
        onCancel={() => {
          if (!deleting) setPendingDeleteId(null);
        }}
        onConfirm={() => void handleConfirmDelete()}
      />

      <AdminSuccessModal
        open={Boolean(success)}
        title={success?.title || ""}
        message={success?.message}
        onClose={() => setSuccess(null)}
      />
    </>
  );
}

export { FULFILLMENT, PAYMENT };
