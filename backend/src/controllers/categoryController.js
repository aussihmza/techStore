import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { categoryService } from "../services/categoryService.js";

export const categoryController = {
  getAll: asyncHandler(async (_req, res) => {
    const data = await categoryService.getAll();
    return ApiResponse(res, 200, data, "Categories fetched");
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const data = await categoryService.getBySlug(req.params.slug);
    return ApiResponse(res, 200, data, "Category fetched");
  }),

  create: asyncHandler(async (req, res) => {
    const data = await categoryService.create(req.body);
    return ApiResponse(res, 201, data, "Category created");
  }),
};
