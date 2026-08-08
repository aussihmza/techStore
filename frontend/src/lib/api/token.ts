const TOKEN_KEY = "techstore_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/** One-time cleanup of old localStorage auth/user data */
export function clearLegacyStorage(): void {
  localStorage.removeItem("techstore_users_v1");
  localStorage.removeItem("techstore_session_v1");
  localStorage.removeItem("techstore_auth");
}
