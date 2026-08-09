import { ApiError } from "../../utils/ApiError.js";
import {
  calcCartTotals,
  findProductBySlugOrId,
  getItemLineId,
  getOrCreateCart,
  productToLineItem,
  resolveProductVariants,
  toCartItemResponse,
} from "../../utils/storeHelpers.js";

function cartPayload(cart) {
  const items = cart.items.map(toCartItemResponse);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    ...calcCartTotals(subtotal),
  };
}

function findItemIndex(cart, lineKey = "") {
  const key = decodeURIComponent(String(lineKey || "")).trim();
  if (!key) return -1;

  return cart.items.findIndex((item) => {
    const lineId = getItemLineId(item);
    return lineId === key || item.productSlug === key;
  });
}

export const cartService = {
  async getCart(userId) {
    const cart = await getOrCreateCart(userId);
    return cartPayload(cart);
  },

  async addItem(
    userId,
    { productSlug, productId, id, qty = 1, color, storage } = {},
  ) {
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

    const stock = Number.isFinite(Number(product.quantity))
      ? Number(product.quantity)
      : 100;
    if (stock < 1) {
      throw new ApiError(400, "This product is out of stock");
    }

    const variants = resolveProductVariants(product, color, storage);
    const lineItem = productToLineItem(product, quantity, variants);
    const cart = await getOrCreateCart(userId);
    const existing = cart.items.find(
      (item) => getItemLineId(item) === lineItem.lineId,
    );
    const nextQty = (existing?.qty || 0) + quantity;
    if (nextQty > stock) {
      throw new ApiError(400, `Only ${stock} unit(s) available in stock`);
    }

    if (existing) {
      existing.qty = nextQty;
      existing.lineId = lineItem.lineId;
      existing.selectedColor = lineItem.selectedColor;
      existing.selectedStorage = lineItem.selectedStorage;
    } else {
      cart.items.push(lineItem);
    }

    await cart.save();
    return cartPayload(cart);
  },

  async updateItem(userId, lineKey, qty) {
    const quantity = Number(qty);

    if (!Number.isInteger(quantity)) {
      throw new ApiError(400, "qty must be an integer");
    }

    const cart = await getOrCreateCart(userId);
    const index = findItemIndex(cart, lineKey);

    if (index === -1) {
      throw new ApiError(404, "Cart item not found");
    }

    if (quantity < 1) {
      cart.items.splice(index, 1);
    } else {
      const product = await findProductBySlugOrId(cart.items[index].productSlug);
      const stock = Number.isFinite(Number(product?.quantity))
        ? Number(product.quantity)
        : 100;
      if (quantity > stock) {
        throw new ApiError(400, `Only ${stock} unit(s) available in stock`);
      }
      cart.items[index].qty = quantity;
    }

    await cart.save();
    return cartPayload(cart);
  },

  async removeItem(userId, lineKey) {
    const cart = await getOrCreateCart(userId);
    const index = findItemIndex(cart, lineKey);

    if (index === -1) {
      throw new ApiError(404, "Cart item not found");
    }

    cart.items.splice(index, 1);
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
