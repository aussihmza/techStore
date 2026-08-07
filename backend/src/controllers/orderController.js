import { Order } from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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

export const orderController = {
  getAll: asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ placedAt: -1 });

    return ApiResponse(
      res,
      200,
      {
        orders: orders.map(toOrderResponse),
        count: orders.length,
      },
      "Orders fetched"
    );
  }),

  getById: asyncHandler(async (req, res) => {
    const query = normalizeOrderQuery(req.params.id);
    const orders = await Order.find({ user: req.user._id });

    const order = orders.find(
      (item) => normalizeOrderQuery(item.orderId) === query
    );

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return ApiResponse(res, 200, { order: toOrderResponse(order) }, "Order fetched");
  }),

  create: asyncHandler(async (req, res) => {
    const cart = await getOrCreateCart(req.user._id);

    if (!cart.items.length) {
      throw new ApiError(400, "Cart is empty");
    }

    const shipping = requireShipping(req.body.shipping);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const totals = calcCartTotals(subtotal);
    const delivery = getEstimatedDelivery();

    let order;
    let attempts = 0;

    // Rare collision retry for generated order ids
    while (attempts < 5) {
      try {
        order = await Order.create({
          orderId: generateOrderId(),
          user: req.user._id,
          items: cart.items,
          ...totals,
          shipping,
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

    return ApiResponse(res, 201, { order: toOrderResponse(order) }, "Order placed");
  }),
};
