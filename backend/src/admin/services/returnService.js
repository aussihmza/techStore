import { ReturnRequest } from "../../models/ReturnRequest.js";
import { ApiError } from "../../utils/ApiError.js";

const STATUSES = ["pending", "approved", "rejected", "completed"];

function toAdminReturn(doc) {
  const item = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const user = item.user;
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
    user:
      user && typeof user === "object"
        ? {
            id: String(user._id),
            name: user.name,
            email: user.email,
          }
        : null,
  };
}

export const adminReturnService = {
  async list({ limit = 50 } = {}) {
    const safeLimit = Math.min(200, Math.max(1, Number(limit) || 50));
    const requests = await ReturnRequest.find()
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .populate("user", "name email");

    return {
      requests: requests.map(toAdminReturn),
      count: requests.length,
    };
  },

  async updateStatus(id, { status } = {}) {
    const next = String(status || "").toLowerCase();
    if (!STATUSES.includes(next)) {
      throw new ApiError(400, "Invalid return status");
    }

    const request = await ReturnRequest.findById(id);
    if (!request) {
      throw new ApiError(404, "Return request not found");
    }

    request.status = next;
    await request.save();
    await request.populate("user", "name email");
    return { request: toAdminReturn(request) };
  },
};
