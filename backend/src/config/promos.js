export const PROMO_CODES = {
  CODE10: {
    code: "CODE10",
    type: "percent",
    value: 10,
    description: "10% off your order",
  },
  SAVE20: {
    code: "SAVE20",
    type: "percent",
    value: 20,
    description: "20% off your order",
  },
  TECH5: {
    code: "TECH5",
    type: "fixed",
    value: 5,
    description: "$5 off your order",
  },
};

export function normalizePromoCode(code = "") {
  return String(code).trim().toUpperCase();
}

export function getPromoDefinition(code) {
  const normalized = normalizePromoCode(code);
  return PROMO_CODES[normalized] || null;
}

export function calcPromoDiscount(subtotal, promo) {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);
  if (!promo || safeSubtotal <= 0) return 0;

  let discount = 0;
  if (promo.type === "percent") {
    discount = (safeSubtotal * Number(promo.value)) / 100;
  } else if (promo.type === "fixed") {
    discount = Number(promo.value);
  }

  discount = Math.min(discount, safeSubtotal);
  return Math.round(discount * 100) / 100;
}
