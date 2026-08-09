import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { Review } from "../../models/Review.js";
import { ReturnRequest } from "../../models/ReturnRequest.js";
import { User } from "../../models/User.js";

const TOP_PRODUCTS_LIMIT = 7;

export const adminDashboardService = {
  async getStats() {
    const [
      productCount,
      orderCount,
      reviewCount,
      pendingReturns,
      userCount,
      recentOrders,
      productSalesRaw,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
      ReturnRequest.countDocuments({ status: "pending" }),
      User.countDocuments(),
      Order.find()
        .sort({ placedAt: -1 })
        .limit(5)
        .select("orderId total paymentStatus placedAt fulfillmentStatus"),
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productSlug",
            name: { $first: "$items.name" },
            quantity: { $sum: "$items.qty" },
          },
        },
        { $sort: { quantity: -1 } },
      ]),
    ]);

    const top = productSalesRaw.slice(0, TOP_PRODUCTS_LIMIT);
    const rest = productSalesRaw.slice(TOP_PRODUCTS_LIMIT);
    const othersQty = rest.reduce((sum, row) => sum + row.quantity, 0);

    const topProductsByOrders = top.map((row) => ({
      productSlug: row._id,
      name: row.name,
      quantity: row.quantity,
    }));

    if (othersQty > 0) {
      topProductsByOrders.push({
        productSlug: "__others__",
        name: "Others",
        quantity: othersQty,
      });
    }

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
      topProductsByOrders,
    };
  },
};
