import { Review } from "../models/Review.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { findProductBySlugOrId } from "../utils/storeHelpers.js";

function toReviewResponse(doc) {
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

export async function syncProductRating(productSlug) {
  const [stats] = await Review.aggregate([
    { $match: { productSlug } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const count = stats?.count || 0;
  const rating = count ? Math.round(Number(stats.avg) * 10) / 10 : 0;

  await Product.updateOne({ slug: productSlug }, { rating, reviews: count });
  return { rating, reviews: count };
}

async function resolveProduct(productKey) {
  const product = await findProductBySlugOrId(productKey);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
}

export const reviewService = {
  async listByProduct(productKey, userId = null) {
    const product = await resolveProduct(productKey);
    const summary = await syncProductRating(product.slug);

    const reviews = await Review.find({ productSlug: product.slug })
      .sort({ createdAt: -1 })
      .limit(100);

    const mapped = reviews.map(toReviewResponse);
    const myReview = userId
      ? mapped.find((item) => item.userId === String(userId)) || null
      : null;

    return {
      productSlug: product.slug,
      rating: summary.rating,
      reviewsCount: summary.reviews,
      reviews: mapped,
      myReview,
      count: mapped.length,
    };
  },

  async create(productKey, user, { rating, comment } = {}) {
    const product = await resolveProduct(productKey);
    const score = Number(rating);
    const text = String(comment || "").trim();

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new ApiError(400, "Rating must be a whole number from 1 to 5.");
    }
    if (text.length < 10) {
      throw new ApiError(400, "Review must be at least 10 characters.");
    }

    const existing = await Review.findOne({
      productSlug: product.slug,
      user: user._id,
    });
    if (existing) {
      throw new ApiError(409, "You already reviewed this product. You can update it instead.");
    }

    const review = await Review.create({
      productSlug: product.slug,
      user: user._id,
      userName: user.name || user.email?.split("@")[0] || "Customer",
      rating: score,
      comment: text,
    });

    const summary = await syncProductRating(product.slug);

    return {
      review: toReviewResponse(review),
      rating: summary.rating,
      reviewsCount: summary.reviews,
    };
  },

  async updateMine(productKey, user, { rating, comment } = {}) {
    const product = await resolveProduct(productKey);
    const review = await Review.findOne({
      productSlug: product.slug,
      user: user._id,
    });

    if (!review) {
      throw new ApiError(404, "You have not reviewed this product yet.");
    }

    if (rating !== undefined) {
      const score = Number(rating);
      if (!Number.isInteger(score) || score < 1 || score > 5) {
        throw new ApiError(400, "Rating must be a whole number from 1 to 5.");
      }
      review.rating = score;
    }

    if (comment !== undefined) {
      const text = String(comment || "").trim();
      if (text.length < 10) {
        throw new ApiError(400, "Review must be at least 10 characters.");
      }
      review.comment = text;
    }

    await review.save();
    const summary = await syncProductRating(product.slug);

    return {
      review: toReviewResponse(review),
      rating: summary.rating,
      reviewsCount: summary.reviews,
    };
  },

  async deleteMine(productKey, user) {
    const product = await resolveProduct(productKey);
    const deleted = await Review.findOneAndDelete({
      productSlug: product.slug,
      user: user._id,
    });

    if (!deleted) {
      throw new ApiError(404, "You have not reviewed this product yet.");
    }

    const summary = await syncProductRating(product.slug);
    return {
      deleted: true,
      rating: summary.rating,
      reviewsCount: summary.reviews,
    };
  },
};
