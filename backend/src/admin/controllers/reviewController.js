import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminReviewService } from "../services/reviewService.js";

export const adminReviewController = {
  list: asyncHandler(async (req, res) => {
    const data = await adminReviewService.list(req.query);
    return ApiResponse(res, 200, data, "Reviews fetched");
  }),

  remove: asyncHandler(async (req, res) => {
    await adminReviewService.remove(req.params.id);
    return ApiResponse(res, 200, null, "Review deleted");
  }),
};
