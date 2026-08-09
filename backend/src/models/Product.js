import mongoose from "mongoose";

const productColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false }
);

const productFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tone: {
      type: String,
      enum: ["light", "dark", "accent", "media"],
      required: true,
    },
    icon: {
      type: String,
      enum: ["chip", "shield", "island", "camera", "battery", "sound", "display", "speed"],
    },
  },
  { _id: false }
);

const storageOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Frontend Product.id (slug)
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    /** Available inventory units */
    quantity: { type: Number, required: true, min: 0, default: 100 },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    reviews: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, required: true },
    badge: {
      type: String,
      enum: ["SALE", "NEW", "BEST SELLER", "EDITOR'S CHOICE"],
    },

    // Frontend ProductDetail
    description: { type: String, default: "" },
    colors: { type: [productColorSchema], default: [] },
    /** SKU variants: [{ label: "256GB", price: 1099 }] (legacy string[] still accepted in APIs) */
    storageOptions: { type: [storageOptionSchema], default: [] },
    gallery: { type: [String], default: [] },
    features: { type: [productFeatureSchema], default: [] },
    monthlyPrice: { type: Number, min: 0 },

    isFeatured: { type: Boolean, default: false },
    isShop: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
