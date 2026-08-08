import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { reviewService } from "../services/reviewService.js";

export const reviewController = {
  list: asyncHandler(async (req, res) => {
    const data = await reviewService.listByProduct(
      req.params.id,
      req.user?._id || null,
    );
    return ApiResponse(res, 200, data, "Reviews fetched");
  }),

  create: asyncHandler(async (req, res) => {
    const data = await reviewService.create(req.params.id, req.user, req.body);
    return ApiResponse(res, 201, data, "Review submitted");
  }),

  updateMine: asyncHandler(async (req, res) => {
    const data = await reviewService.updateMine(
      req.params.id,
      req.user,
      req.body,
    );
    return ApiResponse(res, 200, data, "Review updated");
  }),

  deleteMine: asyncHandler(async (req, res) => {
    const data = await reviewService.deleteMine(req.params.id, req.user);
    return ApiResponse(res, 200, data, "Review deleted");
  }),
};
