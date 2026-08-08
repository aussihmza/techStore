import { apiRequest } from "@/lib/api/client";
import { setToken } from "@/lib/api/token";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
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
  return data.user;
}

export async function loginApi(email: string, password: string): Promise<ApiUser> {
  const data = await apiRequest<AuthData>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function logoutApi(): Promise<void> {
  try {
    await apiRequest<null>("/auth/logout", { method: "POST" });
  } finally {
    setToken(null);
  }
}

export async function meApi(): Promise<ApiUser> {
  const data = await apiRequest<{ user: ApiUser }>("/auth/me");
  return data.user;
}
