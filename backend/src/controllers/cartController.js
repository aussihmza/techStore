import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  calcCartTotals,
  findProductBySlugOrId,
  getOrCreateCart,
  productToLineItem,
  toCartItemResponse,
} from "../utils/storeHelpers.js";

function cartPayload(cart) {
  const items = cart.items.map(toCartItemResponse);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return {
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    ...calcCartTotals(subtotal),
  };
}

export const cartController = {
  getCart: asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user._id);
    return ApiResponse(res, 200, cartPayload(cart), "Cart fetched");
  }),

  addItem: asyncHandler(async (req, res) => {
    const productKey = req.body.productSlug || req.body.productId || req.body.id;
    const qty = Number(req.body.qty || 1);

    if (!productKey) {
      throw new ApiError(400, "productSlug is required");
    }

    if (!Number.isInteger(qty) || qty < 1) {
      throw new ApiError(400, "qty must be a positive integer");
    }

    const product = await findProductBySlugOrId(productKey);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((item) => item.productSlug === product.slug);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push(productToLineItem(product, qty));
    }

    await cart.save();
    return ApiResponse(res, 200, cartPayload(cart), "Item added to cart");
  }),

  updateItem: asyncHandler(async (req, res) => {
    const productSlug = req.params.id;
    const qty = Number(req.body.qty);

    if (!Number.isInteger(qty)) {
      throw new ApiError(400, "qty must be an integer");
    }

    const cart = await getOrCreateCart(req.user._id);
    const index = cart.items.findIndex((item) => item.productSlug === productSlug);

    if (index === -1) {
      throw new ApiError(404, "Cart item not found");
    }

    if (qty < 1) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].qty = qty;
    }

    await cart.save();
    return ApiResponse(res, 200, cartPayload(cart), "Cart updated");
  }),

  removeItem: asyncHandler(async (req, res) => {
    const productSlug = req.params.id;
    const cart = await getOrCreateCart(req.user._id);
    const before = cart.items.length;

    cart.items = cart.items.filter((item) => item.productSlug !== productSlug);

    if (cart.items.length === before) {
      throw new ApiError(404, "Cart item not found");
    }

    await cart.save();
    return ApiResponse(res, 200, cartPayload(cart), "Item removed from cart");
  }),

  clearCart: asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    return ApiResponse(res, 200, cartPayload(cart), "Cart cleared");
  }),
};
