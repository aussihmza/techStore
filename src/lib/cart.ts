export const TAX_RATE = 0.08;

export const formatPrice = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export function calcCartTotals(subtotal: number) {
  const taxes = subtotal * TAX_RATE;
  return { subtotal, taxes, total: subtotal + taxes };
}
