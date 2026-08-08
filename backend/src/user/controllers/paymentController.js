import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { paymentService } from "../services/paymentService.js";

export const paymentController = {
  createCheckoutSession: asyncHandler(async (req, res) => {
    try {
      const data = await paymentService.createCheckoutSession(
        req.user._id,
        req.body.shipping,
        req.body.promoCode
      );
      return ApiResponse(res, 200, data, "Checkout session created");
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, error.message || "Could not create checkout session");
    }
  }),

  completeCheckoutSession: asyncHandler(async (req, res) => {
    try {
      const data = await paymentService.completeCheckoutSession(
        req.user._id,
        req.body.sessionId
      );
      return ApiResponse(res, 200, data, "Payment completed");
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, error.message || "Could not complete checkout");
    }
  }),
};
