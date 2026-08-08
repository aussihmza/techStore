import { User } from "../models/User.js";
import { Cart } from "../models/Cart.js";
import { Wishlist } from "../models/Wishlist.js";
import { ApiError } from "../utils/ApiError.js";
import {
  comparePassword,
  hashPassword,
  isStrongPassword,
  normalizeEmail,
  PASSWORD_REQUIREMENTS_MESSAGE,
  signToken,
  toPublicUser,
} from "../utils/auth.js";
import {
  createOtp,
  createResetToken,
  hashResetToken,
  sendPasswordResetOtpEmail,
} from "../utils/mail.js";

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

    if (!isStrongPassword(rawPassword)) {
      throw new ApiError(400, PASSWORD_REQUIREMENTS_MESSAGE);
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

  async forgotPassword({ email }) {
    const normalizedEmail = normalizeEmail(email || "");
    if (!normalizedEmail) {
      throw new ApiError(400, "Email is required.");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new ApiError(404, "No account found with this email. Please sign up.");
    }

    const { otp, hashedOtp } = createOtp();
    user.resetPasswordOtp = hashedOtp;
    user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await sendPasswordResetOtpEmail({
      to: user.email,
      name: user.name,
      otp,
    });

    return {
      message: "OTP sent to your email.",
      emailSent: true,
    };
  },

  async verifyResetOtp({ email, otp }) {
    const normalizedEmail = normalizeEmail(email || "");
    const rawOtp = String(otp || "").trim();

    if (!normalizedEmail || !rawOtp) {
      throw new ApiError(400, "Email and OTP are required.");
    }

    if (!/^\d{6}$/.test(rawOtp)) {
      throw new ApiError(400, "OTP must be a 6-digit code.");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      throw new ApiError(400, "Invalid or expired OTP. Request a new one.");
    }

    if (user.resetPasswordOtpExpires.getTime() < Date.now()) {
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpires = null;
      await user.save();
      throw new ApiError(400, "OTP has expired. Request a new one.");
    }

    if (user.resetPasswordOtp !== hashResetToken(rawOtp)) {
      throw new ApiError(400, "Incorrect OTP. Please try again.");
    }

    const { token, hashedToken } = createResetToken();
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    return {
      message: "OTP verified successfully.",
      resetToken: token,
    };
  },

  async resetPassword({ token, password }) {
    const rawToken = (token || "").trim();
    const rawPassword = password || "";

    if (!rawToken) {
      throw new ApiError(400, "Reset token is required.");
    }

    if (!isStrongPassword(rawPassword)) {
      throw new ApiError(400, PASSWORD_REQUIREMENTS_MESSAGE);
    }

    const hashedToken = hashResetToken(rawToken);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(400, "Reset session is invalid or has expired.");
    }

    user.password = await hashPassword(rawPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpires = null;
    await user.save();

    return { message: "Password updated successfully. You can log in now." };
  },
};
