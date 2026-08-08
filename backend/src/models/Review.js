import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productSlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ productSlug: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
