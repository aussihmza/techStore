const KEY = "techstore_auth_return";

export type AuthReturnIntent = {
  returnTo: string;
  action?: "buyNow";
  productId?: string;
  storage?: string | null;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function getSafeReturnPath(
  path: string | null | undefined,
  fallback = "/",
): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}

export function setAuthReturn(intent: AuthReturnIntent): void {
  if (!canUseStorage()) return;
  sessionStorage.setItem(
    KEY,
    JSON.stringify({
      ...intent,
      returnTo: getSafeReturnPath(intent.returnTo, "/"),
    }),
  );
}

export function peekAuthReturn(): AuthReturnIntent | null {
  if (!canUseStorage()) return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthReturnIntent;
    if (!parsed || typeof parsed.returnTo !== "string") return null;
    return {
      ...parsed,
      returnTo: getSafeReturnPath(parsed.returnTo, "/"),
    };
  } catch {
    return null;
  }
}

export function consumeAuthReturn(): AuthReturnIntent | null {
  const intent = peekAuthReturn();
  if (canUseStorage()) sessionStorage.removeItem(KEY);
  return intent;
}

export function clearAuthReturn(): void {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(KEY);
}
