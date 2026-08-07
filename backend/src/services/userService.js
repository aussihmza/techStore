import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { toPublicUser } from "../utils/auth.js";

export const userService = {
  getProfile(user) {
    return { user: toPublicUser(user) };
  },

  async updateProfile(userId, { name }) {
    const trimmedName = (name || "").trim();

    if (!trimmedName) {
      throw new ApiError(400, "Name is required.");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: trimmedName },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return { user: toPublicUser(user) };
  },
};
