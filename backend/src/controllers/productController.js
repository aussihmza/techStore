import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  buildProductQuery,
  getProductSort,
  toProductResponse,
} from "../utils/productMapper.js";

async function findProductByParam(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await Product.findById(idOrSlug);
    if (byId) return byId;
  }

  return Product.findOne({ slug: idOrSlug });
}

export const productController = {
  getAll: asyncHandler(async (req, res) => {
    const filter = buildProductQuery(req.query);

    // Optional: lock to a shop category slug (e.g. /products?categorySlug=laptops)
    if (req.query.categorySlug) {
      const category = await Category.findOne({ slug: String(req.query.categorySlug).toLowerCase() });
      if (!category) {
        throw new ApiError(404, "Category not found");
      }
      filter.category = { $in: category.productCategories };
    }

    const sort = getProductSort(req.query.sort);
    const products = await Product.find(filter).sort(sort);

    return ApiResponse(
      res,
      200,
      {
        products: products.map(toProductResponse),
        count: products.length,
      },
      "Products fetched"
    );
  }),

  getById: asyncHandler(async (req, res) => {
    const product = await findProductByParam(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return ApiResponse(res, 200, { product: toProductResponse(product) }, "Product fetched");
  }),

  create: asyncHandler(async (req, res) => {
    const payload = req.body || {};

    if (!payload.slug || !payload.name || !payload.category || !payload.brand || payload.price == null || !payload.image) {
      throw new ApiError(400, "slug, name, category, brand, price, and image are required");
    }

    const existing = await Product.findOne({ slug: payload.slug });
    if (existing) {
      throw new ApiError(409, "Product with this slug already exists");
    }

    const product = await Product.create(payload);
    return ApiResponse(res, 201, { product: toProductResponse(product) }, "Product created");
  }),

  update: asyncHandler(async (req, res) => {
    const product = await findProductByParam(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const updates = { ...req.body };
    delete updates._id;

    Object.assign(product, updates);
    await product.save();

    return ApiResponse(res, 200, { product: toProductResponse(product) }, "Product updated");
  }),

  remove: asyncHandler(async (req, res) => {
    const product = await findProductByParam(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    await product.deleteOne();
    return ApiResponse(res, 200, null, "Product deleted");
  }),
};
