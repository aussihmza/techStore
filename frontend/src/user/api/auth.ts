import { apiRequest } from "@/lib/api/client";
import { createCachedRequest } from "@/lib/api/cache";
import { setToken } from "@/lib/api/token";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthData {
  user: ApiUser;
  token: string;
}

export async function registerApi(input: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  const data = await apiRequest<AuthData>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setToken(data.token);
  meApi.invalidateAll();
  return data.user;
}

export async function loginApi(email: string, password: string): Promise<ApiUser> {
  const data = await apiRequest<AuthData>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  meApi.invalidateAll();
  return data.user;
}

export async function googleLoginApi(idToken: string): Promise<ApiUser> {
  const data = await apiRequest<AuthData>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
  setToken(data.token);
  meApi.invalidateAll();
  return data.user;
}

export async function logoutApi(): Promise<void> {
  try {
    await apiRequest<null>("/auth/logout", { method: "POST" });
  } finally {
    setToken(null);
    meApi.invalidateAll();
  }
}

export interface ForgotPasswordResult {
  message: string;
  emailSent?: boolean;
}

export function forgotPasswordApi(email: string) {
  return apiRequest<ForgotPasswordResult>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyResetOtpApi(email: string, otp: string) {
  return apiRequest<{ message: string; resetToken: string }>(
    "/auth/verify-reset-otp",
    {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    },
  );
}

export function resetPasswordApi(token: string, password: string) {
  return apiRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export const meApi = createCachedRequest(
  () => "/auth/me",
  async () => {
    const data = await apiRequest<{ user: ApiUser }>("/auth/me");
    return data.user;
  },
  15_000,
);
