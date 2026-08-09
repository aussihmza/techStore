/** Available units. Missing quantity (legacy products) treated as in stock. */
export function getProductStock(product: { quantity?: number | null }) {
  if (product.quantity == null || !Number.isFinite(Number(product.quantity))) {
    return 100;
  }
  return Math.max(0, Math.floor(Number(product.quantity)));
}

export function isOutOfStock(product: { quantity?: number | null }) {
  return getProductStock(product) < 1;
}
