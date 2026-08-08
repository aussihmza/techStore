import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminOrderService } from "../services/orderService.js";

export const adminOrderController = {
  list: asyncHandler(async (req, res) => {
    const data = await adminOrderService.list(req.query);
    return ApiResponse(res, 200, data, "Orders fetched");
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const data = await adminOrderService.updateStatus(req.params.orderId, req.body);
    return ApiResponse(res, 200, data, "Order updated");
  }),

  remove: asyncHandler(async (req, res) => {
    await adminOrderService.remove(req.params.orderId);
    return ApiResponse(res, 200, null, "Order deleted");
  }),
};
