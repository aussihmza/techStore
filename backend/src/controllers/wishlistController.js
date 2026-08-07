import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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

export const wishlistController = {
  getWishlist: asyncHandler(async (req, res) => {
    const wishlist = await getOrCreateWishlist(req.user._id);
    return ApiResponse(res, 200, wishlistPayload(wishlist), "Wishlist fetched");
  }),

  addItem: asyncHandler(async (req, res) => {
    const productKey = req.body.productSlug || req.body.productId || req.body.id;

    if (!productKey) {
      throw new ApiError(400, "productSlug is required");
    }

    const product = await findProductBySlugOrId(productKey);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
    const exists = wishlist.products.some((item) => item.productSlug === product.slug);

    if (!exists) {
      wishlist.products.push(productToWishlistItem(product));
      await wishlist.save();
    }

    return ApiResponse(res, 200, wishlistPayload(wishlist), "Item added to wishlist");
  }),

  removeItem: asyncHandler(async (req, res) => {
    const productSlug = req.params.id;
    const wishlist = await getOrCreateWishlist(req.user._id);
    const before = wishlist.products.length;

    wishlist.products = wishlist.products.filter(
      (item) => item.productSlug !== productSlug
    );

    if (wishlist.products.length === before) {
      throw new ApiError(404, "Wishlist item not found");
    }

    await wishlist.save();
    return ApiResponse(res, 200, wishlistPayload(wishlist), "Item removed from wishlist");
  }),

  toggleItem: asyncHandler(async (req, res) => {
    const productKey = req.body.productSlug || req.body.productId || req.body.id;

    if (!productKey) {
      throw new ApiError(400, "productSlug is required");
    }

    const product = await findProductBySlugOrId(productKey);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
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

    return ApiResponse(
      res,
      200,
      { ...wishlistPayload(wishlist), wishlisted },
      wishlisted ? "Added to wishlist" : "Removed from wishlist"
    );
  }),
};
