export const TAX_RATE = 0.08;

export const formatPrice = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export function calcCartTotals(subtotal: number, discount = 0) {
  const safeSubtotal = Math.round(Math.max(0, subtotal) * 100) / 100;
  const safeDiscount =
    Math.round(Math.min(safeSubtotal, Math.max(0, discount)) * 100) / 100;
  const taxable = Math.round((safeSubtotal - safeDiscount) * 100) / 100;
  const taxes = Math.round(taxable * TAX_RATE * 100) / 100;
  const total = Math.round((taxable + taxes) * 100) / 100;
  return { subtotal: safeSubtotal, discount: safeDiscount, taxes, total };
}
