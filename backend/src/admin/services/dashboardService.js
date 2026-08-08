import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { Review } from "../../models/Review.js";
import { ReturnRequest } from "../../models/ReturnRequest.js";
import { User } from "../../models/User.js";

export const adminDashboardService = {
  async getStats() {
    const [
      productCount,
      orderCount,
      reviewCount,
      pendingReturns,
      userCount,
      recentOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
      ReturnRequest.countDocuments({ status: "pending" }),
      User.countDocuments(),
      Order.find().sort({ placedAt: -1 }).limit(5).select("orderId total paymentStatus placedAt fulfillmentStatus"),
    ]);

    return {
      stats: {
        products: productCount,
        orders: orderCount,
        reviews: reviewCount,
        pendingReturns,
        users: userCount,
      },
      recentOrders: recentOrders.map((order) => ({
        orderId: order.orderId,
        total: order.total,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus || null,
        placedAt: order.placedAt,
      })),
    };
  },
};
