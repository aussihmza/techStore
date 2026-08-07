import { User } from "../models/User.js";
import { Cart } from "../models/Cart.js";
import { Wishlist } from "../models/Wishlist.js";
import { ApiError } from "../utils/ApiError.js";
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

export const authService = {
  async register({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email || "");
    const trimmedName = (name || "").trim();
    const rawPassword = password || "";

    if (!normalizedEmail || !rawPassword) {
      throw new ApiError(400, "Email and password are required.");
    }

    if (rawPassword.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters.");
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const user = await User.create({
      name: trimmedName || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: await hashPassword(rawPassword),
    });

    await createUserDefaults(user._id);
    return authPayload(user);
  },

  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email || "");
    const rawPassword = password || "";

    if (!normalizedEmail || !rawPassword) {
      throw new ApiError(400, "Email and password are required.");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new ApiError(404, "No account found with this email. Please sign up.");
    }

    const isMatch = await comparePassword(rawPassword, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Incorrect password. Please try again.");
    }

    return authPayload(user);
  },

  getMe(user) {
    return { user: toPublicUser(user) };
  },
};
