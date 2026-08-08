import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { promoService } from "../services/promoService.js";

export const promoController = {
  validate: asyncHandler(async (req, res) => {
    const data = promoService.validate(req.body);
    return ApiResponse(res, 200, data, "Promo code applied");
  }),
};
