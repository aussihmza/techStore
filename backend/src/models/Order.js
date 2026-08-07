import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Frontend PlacedOrder.id (e.g. ORD-XXXX)
    orderId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },
    subtotal: { type: Number, required: true, min: 0 },
    taxes: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    shipping: { type: shippingSchema, required: true },
    deliveryFrom: { type: String, required: true },
    deliveryTo: { type: String, required: true },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
