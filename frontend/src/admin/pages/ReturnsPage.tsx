import { useEffect, useState } from "react";
import {
  getAdminReturnsApi,
  updateAdminReturnApi,
  type AdminReturn,
} from "@/admin/api/admin";
import AdminSuccessModal from "@/admin/components/AdminSuccessModal";
import { ApiError } from "@/lib/api/client";

const STATUSES = ["pending", "approved", "rejected", "completed"] as const;

export default function AdminReturnsPage() {
  const [requests, setRequests] = useState<AdminReturn[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(
    null,
  );

  const load = async () => {
    const data = await getAdminReturnsApi();
    setRequests(data.requests);
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

  const patch = async (id: string, status: string, rmaId: string) => {
    try {
      await updateAdminReturnApi(id, status);
      await load();
      setSuccess({
        title: "Successfully updated",
        message: `${rmaId} is now marked as ${status}.`,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed.");
    }
  };

  if (loading) return <p className="text-slate-500">Loading returns...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Returns / RMA</h2>
        <p className="mt-1 text-slate-500">Approve, reject, or complete requests.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-slate-400">No return requests yet.</p>
        ) : (
          requests.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {item.rmaId} · {item.type}
                  </p>
                  <p className="text-xs text-slate-400">
                    Order {item.orderId} · {item.user?.email || "customer"}
                  </p>
                </div>
                <select
                  value={item.status}
                  onChange={(e) => void patch(item.id, e.target.value, item.rmaId)}
                  className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-600">{item.reason}</p>
              <p className="mt-1 text-sm text-slate-500">{item.details}</p>
            </article>
          ))
        )}
      </div>

      <AdminSuccessModal
        open={Boolean(success)}
        title={success?.title || ""}
        message={success?.message}
        onClose={() => setSuccess(null)}
      />
    </div>
  );
}
