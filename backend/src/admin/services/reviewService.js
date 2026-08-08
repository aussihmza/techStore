import { Review } from "../../models/Review.js";
import { ApiError } from "../../utils/ApiError.js";
import { syncProductRating } from "../../services/reviewService.js";

function toAdminReview(doc) {
  const review = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    id: String(review._id),
    productSlug: review.productSlug,
    userId: String(review.user),
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

export const adminReviewService = {
  async list({ limit = 50 } = {}) {
    const safeLimit = Math.min(200, Math.max(1, Number(limit) || 50));
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(safeLimit);

    return {
      reviews: reviews.map(toAdminReview),
      count: reviews.length,
    };
  },

  async remove(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    const slug = review.productSlug;
    await review.deleteOne();
    await syncProductRating(slug);
    return null;
  },
};
