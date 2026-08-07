import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // name: String,
    // email: String,
    // message: String,
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
