export function normalizeVariantToken(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export function buildCartLineId(
  productSlug: string,
  colorName?: string | null,
  storage?: string | null,
) {
  const color = normalizeVariantToken(colorName || "") || "default";
  const storageToken = normalizeVariantToken(storage || "") || "default";
  return `${productSlug}__${color}__${storageToken}`;
}

export function formatVariantLabel(input: {
  selectedColor?: { name: string } | null;
  selectedStorage?: string | null;
  variantLabel?: string | null;
}) {
  if (input.variantLabel) return input.variantLabel;
  const parts = [
    input.selectedColor?.name,
    input.selectedStorage || undefined,
  ].filter(Boolean);
  return parts.join(" · ");
}
