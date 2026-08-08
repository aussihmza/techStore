import { Newsletter } from "../models/Newsletter.js";
import { ApiError } from "../utils/ApiError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const newsletterService = {
  async subscribe({ email } = {}) {
    const resolvedEmail = String(email || "").trim().toLowerCase();

    if (!resolvedEmail) {
      throw new ApiError(400, "Email is required.");
    }

    if (!EMAIL_RE.test(resolvedEmail)) {
      throw new ApiError(400, "Please enter a valid email address.");
    }

    const existing = await Newsletter.findOne({ email: resolvedEmail });
    if (existing) {
      return {
        alreadySubscribed: true,
        subscriber: {
          id: existing._id,
          email: existing.email,
          createdAt: existing.createdAt,
        },
      };
    }

    try {
      const subscriber = await Newsletter.create({ email: resolvedEmail });
      return {
        alreadySubscribed: false,
        subscriber: {
          id: subscriber._id,
          email: subscriber.email,
          createdAt: subscriber.createdAt,
        },
      };
    } catch (error) {
      if (error?.code === 11000) {
        const dup = await Newsletter.findOne({ email: resolvedEmail });
        return {
          alreadySubscribed: true,
          subscriber: {
            id: dup._id,
            email: dup.email,
            createdAt: dup.createdAt,
          },
        };
      }
      throw error;
    }
  },
};
