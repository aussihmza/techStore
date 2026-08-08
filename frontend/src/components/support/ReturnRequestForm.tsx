import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { ApiError } from "@/lib/api/client";
import {
  createReturnRequestApi,
  getMyReturnRequestsApi,
  type ReturnRequest,
  type ReturnType,
} from "@/lib/api/returns";
import SuccessModal from "@/components/ui/SuccessModal";

const REASONS = [
  "Changed mind",
  "Damaged on arrival",
  "Wrong item",
  "Defective / not working",
  "Missing parts",
  "Other",
] as const;

export default function ReturnRequestForm() {
  const { isLoggedIn, openLoginPrompt, orders } = useStore();
  const [orderId, setOrderId] = useState("");
  const [type, setType] = useState<ReturnType>("return");
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdRma, setCreatedRma] = useState("");
  const [myRequests, setMyRequests] = useState<ReturnRequest[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setMyRequests([]);
      return;
    }

    let active = true;
    getMyReturnRequestsApi()
      .then((data) => {
        if (active) setMyRequests(data.requests);
      })
      .catch(() => {
        if (active) setMyRequests([]);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, successOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn) {
      openLoginPrompt();
      setError("Please log in to submit a return or warranty request.");
      return;
    }

    if (!orderId.trim() || !reason || details.trim().length < 10) {
      setError("Order ID, reason, and details (min 10 characters) are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await createReturnRequestApi({
        orderId: orderId.trim(),
        type,
        reason,
        details: details.trim(),
      });
      setCreatedRma(data.request.rmaId);
      setOrderId("");
      setReason("");
      setDetails("");
      setType("return");
      setSuccessOpen(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not submit request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h3 className="text-lg font-semibold text-ink">Start a return / RMA</h3>
      <p className="mt-1 text-sm text-slate-500">
        Submit a request for an order on your account. We’ll review it and follow up by email.
      </p>

      {!isLoggedIn ? (
        <div className="mt-5">
          <p className="text-sm text-slate-500">Log in to choose an order and open an RMA.</p>
          <button type="button" onClick={openLoginPrompt} className="btn-primary mt-4">
            Log in to continue
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink" htmlFor="rma-order">
              Order
            </label>
            {orders.length > 0 ? (
              <select
                id="rma-order"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              >
                <option value="">Select an order</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id} — {order.items[0]?.name || "Order"}
                    {order.items.length > 1 ? ` +${order.items.length - 1}` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  id="rma-order"
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="#TS-12345"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  No orders loaded yet. Enter your order ID, or open{" "}
                  <Link to="/orders" className="font-semibold text-brand hover:underline">
                    My Orders
                  </Link>
                  .
                </p>
              </>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink" htmlFor="rma-type">
                Request type
              </label>
              <select
                id="rma-type"
                value={type}
                onChange={(e) => setType(e.target.value as ReturnType)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              >
                <option value="return">Return (30-day)</option>
                <option value="warranty">Warranty claim</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink" htmlFor="rma-reason">
                Reason
              </label>
              <select
                id="rma-reason"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              >
                <option value="">Select a reason</option>
                {REASONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink" htmlFor="rma-details">
              Details
            </label>
            <textarea
              id="rma-details"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue, item condition, and any serial number if available."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit request"}
          </button>
        </form>
      )}

      {isLoggedIn && myRequests.length > 0 ? (
        <div className="mt-8 border-t border-slate-200 pt-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Your recent requests
          </h4>
          <ul className="mt-3 space-y-2">
            {myRequests.slice(0, 5).map((req) => (
              <li
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-ink">{req.rmaId}</p>
                  <p className="text-slate-500">
                    {req.orderId} · {req.type} · {req.reason}
                  </p>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold capitalize text-amber-800">
                  {req.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <SuccessModal
        open={successOpen}
        title="Request submitted"
        message={
          createdRma
            ? `Your RMA ${createdRma} is pending review. Keep this ID for support follow-up.`
            : "Your return request was submitted."
        }
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}
