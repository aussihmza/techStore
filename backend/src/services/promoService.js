import { ApiError } from "../utils/ApiError.js";
import {
  calcPromoDiscount,
  getPromoDefinition,
  normalizePromoCode,
} from "../config/promos.js";

export const promoService = {
  validate({ code, subtotal } = {}) {
    const normalized = normalizePromoCode(code);
    if (!normalized) {
      throw new ApiError(400, "Promo code is required.");
    }

    const promo = getPromoDefinition(normalized);
    if (!promo) {
      throw new ApiError(404, "Invalid promo code.");
    }

    const amount = Math.max(0, Number(subtotal) || 0);
    const discount = calcPromoDiscount(amount, promo);

    return {
      code: promo.code,
      type: promo.type,
      value: promo.value,
      description: promo.description,
      discount,
      subtotal: Math.round(amount * 100) / 100,
    };
  },
};
