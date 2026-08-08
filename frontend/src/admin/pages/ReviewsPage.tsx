import { useEffect, useState } from "react";
import {
  deleteAdminReviewApi,
  getAdminReviewsApi,
  type AdminReview,
} from "@/admin/api/admin";
import AdminSuccessModal from "@/admin/components/AdminSuccessModal";
import ConfirmModal from "@/admin/components/ConfirmModal";
import { ApiError } from "@/lib/api/client";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(
    null,
  );

  const load = async () => {
    const data = await getAdminReviewsApi();
    setReviews(data.reviews);
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

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await deleteAdminReviewApi(pendingDeleteId);
      await load();
      setPendingDeleteId(null);
      setSuccess({
        title: "Successfully deleted",
        message: "The review has been removed.",
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading reviews...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Reviews</h2>
        <p className="mt-1 text-slate-500">Moderate customer reviews.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-slate-400">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {review.userName} · {review.rating}/5
                  </p>
                  <p className="text-xs text-slate-400">
                    {review.productSlug} ·{" "}
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-rose-600"
                  onClick={() => setPendingDeleteId(review.id)}
                >
                  Delete
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
            </article>
          ))
        )}
      </div>

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Delete this review?"
        message="This review will be permanently removed and product rating will update."
        confirmLabel="Delete review"
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
    </div>
  );
}
