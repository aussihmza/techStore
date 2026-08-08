import Stripe from "stripe";
import { env } from "./env.js";

export const stripe = env.stripeSecretKey
  ? new Stripe(env.stripeSecretKey)
  : null;

export function assertStripe() {
  if (!stripe) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return stripe;
}
