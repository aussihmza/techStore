import { apiRequest } from "@/lib/api/client";

export interface PromoValidation {
  code: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
  discount: number;
  subtotal: number;
}

const STORAGE_KEY = "techstore_promo";

export function getStoredPromo(): PromoValidation | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PromoValidation;
  } catch {
    return null;
  }
}

export function setStoredPromo(promo: PromoValidation | null) {
  if (!promo) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(promo));
}

export function clearStoredPromo() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function calcDiscountForSubtotal(
  subtotal: number,
  promo: PromoValidation | null,
) {
  if (!promo) return 0;
  const safeSubtotal = Math.max(0, subtotal);
  let discount = 0;
  if (promo.type === "percent") {
    discount = (safeSubtotal * promo.value) / 100;
  } else {
    discount = promo.value;
  }
  return Math.round(Math.min(safeSubtotal, discount) * 100) / 100;
}

export function validatePromoApi(code: string, subtotal: number) {
  return apiRequest<PromoValidation>("/promo/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}
