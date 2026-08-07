import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toCategoryResponse } from "../utils/productMapper.js";

export const categoryController = {
  getAll: asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ label: 1 });

    const withCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: { $in: category.productCategories },
        });

        return {
          ...toCategoryResponse(category),
          productCount,
        };
      })
    );

    return ApiResponse(
      res,
      200,
      {
        categories: withCounts,
        count: withCounts.length,
      },
      "Categories fetched"
    );
  }),

  getBySlug: asyncHandler(async (req, res) => {
    const category = await Category.findOne({
      slug: String(req.params.slug).toLowerCase(),
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const productCount = await Product.countDocuments({
      category: { $in: category.productCategories },
    });

    return ApiResponse(
      res,
      200,
      {
        category: {
          ...toCategoryResponse(category),
          productCount,
        },
      },
      "Category fetched"
    );
  }),

  create: asyncHandler(async (req, res) => {
    const payload = req.body || {};

    if (!payload.slug || !payload.label || !payload.filterKey) {
      throw new ApiError(400, "slug, label, and filterKey are required");
    }

    const existing = await Category.findOne({ slug: payload.slug });
    if (existing) {
      throw new ApiError(409, "Category with this slug already exists");
    }

    const category = await Category.create(payload);
    return ApiResponse(res, 201, { category: toCategoryResponse(category) }, "Category created");
  }),
};
