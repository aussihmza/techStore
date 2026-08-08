import { Contact } from "../../models/Contact.js";
import { ApiError } from "../../utils/ApiError.js";

const ALLOWED_SUBJECTS = [
  "Technical Inquiry",
  "Order Support",
  "Project Consultation",
  "Corporate & Bulk Orders",
];

export const contactService = {
  async create({ fullName, name, email, subject, message } = {}) {
    const resolvedName = (fullName || name || "").trim();
    const resolvedEmail = (email || "").trim().toLowerCase();
    const resolvedSubject = (subject || "").trim();
    const resolvedMessage = (message || "").trim();

    if (!resolvedName || !resolvedEmail || !resolvedSubject || !resolvedMessage) {
      throw new ApiError(400, "fullName, email, subject, and message are required");
    }

    if (!ALLOWED_SUBJECTS.includes(resolvedSubject)) {
      throw new ApiError(400, "Invalid subject");
    }

    const contact = await Contact.create({
      fullName: resolvedName,
      email: resolvedEmail,
      subject: resolvedSubject,
      message: resolvedMessage,
    });

    return {
      contact: {
        id: contact._id,
        fullName: contact.fullName,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.createdAt,
      },
    };
  },
};
