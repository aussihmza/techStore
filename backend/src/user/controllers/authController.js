import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authService } from "../services/authService.js";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const data = await authService.register(req.body);
    return ApiResponse(res, 201, data, "Account created successfully");
  }),

  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body);
    return ApiResponse(res, 200, data, "Logged in successfully");
  }),

  googleLogin: asyncHandler(async (req, res) => {
    const data = await authService.googleLogin(req.body);
    return ApiResponse(res, 200, data, "Logged in with Google successfully");
  }),

  logout: asyncHandler(async (_req, res) => {
    return ApiResponse(res, 200, null, "Logged out successfully");
  }),

  me: asyncHandler(async (req, res) => {
    const data = await authService.getMe(req.user);
    return ApiResponse(res, 200, data, "OK");
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const data = await authService.forgotPassword(req.body);
    return ApiResponse(res, 200, data, data.message);
  }),

  verifyResetOtp: asyncHandler(async (req, res) => {
    const data = await authService.verifyResetOtp(req.body);
    return ApiResponse(res, 200, data, data.message);
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const data = await authService.resetPassword(req.body);
    return ApiResponse(res, 200, data, data.message);
  }),
};
