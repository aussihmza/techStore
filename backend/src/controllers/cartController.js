import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cartService } from "../services/cartService.js";

export const cartController = {
  getCart: asyncHandler(async (req, res) => {
    const data = await cartService.getCart(req.user._id);
    return ApiResponse(res, 200, data, "Cart fetched");
  }),

  addItem: asyncHandler(async (req, res) => {
    const data = await cartService.addItem(req.user._id, req.body);
    return ApiResponse(res, 200, data, "Item added to cart");
  }),

  updateItem: asyncHandler(async (req, res) => {
    const data = await cartService.updateItem(req.user._id, req.params.id, req.body.qty);
    return ApiResponse(res, 200, data, "Cart updated");
  }),

  removeItem: asyncHandler(async (req, res) => {
    const data = await cartService.removeItem(req.user._id, req.params.id);
    return ApiResponse(res, 200, data, "Item removed from cart");
  }),

  clearCart: asyncHandler(async (req, res) => {
    const data = await cartService.clearCart(req.user._id);
    return ApiResponse(res, 200, data, "Cart cleared");
  }),
};
