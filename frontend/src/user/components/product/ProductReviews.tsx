import { useEffect, useEffectEvent, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { ApiError } from "@/lib/api/client";
import {
  createProductReviewApi,
  deleteMyProductReviewApi,
  getProductReviewsApi,
  updateMyProductReviewApi,
  type ProductReview,
} from "@/user/api/reviews";
import { getProductByIdApi, getProductsApi } from "@/user/api/products";
import { StarIcon } from "@/user/components/ui/icons";

function invalidateProductCaches() {
  getProductsApi.invalidateAll();
  getProductByIdApi.invalidateAll();
}

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewsCount: number;
  onSummaryChange: (summary: { rating: number; reviewsCount: number }) => void;
}

function Stars({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}) {
  const cls = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const score = i + 1;
        const filled = score <= value;
        if (!onChange) {
          return (
            <StarIcon
              key={score}
              className={`${cls} ${filled ? "text-amber-400" : "text-slate-200"}`}
            />
          );
        }
        return (
          <button
            key={score}
            type="button"
            aria-label={`${score} star${score > 1 ? "s" : ""}`}
            onClick={() => onChange(score)}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            <StarIcon
              className={`${cls} ${filled ? "text-amber-400" : "text-slate-200"}`}
            />
          </button>
        );
      })}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProductReviews({
  productId,
  rating,
  reviewsCount,
  onSummaryChange,
}: ProductReviewsProps) {
  const { isLoggedIn, openLoginPrompt } = useStore();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [myReview, setMyReview] = useState<ProductReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const notifySummary = useEffectEvent(
    (summary: { rating: number; reviewsCount: number }) => {
      onSummaryChange(summary);
    },
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getProductReviewsApi(productId);
        if (!active) return;
        setReviews(data.reviews);
        setMyReview(data.myReview);
        notifySummary({
          rating: data.rating,
          reviewsCount: data.reviewsCount,
        });
        if (data.myReview) {
          setFormRating(data.myReview.rating);
          setComment(data.myReview.comment);
          setEditing(false);
        } else {
          setFormRating(0);
          setComment("");
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
    // notifySummary is an Effect Event — do not put it in deps (causes reload loop)
  }, [productId, isLoggedIn]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLoginPrompt();
      return;
    }
    if (formRating < 1 || formRating > 5) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const payload = { rating: formRating, comment: comment.trim() };
      const data = myReview
        ? await updateMyProductReviewApi(productId, payload)
        : await createProductReviewApi(productId, payload);

      setMyReview(data.review);
      setReviews((prev) => {
        const others = prev.filter((item) => item.id !== data.review.id);
        return [data.review, ...others];
      });
      onSummaryChange({
        rating: data.rating,
        reviewsCount: data.reviewsCount,
      });
      invalidateProductCaches();
      setEditing(false);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not save review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await deleteMyProductReviewApi(productId);
      setReviews((prev) => prev.filter((item) => item.id !== myReview.id));
      setMyReview(null);
      setComment("");
      setFormRating(0);
      onSummaryChange({
        rating: data.rating,
        reviewsCount: data.reviewsCount,
      });
      invalidateProductCaches();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not delete review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-14 border-t border-slate-100 pt-12 pb-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-heading text-2xl sm:text-3xl">Customer reviews</h2>
          <p className="section-sub mt-2 text-base">
            Real ratings from TechStore shoppers — not placeholder scores.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-center">
          <p className="font-display text-3xl font-extrabold text-ink">
            {reviewsCount > 0 ? rating.toFixed(1) : "—"}
          </p>
          <Stars value={Math.round(rating)} size="sm" />
          <p className="mt-1 text-xs text-slate-500">
            {reviewsCount === 0
              ? "No reviews yet"
              : `${reviewsCount} review${reviewsCount === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-ink">
              {myReview && !editing ? "Your review" : "Write a review"}
            </h3>

            {!isLoggedIn ? (
              <div className="mt-4">
                <p className="text-sm text-slate-500">
                  Log in to rate this product and share your experience.
                </p>
                <button
                  type="button"
                  onClick={openLoginPrompt}
                  className="btn-primary mt-4"
                >
                  Log in to review
                </button>
              </div>
            ) : myReview && !editing ? (
              <div className="mt-4">
                <Stars value={myReview.rating} size="sm" />
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {myReview.comment}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormRating(myReview.rating);
                      setComment(myReview.comment);
                      setEditing(true);
                    }}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => void handleDelete()}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-ink">Your rating</p>
                  <Stars value={formRating} onChange={setFormRating} />
                  {formRating < 1 ? (
                    <p className="mt-1.5 text-xs text-slate-400">Tap a star to rate</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-500">
                      {formRating} / 5 selected
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="review-comment" className="mb-2 block text-sm font-semibold text-ink">
                    Your review
                  </label>
                  <textarea
                    id="review-comment"
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike? (min 10 characters)"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
                  />
                </div>
                {error ? (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
                    {error}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={submitting || formRating < 1}
                    className="btn-primary disabled:opacity-60"
                  >
                    {submitting
                      ? "Saving..."
                      : myReview
                        ? "Update review"
                        : "Submit review"}
                  </button>
                  {myReview && editing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormRating(myReview.rating);
                        setComment(myReview.comment);
                        setError("");
                      }}
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <p className="py-10 text-center text-slate-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 py-12 text-center">
              <p className="font-semibold text-ink">No customer reviews yet</p>
              <p className="mt-2 text-sm text-slate-500">
                Be the first to rate this product.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{review.userName}</p>
                      <p className="text-xs text-slate-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <Stars value={review.rating} size="sm" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {!loading && error && reviews.length > 0 ? (
            <p className="mt-4 text-sm text-rose-600">{error}</p>
          ) : null}

          <p className="mt-6 text-xs text-slate-400">
            Need help with an order instead?{" "}
            <Link to="/contact" className="font-semibold text-brand hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
