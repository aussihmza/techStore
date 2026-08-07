import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // items: [],
    // total: Number,
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
