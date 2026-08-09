import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    // Atlas / cold starts need more than a local Mongo timeout
    serverSelectionTimeoutMS: 15000,
  });
  console.log("MongoDB connected");
}
