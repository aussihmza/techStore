/**
 * Promote a user to admin by email.
 * Usage: node scripts/makeAdmin.js you@example.com
 */
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { User } from "../src/models/User.js";
import { normalizeEmail } from "../src/utils/auth.js";

const email = normalizeEmail(process.argv[2] || "");

if (!email) {
  console.error("Usage: node scripts/makeAdmin.js you@example.com");
  process.exit(1);
}

if (!env.mongoUri) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

await mongoose.connect(env.mongoUri);
const user = await User.findOne({ email });

if (!user) {
  console.error(`No user found for ${email}. Sign up first, then re-run.`);
  await mongoose.disconnect();
  process.exit(1);
}

user.role = "admin";
await user.save();
console.log(`OK: ${email} is now role=admin`);
await mongoose.disconnect();
