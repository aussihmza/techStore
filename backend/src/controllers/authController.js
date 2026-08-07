import { User } from "../models/User.js";
import { Cart } from "../models/Cart.js";
import { Wishlist } from "../models/Wishlist.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  comparePassword,
  hashPassword,
  normalizeEmail,
  signToken,
  toPublicUser,
} from "../utils/auth.js";

async function createUserDefaults(userId) {
  await Promise.all([
    Cart.findOneAndUpdate(
      { user: userId },
      { user: userId, items: [] },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    Wishlist.findOneAndUpdate(
      { user: userId },
      { user: userId, products: [] },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
  ]);
}

function authPayload(user) {
  const publicUser = toPublicUser(user);
  const token = signToken({
    sub: publicUser.id,
    email: publicUser.email,
  });

  return { user: publicUser, token };
}

export const authController = {
  register: asyncHandler(async (req, res) => {
    const name = (req.body.name || "").trim();
    const email = normalizeEmail(req.body.email || "");
    const password = req.body.password || "";

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters.");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const user = await User.create({
      name: name || email.split("@")[0],
      email,
      password: await hashPassword(password),
    });

    await createUserDefaults(user._id);

    return ApiResponse(res, 201, authPayload(user), "Account created successfully");
  }),

  login: asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email || "");
    const password = req.body.password || "";

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "No account found with this email. Please sign up.");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Incorrect password. Please try again.");
    }

    return ApiResponse(res, 200, authPayload(user), "Logged in successfully");
  }),

  logout: asyncHandler(async (_req, res) => {
    // JWT is stateless — client should discard the token
    return ApiResponse(res, 200, null, "Logged out successfully");
  }),

  me: asyncHandler(async (req, res) => {
    return ApiResponse(res, 200, { user: toPublicUser(req.user) }, "OK");
  }),
};
