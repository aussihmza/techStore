import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userService } from "../services/userService.js";

export const userController = {
  getProfile: asyncHandler(async (req, res) => {
    const data = userService.getProfile(req.user);
    return ApiResponse(res, 200, data, "OK");
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const data = await userService.updateProfile(req.user._id, req.body);
    return ApiResponse(res, 200, data, "Profile updated");
  }),
};
