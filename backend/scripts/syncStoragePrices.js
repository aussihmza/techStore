/**
 * Fill / upgrade storageOptions to [{ label, price }] SKUs.
 * - Legacy string[] → priced objects
 * - Empty arrays → category presets (phones, laptops, etc.)
 * Usage: node scripts/syncStoragePrices.js
 */
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { Product } from "../src/models/Product.js";
import { STORAGE_PRESETS } from "../src/migrations/data/productDetails.js";
import { normalizeStorageOptions } from "../src/utils/storageOptions.js";

if (!env.mongoUri) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}

await mongoose.connect(env.mongoUri);
const products = await Product.find();
let updated = 0;

for (const product of products) {
  const current = product.storageOptions || [];
  const labels =
    current.length > 0
      ? null
      : STORAGE_PRESETS[product.category] || [];

  const source =
    current.length > 0
      ? current
      : labels;

  const normalized = normalizeStorageOptions(source, product.price);

  // Skip categories that truly have no storage (Audio, Accessories, etc.)
  if (normalized.length === 0 && current.length === 0) continue;

  const needsWrite =
    normalized.length !== current.length ||
    normalized.some((option, i) => {
      const cur = current[i];
      if (typeof cur === "string") return true;
      return (
        !cur ||
        cur.label !== option.label ||
        Number(cur.price) !== Number(option.price)
      );
    });

  if (!needsWrite) continue;
  product.storageOptions = normalized;
  await product.save();
  updated += 1;
  console.log(`  ${product.slug}: ${normalized.map((o) => o.label).join(", ")}`);
}

console.log(`Updated storage pricing on ${updated}/${products.length} products`);
await mongoose.disconnect();
