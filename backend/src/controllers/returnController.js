import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { returnService } from "../services/returnService.js";

export const returnController = {
  listMine: asyncHandler(async (req, res) => {
    const data = await returnService.listMine(req.user._id);
    return ApiResponse(res, 200, data, "Return requests fetched");
  }),

  create: asyncHandler(async (req, res) => {
    const data = await returnService.create(req.user._id, req.body);
    return ApiResponse(res, 201, data, "Return request submitted");
  }),
};
