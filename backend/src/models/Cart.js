import mongoose from "mongoose";

const selectedColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    lineId: { type: String, trim: true },
    productSlug: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    image: { type: String, required: true },
    badge: {
      type: String,
      enum: ["SALE", "NEW", "BEST SELLER", "EDITOR'S CHOICE"],
    },
    qty: { type: Number, required: true, min: 1, default: 1 },
    selectedColor: { type: selectedColorSchema, default: null },
    selectedStorage: { type: String, default: null, trim: true },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
