import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminDashboardService } from "../services/dashboardService.js";

export const adminDashboardController = {
  getStats: asyncHandler(async (_req, res) => {
    const data = await adminDashboardService.getStats();
    return ApiResponse(res, 200, data, "Admin dashboard stats");
  }),
};
