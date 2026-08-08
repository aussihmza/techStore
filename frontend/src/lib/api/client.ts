import { getToken, setToken } from "@/lib/api/token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiFailure {
  success: false;
  message: string;
}

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(response.status, "Invalid server response");
  }

  if (!response.ok || !payload?.success) {
    if (response.status === 401) {
      setToken(null);
    }
    throw new ApiError(
      response.status,
      payload?.message || `Request failed (${response.status})`,
    );
  }

  return payload.data;
}
