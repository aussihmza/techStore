/** Normalize catalog storage/size options to { label, price } SKUs. */

function money(value) {
  return Math.round(Math.max(0, Number(value) || 0) * 100) / 100;
}

function legacyPriceForIndex(basePrice, index) {
  const base = money(basePrice);
  const step = Math.max(50, Math.round(base * 0.1));
  return money(base + index * step);
}

/**
 * Accepts legacy string[] or { label, price }[].
 * @returns {{ label: string, price: number }[]}
 */
export function normalizeStorageOptions(raw, basePrice = 0) {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  return raw
    .map((item, index) => {
      if (item && typeof item === "object") {
        const label = String(item.label || item.name || "").trim();
        if (!label) return null;
        const price =
          item.price != null && item.price !== ""
            ? money(item.price)
            : legacyPriceForIndex(basePrice, index);
        return { label, price };
      }

      const label = String(item || "").trim();
      if (!label) return null;
      return { label, price: legacyPriceForIndex(basePrice, index) };
    })
    .filter(Boolean);
}

export function getStorageLabel(option) {
  if (!option) return null;
  if (typeof option === "string") return option;
  return option.label || null;
}

export function findStorageOption(options, storageOption) {
  const list = Array.isArray(options) ? options : [];
  if (!storageOption) return list[0] || null;

  const needle = String(
    typeof storageOption === "object"
      ? storageOption.label || ""
      : storageOption,
  )
    .trim()
    .toLowerCase();

  return (
    list.find((option) => String(option.label).trim().toLowerCase() === needle) ||
    null
  );
}

/** Parse admin input: "128GB:999, 256GB:1099" or "128GB,256GB" (legacy bumps). */
export function parseStorageOptionsInput(raw, basePrice = 0) {
  if (Array.isArray(raw)) {
    return normalizeStorageOptions(raw, basePrice);
  }

  const text = String(raw || "").trim();
  if (!text) return [];

  const parts = text.split(",").map((part) => part.trim()).filter(Boolean);
  const mapped = parts.map((part, index) => {
    const [labelPart, pricePart] = part.split(":").map((s) => s.trim());
    if (!labelPart) return null;
    if (pricePart != null && pricePart !== "") {
      return { label: labelPart, price: money(pricePart) };
    }
    return { label: labelPart, price: legacyPriceForIndex(basePrice, index) };
  });

  return mapped.filter(Boolean);
}
