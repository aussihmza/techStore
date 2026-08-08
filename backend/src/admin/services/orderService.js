import { Order } from "../../models/Order.js";
import { ApiError } from "../../utils/ApiError.js";
import { toOrderResponse } from "../../utils/storeHelpers.js";

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
const FULFILLMENT_STATUSES = [
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

function normalizeOrderId(orderId = "") {
  return String(orderId).trim().toUpperCase().replace(/^#/, "");
}

export const adminOrderService = {
  async list({ limit = 50 } = {}) {
    const safeLimit = Math.min(200, Math.max(1, Number(limit) || 50));
    const orders = await Order.find()
      .sort({ placedAt: -1 })
      .limit(safeLimit)
      .populate("user", "name email");

    return {
      orders: orders.map((order) => {
        const base = toOrderResponse(order);
        const user = order.user;
        return {
          ...base,
          user: user
            ? {
                id: String(user._id),
                name: user.name,
                email: user.email,
              }
            : null,
        };
      }),
      count: orders.length,
    };
  },

  async updateStatus(orderId, body = {}) {
    const bare = normalizeOrderId(orderId);
    // Stored IDs are "#TS-xxxxx"; accept both with and without "#".
    const order = await Order.findOne({
      orderId: { $in: [`#${bare}`, bare] },
    });
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (body.paymentStatus != null) {
      const paymentStatus = String(body.paymentStatus).toLowerCase();
      if (!PAYMENT_STATUSES.includes(paymentStatus)) {
        throw new ApiError(400, "Invalid payment status");
      }
      order.paymentStatus = paymentStatus;
    }

    if (body.fulfillmentStatus != null) {
      const fulfillmentStatus = String(body.fulfillmentStatus).toLowerCase();
      if (!FULFILLMENT_STATUSES.includes(fulfillmentStatus)) {
        throw new ApiError(400, "Invalid fulfillment status");
      }
      order.fulfillmentStatus = fulfillmentStatus;
    }

    await order.save();
    return { order: toOrderResponse(order) };
  },
};
