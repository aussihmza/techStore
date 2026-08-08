import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Product } from "../src/models/Product.js";
import { syncProductRating } from "../src/services/reviewService.js";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("No MONGODB_URI");
  process.exit(1);
}

await mongoose.connect(uri);
const products = await Product.find({}, "slug");
for (const product of products) {
  const summary = await syncProductRating(product.slug);
  console.log(product.slug, summary);
}
console.log(`Synced ${products.length} products`);
await mongoose.disconnect();
