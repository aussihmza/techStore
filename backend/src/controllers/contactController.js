import { Contact } from "../models/Contact.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const contactController = {
  create: asyncHandler(async (req, res) => {
    const fullName = (req.body.fullName || req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const subject = (req.body.subject || "").trim();
    const message = (req.body.message || "").trim();

    if (!fullName || !email || !subject || !message) {
      throw new ApiError(400, "fullName, email, subject, and message are required");
    }

    const allowedSubjects = [
      "Technical Inquiry",
      "Order Support",
      "Project Consultation",
      "Corporate & Bulk Orders",
    ];

    if (!allowedSubjects.includes(subject)) {
      throw new ApiError(400, "Invalid subject");
    }

    const contact = await Contact.create({
      fullName,
      email,
      subject,
      message,
    });

    return ApiResponse(
      res,
      201,
      {
        contact: {
          id: contact._id,
          fullName: contact.fullName,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          createdAt: contact.createdAt,
        },
      },
      "Message sent"
    );
  }),
};
