import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { wishlistService } from "../services/wishlistService.js";

export const wishlistController = {
  getWishlist: asyncHandler(async (req, res) => {
    const data = await wishlistService.getWishlist(req.user._id);
    return ApiResponse(res, 200, data, "Wishlist fetched");
  }),

  addItem: asyncHandler(async (req, res) => {
    const data = await wishlistService.addItem(req.user._id, req.body);
    return ApiResponse(res, 200, data, "Item added to wishlist");
  }),

  removeItem: asyncHandler(async (req, res) => {
    const data = await wishlistService.removeItem(req.user._id, req.params.id);
    return ApiResponse(res, 200, data, "Item removed from wishlist");
  }),

  toggleItem: asyncHandler(async (req, res) => {
    const result = await wishlistService.toggleItem(req.user._id, req.body);
    return ApiResponse(res, 200, result.data, result.message);
  }),
};
