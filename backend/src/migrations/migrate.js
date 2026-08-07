import mongoose from "mongoose";
import { env } from "../config/env.js";
import { connectDB } from "../config/db.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { categories } from "./data/categories.js";
import { getProductsSeed } from "./data/products.js";

async function migrateCategories() {
  let upserted = 0;

  for (const category of categories) {
    await Category.findOneAndUpdate({ slug: category.slug }, category, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    upserted += 1;
  }

  return upserted;
}

async function migrateProducts() {
  const products = getProductsSeed();
  let upserted = 0;

  for (const product of products) {
    await Product.findOneAndUpdate({ slug: product.slug }, product, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    upserted += 1;
  }

  return upserted;
}

async function run() {
  try {
    if (!env.mongoUri) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await connectDB(env.mongoUri);

    const categoryCount = await migrateCategories();
    const productCount = await migrateProducts();

    console.log(`Categories upserted: ${categoryCount}`);
    console.log(`Products upserted: ${productCount}`);
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
