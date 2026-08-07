import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // ShopCategory
    label: { type: String, required: true, trim: true },
    filterKey: { type: String, required: true, trim: true },
    productCategories: {
      type: [String],
      required: true,
      default: [],
    },
    // Collection (categories page)
    tag: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
