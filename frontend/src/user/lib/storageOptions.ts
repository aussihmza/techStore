import type { StorageOption } from "@/types/product";

function money(value: number) {
  return Math.round(Math.max(0, value) * 100) / 100;
}

function legacyPrice(basePrice: number, index: number) {
  const base = money(basePrice);
  const step = Math.max(50, Math.round(base * 0.1));
  return money(base + index * step);
}

/** Normalize API / legacy string options into priced SKUs. */
export function normalizeStorageOptions(
  raw: unknown,
  basePrice = 0,
): StorageOption[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  return raw
    .map((item, index) => {
      if (item && typeof item === "object" && "label" in item) {
        const label = String((item as StorageOption).label || "").trim();
        if (!label) return null;
        const price =
          (item as StorageOption).price != null
            ? money(Number((item as StorageOption).price))
            : legacyPrice(basePrice, index);
        return { label, price };
      }

      const label = String(item ?? "").trim();
      if (!label) return null;
      return { label, price: legacyPrice(basePrice, index) };
    })
    .filter((item): item is StorageOption => Boolean(item));
}

export function formatStorageOptionsInput(options: StorageOption[]): string {
  return options.map((option) => `${option.label}:${option.price}`).join(", ");
}
