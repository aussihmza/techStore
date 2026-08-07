import { Order } from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import {
  calcCartTotals,
  generateOrderId,
  getEstimatedDelivery,
  getOrCreateCart,
  requireShipping,
  toOrderResponse,
} from "../utils/storeHelpers.js";

function normalizeOrderQuery(orderId = "") {
  return orderId.trim().toUpperCase().replace(/^#/, "");
}

export const orderService = {
  async getAll(userId) {
    const orders = await Order.find({ user: userId }).sort({ placedAt: -1 });

    return {
      orders: orders.map(toOrderResponse),
      count: orders.length,
    };
  },

  async getById(userId, orderId) {
    const query = normalizeOrderQuery(orderId);
    const orders = await Order.find({ user: userId });

    const order = orders.find(
      (item) => normalizeOrderQuery(item.orderId) === query
    );

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return { order: toOrderResponse(order) };
  },

  async create(userId, { shipping } = {}) {
    const cart = await getOrCreateCart(userId);

    if (!cart.items.length) {
      throw new ApiError(400, "Cart is empty");
    }

    const validatedShipping = requireShipping(shipping);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const totals = calcCartTotals(subtotal);
    const delivery = getEstimatedDelivery();

    let order;
    let attempts = 0;

    while (attempts < 5) {
      try {
        order = await Order.create({
          orderId: generateOrderId(),
          user: userId,
          items: cart.items,
          ...totals,
          shipping: validatedShipping,
          deliveryFrom: delivery.from,
          deliveryTo: delivery.to,
          placedAt: new Date(),
        });
        break;
      } catch (error) {
        if (error?.code === 11000) {
          attempts += 1;
          continue;
        }
        throw error;
      }
    }

    if (!order) {
      throw new ApiError(500, "Could not create order. Please try again.");
    }

    cart.items = [];
    await cart.save();

    return { order: toOrderResponse(order) };
  },
};
