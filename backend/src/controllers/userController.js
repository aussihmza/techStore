import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toPublicUser } from "../utils/auth.js";

export const userController = {
  getProfile: asyncHandler(async (req, res) => {
    return ApiResponse(res, 200, { user: toPublicUser(req.user) }, "OK");
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const name = (req.body.name || "").trim();

    if (!name) {
      throw new ApiError(400, "Name is required.");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return ApiResponse(res, 200, { user: toPublicUser(user) }, "Profile updated");
  }),
};
