import { meApi, type ApiUser } from "@/user/api/auth";
import { getCartApi, type CartData } from "@/user/api/cart";
import { getWishlistApi, type WishlistData } from "@/user/api/wishlist";
import { getOrdersApi, type OrdersData } from "@/user/api/orders";
import { getToken } from "@/lib/api/token";

export interface SessionSnapshot {
  user: ApiUser;
  cart: CartData;
  wishlist: WishlistData;
  orders: OrdersData;
}

let bootPromise: Promise<SessionSnapshot | null> | null = null;

/** One shared bootstrap for StrictMode / remounts — me+cart+wishlist+orders once */
export function bootstrapSession(): Promise<SessionSnapshot | null> {
  if (bootPromise) return bootPromise;

  bootPromise = (async () => {
    const token = getToken();
    if (!token) return null;

    const user = await meApi();
    const [cart, wishlist, orders] = await Promise.all([
      getCartApi(),
      getWishlistApi(),
      getOrdersApi(),
    ]);

    return { user, cart, wishlist, orders };
  })().catch((error) => {
    bootPromise = null;
    throw error;
  });

  return bootPromise;
}

export function resetSessionBootstrap() {
  bootPromise = null;
}
