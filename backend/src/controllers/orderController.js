import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { orderService } from "../services/orderService.js";

export const orderController = {
  getAll: asyncHandler(async (req, res) => {
    const data = await orderService.getAll(req.user._id);
    return ApiResponse(res, 200, data, "Orders fetched");
  }),

  getById: asyncHandler(async (req, res) => {
    const data = await orderService.getById(req.user._id, req.params.id);
    return ApiResponse(res, 200, data, "Order fetched");
  }),

  create: asyncHandler(async (req, res) => {
    const data = await orderService.create(req.user._id, req.body);
    return ApiResponse(res, 201, data, "Order placed");
  }),
};
