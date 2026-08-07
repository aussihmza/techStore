import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";
import { toCategoryResponse } from "../utils/productMapper.js";

async function withProductCount(category) {
  const productCount = await Product.countDocuments({
    category: { $in: category.productCategories },
  });

  return {
    ...toCategoryResponse(category),
    productCount,
  };
}

export const categoryService = {
  async getAll() {
    const categories = await Category.find().sort({ label: 1 });
    const withCounts = await Promise.all(categories.map(withProductCount));

    return {
      categories: withCounts,
      count: withCounts.length,
    };
  },

  async getBySlug(slug) {
    const category = await Category.findOne({
      slug: String(slug).toLowerCase(),
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return {
      category: await withProductCount(category),
    };
  },

  async create(payload = {}) {
    if (!payload.slug || !payload.label || !payload.filterKey) {
      throw new ApiError(400, "slug, label, and filterKey are required");
    }

    const existing = await Category.findOne({ slug: payload.slug });
    if (existing) {
      throw new ApiError(409, "Category with this slug already exists");
    }

    const category = await Category.create(payload);
    return { category: toCategoryResponse(category) };
  },
};
