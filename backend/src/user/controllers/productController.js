import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { productService } from "../services/productService.js";

export const productController = {
  getAll: asyncHandler(async (req, res) => {
    const data = await productService.getAll(req.query);
    return ApiResponse(res, 200, data, "Products fetched");
  }),

  getById: asyncHandler(async (req, res) => {
    const data = await productService.getById(req.params.id);
    return ApiResponse(res, 200, data, "Product fetched");
  }),

  create: asyncHandler(async (req, res) => {
    const data = await productService.create(req.body);
    return ApiResponse(res, 201, data, "Product created");
  }),

  update: asyncHandler(async (req, res) => {
    const data = await productService.update(req.params.id, req.body);
    return ApiResponse(res, 200, data, "Product updated");
  }),

  remove: asyncHandler(async (req, res) => {
    await productService.remove(req.params.id);
    return ApiResponse(res, 200, null, "Product deleted");
  }),
};
