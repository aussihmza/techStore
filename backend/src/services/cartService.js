import { ApiError } from "../utils/ApiError.js";
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

export const cartService = {
  async getCart(userId) {
    const cart = await getOrCreateCart(userId);
    return cartPayload(cart);
  },

  async addItem(userId, { productSlug, productId, id, qty = 1 } = {}) {
    const productKey = productSlug || productId || id;
    const quantity = Number(qty || 1);

    if (!productKey) {
      throw new ApiError(400, "productSlug is required");
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ApiError(400, "qty must be a positive integer");
    }

    const product = await findProductBySlugOrId(productKey);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const cart = await getOrCreateCart(userId);
    const existing = cart.items.find((item) => item.productSlug === product.slug);

    if (existing) {
      existing.qty += quantity;
    } else {
      cart.items.push(productToLineItem(product, quantity));
    }

    await cart.save();
    return cartPayload(cart);
  },

  async updateItem(userId, productSlug, qty) {
    const quantity = Number(qty);

    if (!Number.isInteger(quantity)) {
      throw new ApiError(400, "qty must be an integer");
    }

    const cart = await getOrCreateCart(userId);
    const index = cart.items.findIndex((item) => item.productSlug === productSlug);

    if (index === -1) {
      throw new ApiError(404, "Cart item not found");
    }

    if (quantity < 1) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].qty = quantity;
    }

    await cart.save();
    return cartPayload(cart);
  },

  async removeItem(userId, productSlug) {
    const cart = await getOrCreateCart(userId);
    const before = cart.items.length;

    cart.items = cart.items.filter((item) => item.productSlug !== productSlug);

    if (cart.items.length === before) {
      throw new ApiError(404, "Cart item not found");
    }

    await cart.save();
    return cartPayload(cart);
  },

  async clearCart(userId) {
    const cart = await getOrCreateCart(userId);
    cart.items = [];
    await cart.save();
    return cartPayload(cart);
  },
};
