import dotenv from "dotenv";

dotenv.config();

function parseList(value = "") {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const defaultCorsOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOrigins = parseList(process.env.CORS_ORIGIN);
const resolvedCorsOrigins =
  corsOrigins.length > 0 ? corsOrigins : defaultCorsOrigins;

/** Primary public storefront URL (Stripe redirects). Falls back to first CORS origin. */
const frontendUrl = (
  process.env.FRONTEND_URL ||
  resolvedCorsOrigins[0] ||
  "http://localhost:5173"
).replace(/\/$/, "");

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "",
  /** @deprecated Prefer corsOrigins; kept for any legacy single-origin reads */
  corsOrigin: resolvedCorsOrigins[0],
  corsOrigins: resolvedCorsOrigins,
  frontendUrl,
  jwtSecret: process.env.JWT_SECRET || "techstore-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  /** Comma-separated emails promoted to admin on login/register. */
  adminEmails: parseList(process.env.ADMIN_EMAILS).map((email) =>
    email.toLowerCase(),
  ),
};
