import crypto from "crypto";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";

export function createResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashedToken };
}

export function hashResetToken(token = "") {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

export function createOtp() {
  const otp = String(crypto.randomInt(100000, 1000000));
  const hashedOtp = hashResetToken(otp);
  return { otp, hashedOtp };
}

function hasSmtpConfig() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass);
}

function getTransporter() {
  if (!hasSmtpConfig()) {
    throw new ApiError(
      500,
      "Email is not configured. Add SMTP_HOST, SMTP_USER, and SMTP_PASS in backend/.env",
    );
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
}

/** Always From = authenticated SMTP user (Gmail spam-filters mismatches). */
function getFromAddress() {
  const address = String(env.smtpUser || "").trim();
  const configured = String(env.smtpFrom || "").trim();

  // Allow custom display name, but keep the mailbox equal to SMTP_USER
  const nameMatch = configured.match(/^"?([^"<]+)"?\s*<[^>]+>$/);
  const displayName = (nameMatch?.[1] || "TechStore").trim().replace(/"/g, "");

  return {
    name: displayName || "TechStore",
    address,
  };
}

function isPublicSiteUrl(url = "") {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getOrdersUrl() {
  const base = String(env.corsOrigin || "").replace(/\/$/, "");
  if (!isPublicSiteUrl(base)) return null;
  return `${base}/orders`;
}

async function sendMail({ to, subject, text, html, replyTo }) {
  const transporter = getTransporter();
  const from = getFromAddress();
  const messageId = `<${crypto.randomBytes(16).toString("hex")}@techstore.mail>`;

  await transporter.sendMail({
    from,
    to,
    replyTo: replyTo || from.address,
    subject,
    text,
    html,
    messageId,
    // Envelope MAIL FROM must match the authenticated Gmail account
    envelope: {
      from: from.address,
      to,
    },
    headers: {
      "X-Mailer": "TechStore",
      "X-Priority": "3",
      "X-Entity-Ref-ID": crypto.randomBytes(8).toString("hex"),
    },
  });
}

export async function sendPasswordResetOtpEmail({ to, name, otp }) {
  const subject = "Your TechStore password reset code";
  const text = [
    `Hi ${name || "there"},`,
    "",
    "Use this one-time code to reset your TechStore password:",
    otp,
    "",
    "This code expires in 10 minutes.",
    "If you did not request this, you can ignore this email.",
    "",
    "TechStore",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #0f172a;">
      <p style="margin:0 0 12px;font-size:18px;font-weight:700;">Password reset code</p>
      <p style="margin:0 0 12px;">Hi ${escapeHtml(name || "there")},</p>
      <p style="margin:0 0 12px;">Use this one-time code to reset your TechStore password:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:16px 0;">${escapeHtml(otp)}</p>
      <p style="color:#64748b;font-size:14px;margin:0;">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
    </div>
  `;

  try {
    await sendMail({ to, subject, text, html });
  } catch (error) {
    console.error("[password-reset] Failed to send email:", error.message);
    throw new ApiError(500, "Could not send OTP email. Check your SMTP settings.");
  }

  return { delivered: true };
}

function formatMoney(value) {
  const amount = Number(value) || 0;
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOrderConfirmationEmail(order) {
  const to = order?.shipping?.email;
  if (!to) {
    console.warn("[order-email] Missing shipping email; skipped confirmation.");
    return { delivered: false, skipped: true };
  }

  if (!hasSmtpConfig()) {
    console.warn(
      "[order-email] SMTP not configured; skipped confirmation for",
      order.orderId,
    );
    return { delivered: false, skipped: true };
  }

  const name = [order.shipping.firstName, order.shipping.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const paymentLabel =
    order.paymentMethod === "card" ? "Paid by card" : "Cash on Delivery";
  const ordersUrl = getOrdersUrl();
  const discount = Number(order.discount) || 0;
  const orderId = String(order.orderId || "").replace(/^#/, "");

  const itemLines = (order.items || []).map(
    (item) =>
      `${item.name} x${item.qty} - ${formatMoney(item.price * item.qty)}`,
  );

  // Keep subject calm/transactional (less spam-filter heat)
  const subject = `Your TechStore order ${orderId}`;

  const text = [
    `Hi ${name || "there"},`,
    "",
    "Thank you for your TechStore order. This email confirms we received it.",
    "",
    `Order number: ${order.orderId}`,
    `Payment method: ${paymentLabel}`,
    `Estimated delivery: ${order.deliveryFrom} to ${order.deliveryTo}`,
    "",
    "Items",
    ...itemLines.map((line) => `- ${line}`),
    "",
    `Subtotal: ${formatMoney(order.subtotal)}`,
    discount > 0
      ? `Discount${order.promoCode ? ` (${order.promoCode})` : ""}: -${formatMoney(discount)}`
      : null,
    `Tax: ${formatMoney(order.taxes)}`,
    `Total: ${formatMoney(order.total)}`,
    "",
    "Shipping address",
    `${order.shipping.address}`,
    `${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}`,
    "",
    ordersUrl
      ? `View your orders: ${ordersUrl}`
      : "Sign in to TechStore and open My Orders to track this order.",
    "",
    "If you did not place this order, reply to this email and we will help.",
    "",
    "TechStore",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const itemsHtml = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">
            <div style="font-weight:600;">${escapeHtml(item.name)}</div>
            <div style="color:#64748b;font-size:13px;">Qty ${item.qty}</div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">
            ${formatMoney(item.price * item.qty)}
          </td>
        </tr>`,
    )
    .join("");

  const ctaHtml = ordersUrl
    ? `<p style="margin:24px 0 0;">
        <a href="${ordersUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">
          View My Orders
        </a>
      </p>`
    : `<p style="margin:24px 0 0;color:#334155;">
        Sign in to TechStore and open <strong>My Orders</strong> to track this order.
      </p>`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#0f172a;max-width:560px;margin:0 auto;">
      <p style="margin:0 0 8px;font-size:20px;font-weight:700;">Your order receipt</p>
      <p style="margin:0 0 16px;color:#475569;">Hi ${escapeHtml(name || "there")}, thank you for your purchase.</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="margin:0;font-size:12px;color:#64748b;">Order number</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:700;">${escapeHtml(order.orderId)}</p>
        <p style="margin:10px 0 0;color:#334155;">${escapeHtml(paymentLabel)}</p>
        <p style="margin:4px 0 0;color:#334155;">Estimated delivery: ${escapeHtml(order.deliveryFrom)} to ${escapeHtml(order.deliveryTo)}</p>
      </div>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        ${itemsHtml}
      </table>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:4px 0;color:#64748b;">Subtotal</td>
          <td style="padding:4px 0;text-align:right;">${formatMoney(order.subtotal)}</td>
        </tr>
        ${
          discount > 0
            ? `<tr>
          <td style="padding:4px 0;color:#047857;">Discount${order.promoCode ? ` (${escapeHtml(order.promoCode)})` : ""}</td>
          <td style="padding:4px 0;text-align:right;color:#047857;">-${formatMoney(discount)}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding:4px 0;color:#64748b;">Tax</td>
          <td style="padding:4px 0;text-align:right;">${formatMoney(order.taxes)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0 0;font-weight:700;font-size:16px;">Total</td>
          <td style="padding:10px 0 0;text-align:right;font-weight:700;font-size:16px;">${formatMoney(order.total)}</td>
        </tr>
      </table>
      <p style="margin:0 0 4px;color:#64748b;font-size:13px;">Shipping address</p>
      <p style="margin:0;">
        ${escapeHtml(order.shipping.address)}<br/>
        ${escapeHtml(order.shipping.city)}, ${escapeHtml(order.shipping.state)} ${escapeHtml(order.shipping.zip)}
      </p>
      ${ctaHtml}
      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;">
        If you did not place this order, reply to this email.
      </p>
    </div>
  `;

  try {
    await sendMail({ to, subject, text, html });
    return { delivered: true };
  } catch (error) {
    console.error("[order-email] Failed to send confirmation:", error.message);
    return { delivered: false, error: error.message };
  }
}
