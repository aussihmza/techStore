import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { newsletterService } from "../services/newsletterService.js";

export const newsletterController = {
  subscribe: asyncHandler(async (req, res) => {
    const data = await newsletterService.subscribe(req.body);
    const message = data.alreadySubscribed
      ? "You are already subscribed."
      : "Subscribed successfully";
    return ApiResponse(res, 201, data, message);
  }),
};
