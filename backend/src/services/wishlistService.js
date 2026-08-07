import { ApiError } from "../utils/ApiError.js";
import {
  findProductBySlugOrId,
  getOrCreateWishlist,
  productToWishlistItem,
  toWishlistItemResponse,
} from "../utils/storeHelpers.js";

function wishlistPayload(wishlist) {
  const products = wishlist.products.map(toWishlistItemResponse);
  return {
    products,
    count: products.length,
  };
}

function resolveProductKey({ productSlug, productId, id } = {}) {
  return productSlug || productId || id;
}

export const wishlistService = {
  async getWishlist(userId) {
    const wishlist = await getOrCreateWishlist(userId);
    return wishlistPayload(wishlist);
  },

  async addItem(userId, body = {}) {
    const productKey = resolveProductKey(body);

    if (!productKey) {
      throw new ApiError(400, "productSlug is required");
    }

    const product = await findProductBySlugOrId(productKey);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const wishlist = await getOrCreateWishlist(userId);
    const exists = wishlist.products.some((item) => item.productSlug === product.slug);

    if (!exists) {
      wishlist.products.push(productToWishlistItem(product));
      await wishlist.save();
    }

    return wishlistPayload(wishlist);
  },

  async removeItem(userId, productSlug) {
    const wishlist = await getOrCreateWishlist(userId);
    const before = wishlist.products.length;

    wishlist.products = wishlist.products.filter(
      (item) => item.productSlug !== productSlug
    );

    if (wishlist.products.length === before) {
      throw new ApiError(404, "Wishlist item not found");
    }

    await wishlist.save();
    return wishlistPayload(wishlist);
  },

  async toggleItem(userId, body = {}) {
    const productKey = resolveProductKey(body);

    if (!productKey) {
      throw new ApiError(400, "productSlug is required");
    }

    const product = await findProductBySlugOrId(productKey);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const wishlist = await getOrCreateWishlist(userId);
    const index = wishlist.products.findIndex(
      (item) => item.productSlug === product.slug
    );

    let wishlisted;

    if (index >= 0) {
      wishlist.products.splice(index, 1);
      wishlisted = false;
    } else {
      wishlist.products.push(productToWishlistItem(product));
      wishlisted = true;
    }

    await wishlist.save();

    return {
      data: { ...wishlistPayload(wishlist), wishlisted },
      message: wishlisted ? "Added to wishlist" : "Removed from wishlist",
    };
  },
};
