import { apiRequest } from "@/lib/api/client";

export interface ProductReview {
  id: string;
  productSlug: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewsData {
  productSlug: string;
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  myReview: ProductReview | null;
  count: number;
}

export function getProductReviewsApi(productId: string) {
  return apiRequest<ReviewsData>(
    `/products/${encodeURIComponent(productId)}/reviews`,
  );
}

export function createProductReviewApi(
  productId: string,
  input: { rating: number; comment: string },
) {
  return apiRequest<{
    review: ProductReview;
    rating: number;
    reviewsCount: number;
  }>(`/products/${encodeURIComponent(productId)}/reviews`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMyProductReviewApi(
  productId: string,
  input: { rating: number; comment: string },
) {
  return apiRequest<{
    review: ProductReview;
    rating: number;
    reviewsCount: number;
  }>(`/products/${encodeURIComponent(productId)}/reviews/me`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteMyProductReviewApi(productId: string) {
  return apiRequest<{
    deleted: boolean;
    rating: number;
    reviewsCount: number;
  }>(`/products/${encodeURIComponent(productId)}/reviews/me`, {
    method: "DELETE",
  });
}
