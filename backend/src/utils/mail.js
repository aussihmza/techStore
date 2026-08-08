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
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
      <h2 style="margin: 0 0 12px;">Password reset code</h2>
      <p>Hi ${name || "there"},</p>
      <p>Use this one-time code to reset your TechStore password:</p>
      <p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:20px 0;">${otp}</p>
      <p style="color:#64748b;font-size:14px;">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
    </div>
  `;

  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: env.smtpFrom || env.smtpUser,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[password-reset] Failed to send email:", error.message);
    throw new ApiError(500, "Could not send OTP email. Check your SMTP settings.");
  }

  return { delivered: true };
}
