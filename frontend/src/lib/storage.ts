import type { Product } from "@/types/product";
import type { CartLine, PlacedOrder } from "@/types/order";

const USERS_KEY = "techstore_users_v1";
const SESSION_KEY = "techstore_session_v1";
const LEGACY_AUTH_KEY = "techstore_auth";

export interface StoredUser {
  name: string;
  email: string;
  password: string;
  wishlist: Product[];
  cart: CartLine[];
  orders: PlacedOrder[];
}

export type UsersMap = Record<string, StoredUser>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadUsers(): UsersMap {
  const users = safeParse<UsersMap>(localStorage.getItem(USERS_KEY), {});
  // One-time cleanup of old single-session key
  localStorage.removeItem(LEGACY_AUTH_KEY);
  return users;
}

export function saveUsers(users: UsersMap): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadSessionEmail(): string | null {
  const email = localStorage.getItem(SESSION_KEY);
  return email ? normalizeEmail(email) : null;
}

export function saveSessionEmail(email: string | null): void {
  if (email) localStorage.setItem(SESSION_KEY, normalizeEmail(email));
  else localStorage.removeItem(SESSION_KEY);
}

export function getUser(email: string): StoredUser | null {
  const users = loadUsers();
  return users[normalizeEmail(email)] ?? null;
}

export function upsertUser(user: StoredUser): void {
  const users = loadUsers();
  users[normalizeEmail(user.email)] = {
    ...user,
    email: normalizeEmail(user.email),
  };
  saveUsers(users);
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): { ok: true; user: StoredUser } | { ok: false; error: string } {
  const email = normalizeEmail(input.email);
  if (!email || !input.password) {
    return { ok: false, error: "Email and password are required." };
  }
  if (input.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const users = loadUsers();
  if (users[email]) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user: StoredUser = {
    name: input.name.trim() || email.split("@")[0],
    email,
    password: input.password,
    wishlist: [],
    cart: [],
    orders: [],
  };
  users[email] = user;
  saveUsers(users);
  saveSessionEmail(email);
  return { ok: true, user };
}

export function authenticateUser(
  email: string,
  password: string,
): { ok: true; user: StoredUser } | { ok: false; error: string } {
  const user = getUser(email);
  if (!user) {
    return { ok: false, error: "No account found with this email. Please sign up." };
  }
  if (user.password !== password) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }
  saveSessionEmail(user.email);
  return { ok: true, user };
}

export function updateUserData(
  email: string,
  patch: Partial<Pick<StoredUser, "wishlist" | "cart" | "orders" | "name">>,
): void {
  const users = loadUsers();
  const key = normalizeEmail(email);
  const existing = users[key];
  if (!existing) return;
  users[key] = { ...existing, ...patch };
  saveUsers(users);
}

export function findOrderForUser(email: string, orderId: string): PlacedOrder | null {
  const user = getUser(email);
  if (!user) return null;
  const q = orderId.trim().toUpperCase().replace(/^#/, "");
  return (
    user.orders.find((o) => o.id.toUpperCase().replace(/^#/, "") === q) ?? null
  );
}
