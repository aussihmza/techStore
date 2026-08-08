import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { adminReturnService } from "../services/returnService.js";

export const adminReturnController = {
  list: asyncHandler(async (req, res) => {
    const data = await adminReturnService.list(req.query);
    return ApiResponse(res, 200, data, "Return requests fetched");
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const data = await adminReturnService.updateStatus(req.params.id, req.body);
    return ApiResponse(res, 200, data, "Return request updated");
  }),
};
