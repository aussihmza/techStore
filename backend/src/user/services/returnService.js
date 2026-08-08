import { Order } from "../../models/Order.js";
import { ReturnRequest } from "../../models/ReturnRequest.js";
import { ApiError } from "../../utils/ApiError.js";

const ALLOWED_REASONS = [
  "Changed mind",
  "Damaged on arrival",
  "Wrong item",
  "Defective / not working",
  "Missing parts",
  "Other",
];

function normalizeOrderId(orderId = "") {
  return String(orderId).trim().toUpperCase().replace(/^#/, "");
}

function generateRmaId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `#RMA-${num}`;
}

function toReturnResponse(doc) {
  const item = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    id: String(item._id),
    rmaId: item.rmaId,
    orderId: item.orderId,
    type: item.type,
    reason: item.reason,
    details: item.details,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const returnService = {
  async listMine(userId) {
    const requests = await ReturnRequest.find({ user: userId }).sort({
      createdAt: -1,
    });
    return {
      requests: requests.map(toReturnResponse),
      count: requests.length,
    };
  },

  async create(
    userId,
    { orderId, type = "return", reason, details } = {},
  ) {
    const query = normalizeOrderId(orderId);
    const resolvedType = String(type || "return").toLowerCase();
    const resolvedReason = String(reason || "").trim();
    const resolvedDetails = String(details || "").trim();

    if (!query) {
      throw new ApiError(400, "Order ID is required.");
    }
    if (resolvedType !== "return" && resolvedType !== "warranty") {
      throw new ApiError(400, "Type must be return or warranty.");
    }
    if (!ALLOWED_REASONS.includes(resolvedReason)) {
      throw new ApiError(400, "Invalid return reason.");
    }
    if (resolvedDetails.length < 10) {
      throw new ApiError(400, "Please describe the issue (at least 10 characters).");
    }

    const orders = await Order.find({ user: userId });
    const order = orders.find(
      (item) => normalizeOrderId(item.orderId) === query,
    );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found on your account. Check the order ID and try again.",
      );
    }

    const openExisting = await ReturnRequest.findOne({
      user: userId,
      order: order._id,
      status: { $in: ["pending", "approved"] },
    });
    if (openExisting) {
      throw new ApiError(
        409,
        `You already have an open request (${openExisting.rmaId}) for this order.`,
      );
    }

    let request = null;
    let attempts = 0;
    while (attempts < 5) {
      try {
        request = await ReturnRequest.create({
          rmaId: generateRmaId(),
          user: userId,
          order: order._id,
          orderId: order.orderId,
          type: resolvedType,
          reason: resolvedReason,
          details: resolvedDetails,
          status: "pending",
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

    if (!request) {
      throw new ApiError(500, "Could not create return request. Please try again.");
    }

    return { request: toReturnResponse(request) };
  },
};
