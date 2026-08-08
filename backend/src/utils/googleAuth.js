import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { ApiError } from "./ApiError.js";

let client = null;

function getClient() {
  if (!env.googleClientId) {
    throw new ApiError(
      500,
      "Google Sign-In is not configured. Add GOOGLE_CLIENT_ID in backend/.env",
    );
  }

  if (!client) {
    client = new OAuth2Client(env.googleClientId);
  }

  return client;
}

export async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new ApiError(400, "Google ID token is required.");
  }

  try {
    const ticket = await getClient().verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      throw new ApiError(401, "Invalid Google token payload.");
    }

    if (payload.email_verified === false) {
      throw new ApiError(401, "Google email is not verified.");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      picture: payload.picture || "",
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired Google token.");
  }
}
