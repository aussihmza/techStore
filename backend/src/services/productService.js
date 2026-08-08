import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { ApiError } from "../utils/ApiError.js";
import {
  buildProductQuery,
  getProductSort,
  toProductResponse,
} from "../utils/productMapper.js";
import { syncProductRating } from "./reviewService.js";

async function findProductByParam(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await Product.findById(idOrSlug);
    if (byId) return byId;
  }

  return Product.findOne({ slug: idOrSlug });
}

export const productService = {
  async getAll(query = {}) {
    const filter = buildProductQuery(query);

    if (query.categorySlug) {
      const category = await Category.findOne({
        slug: String(query.categorySlug).toLowerCase(),
      });

      if (!category) {
        throw new ApiError(404, "Category not found");
      }

      filter.category = { $in: category.productCategories };
    }

    const sort = getProductSort(query.sort);
    const products = await Product.find(filter).sort(sort);

    return {
      products: products.map(toProductResponse),
      count: products.length,
    };
  },

  async getById(idOrSlug) {
    const product = await findProductByParam(idOrSlug);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const summary = await syncProductRating(product.slug);
    const payload = toProductResponse(product);
    payload.rating = summary.rating;
    payload.reviews = summary.reviews;

    return { product: payload };
  },

  async create(payload = {}) {
    if (
      !payload.slug ||
      !payload.name ||
      !payload.category ||
      !payload.brand ||
      payload.price == null ||
      !payload.image
    ) {
      throw new ApiError(
        400,
        "slug, name, category, brand, price, and image are required"
      );
    }

    const existing = await Product.findOne({ slug: payload.slug });
    if (existing) {
      throw new ApiError(409, "Product with this slug already exists");
    }

    const product = await Product.create(payload);
    return { product: toProductResponse(product) };
  },

  async update(idOrSlug, body = {}) {
    const product = await findProductByParam(idOrSlug);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const updates = { ...body };
    delete updates._id;

    Object.assign(product, updates);
    await product.save();

    return { product: toProductResponse(product) };
  },

  async remove(idOrSlug) {
    const product = await findProductByParam(idOrSlug);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    await product.deleteOne();
    return null;
  },
};
