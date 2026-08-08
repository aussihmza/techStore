import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { contactService } from "../services/contactService.js";

export const contactController = {
  create: asyncHandler(async (req, res) => {
    const data = await contactService.create(req.body);
    return ApiResponse(res, 201, data, "Message sent");
  }),
};
