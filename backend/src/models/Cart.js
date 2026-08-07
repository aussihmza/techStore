import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // items: [],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
