import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";
import type { CartLine, PlacedOrder, ShippingInfo } from "@/types/order";
import { ApiError } from "@/lib/api/client";
import { loginApi, logoutApi, registerApi } from "@/lib/api/auth";
import {
  addCartItemApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "@/lib/api/cart";
import { removeWishlistItemApi, toggleWishlistApi } from "@/lib/api/wishlist";
import {
  getOrderByIdApi,
  placeOrderApi,
  type PaymentMethodOption,
} from "@/lib/api/orders";
import { completeCheckoutSessionApi } from "@/lib/api/payments";
import { bootstrapSession, resetSessionBootstrap } from "@/lib/api/session";
import { clearLegacyStorage, getToken, setToken } from "@/lib/api/token";

export type { CartLine };

export interface AuthUser {
  name: string;
  email: string;
}

type AuthResult = { ok: true } | { ok: false; error: string };
type OrderResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; error: string };

interface StoreContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  authReady: boolean;
  loginPromptOpen: boolean;
  wishlist: Product[];
  cart: CartLine[];
  orders: PlacedOrder[];
  lastOrder: PlacedOrder | null;
  wishlistCount: number;
  cartCount: number;
  signup: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  requireAuth: () => boolean;
  openLoginPrompt: () => void;
  closeLoginPrompt: () => void;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (
    shipping: ShippingInfo,
    paymentMethod?: PaymentMethodOption,
  ) => Promise<OrderResult>;
  completeCardCheckout: (sessionId: string) => Promise<OrderResult>;
  findOrder: (orderId: string) => Promise<PlacedOrder | null>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function toErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const resetStore = useCallback(() => {
    setUser(null);
    setWishlist([]);
    setCart([]);
    setOrders([]);
    setLastOrder(null);
  }, []);

  const applySession = useCallback(
    (snapshot: {
      user: { name: string; email: string };
      cart: { items: CartLine[] };
      wishlist: { products: Product[] };
      orders: { orders: PlacedOrder[] };
    }) => {
      setUser({ name: snapshot.user.name, email: snapshot.user.email });
      setCart(snapshot.cart.items);
      setWishlist(snapshot.wishlist.products);
      setOrders(snapshot.orders.orders);
      setLastOrder(snapshot.orders.orders[0] ?? null);
    },
    [],
  );

  // Restore JWT session once (deduped across StrictMode remounts)
  useEffect(() => {
    clearLegacyStorage();
    let active = true;

    async function hydrate() {
      if (!getToken()) {
        if (active) setAuthReady(true);
        return;
      }

      try {
        const snapshot = await bootstrapSession();
        if (!active) return;
        if (!snapshot) {
          resetStore();
          return;
        }
        applySession(snapshot);
      } catch {
        setToken(null);
        resetSessionBootstrap();
        if (active) resetStore();
      } finally {
        if (active) setAuthReady(true);
      }
    }

    void hydrate();
    return () => {
      active = false;
    };
  }, [applySession, resetStore]);

  const openLoginPrompt = useCallback(() => setLoginPromptOpen(true), []);
  const closeLoginPrompt = useCallback(() => setLoginPromptOpen(false), []);

  const requireAuth = useCallback(() => {
    if (user) return true;
    setLoginPromptOpen(true);
    return false;
  }, [user]);

  const signup = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      try {
        await registerApi(input);
        resetSessionBootstrap();
        const snapshot = await bootstrapSession();
        if (!snapshot) {
          return { ok: false as const, error: "Could not load account data." };
        }
        applySession(snapshot);
        setLoginPromptOpen(false);
        return { ok: true as const };
      } catch (error) {
        return {
          ok: false as const,
          error: toErrorMessage(error, "Could not create account."),
        };
      }
    },
    [applySession],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await loginApi(email, password);
        resetSessionBootstrap();
        const snapshot = await bootstrapSession();
        if (!snapshot) {
          return { ok: false as const, error: "Could not load account data." };
        }
        applySession(snapshot);
        setLoginPromptOpen(false);
        return { ok: true as const };
      } catch (error) {
        return {
          ok: false as const,
          error: toErrorMessage(error, "Could not log in."),
        };
      }
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      setToken(null);
      resetSessionBootstrap();
    }
    resetStore();
  }, [resetStore]);

  const toggleWishlist = useCallback(
    async (product: Product) => {
      if (!user) {
        setLoginPromptOpen(true);
        return;
      }
      try {
        const data = await toggleWishlistApi(product.id);
        setWishlist(data.products);
      } catch (error) {
        console.error(toErrorMessage(error, "Wishlist update failed"));
      }
    },
    [user],
  );

  const removeFromWishlist = useCallback(
    async (id: string) => {
      if (!user) {
        setLoginPromptOpen(true);
        return;
      }
      try {
        const data = await removeWishlistItemApi(id);
        setWishlist(data.products);
      } catch (error) {
        console.error(toErrorMessage(error, "Wishlist remove failed"));
      }
    },
    [user],
  );

  const addToCart = useCallback(
    async (product: Product) => {
      if (!user) {
        setLoginPromptOpen(true);
        return;
      }
      try {
        const data = await addCartItemApi(product.id, 1);
        setCart(data.items);
      } catch (error) {
        console.error(toErrorMessage(error, "Add to cart failed"));
      }
    },
    [user],
  );

  const updateQty = useCallback(
    async (id: string, qty: number) => {
      if (!user) {
        setLoginPromptOpen(true);
        return;
      }
      try {
        const data = await updateCartItemApi(id, qty);
        setCart(data.items);
      } catch (error) {
        console.error(toErrorMessage(error, "Cart update failed"));
      }
    },
    [user],
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      if (!user) {
        setLoginPromptOpen(true);
        return;
      }
      try {
        const data = await removeCartItemApi(id);
        setCart(data.items);
      } catch (error) {
        console.error(toErrorMessage(error, "Cart remove failed"));
      }
    },
    [user],
  );

  const clearCart = useCallback(async () => {
    if (!user) return;
    try {
      const data = await clearCartApi();
      setCart(data.items);
    } catch (error) {
      console.error(toErrorMessage(error, "Clear cart failed"));
    }
  }, [user]);

  const placeOrder = useCallback(
    async (
      shipping: ShippingInfo,
      paymentMethod: PaymentMethodOption = "cod",
    ): Promise<OrderResult> => {
      if (!user) {
        setLoginPromptOpen(true);
        return { ok: false, error: "Please log in first." };
      }

      try {
        const data = await placeOrderApi(shipping, paymentMethod);
        setOrders((prev) => [data.order, ...prev]);
        setLastOrder(data.order);
        setCart([]);
        return { ok: true, order: data.order };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Could not place order."),
        };
      }
    },
    [user],
  );

  const completeCardCheckout = useCallback(
    async (sessionId: string): Promise<OrderResult> => {
      if (!user) {
        return { ok: false, error: "Please log in first." };
      }

      try {
        const data = await completeCheckoutSessionApi(sessionId);
        setOrders((prev) => {
          if (prev.some((o) => o.id === data.order.id)) return prev;
          return [data.order, ...prev];
        });
        setLastOrder(data.order);
        getCartApi.invalidateAll();
        setCart([]);
        return { ok: true, order: data.order };
      } catch (error) {
        return {
          ok: false,
          error: toErrorMessage(error, "Could not complete payment."),
        };
      }
    },
    [user],
  );

  const findOrder = useCallback(
    async (orderId: string) => {
      if (!user) return null;
      const local = orders.find(
        (o) =>
          o.id.toUpperCase().replace(/^#/, "") ===
          orderId.trim().toUpperCase().replace(/^#/, ""),
      );
      if (local) return local;

      try {
        const data = await getOrderByIdApi(orderId);
        return data.order;
      } catch {
        return null;
      }
    },
    [user, orders],
  );

  const value = useMemo<StoreContextValue>(() => {
    return {
      user,
      isLoggedIn: Boolean(user),
      authReady,
      loginPromptOpen,
      wishlist,
      cart,
      orders,
      lastOrder,
      wishlistCount: wishlist.length,
      cartCount: cart.reduce((sum, line) => sum + line.qty, 0),
      signup,
      login,
      logout,
      requireAuth,
      openLoginPrompt,
      closeLoginPrompt,
      isWishlisted: (id) => wishlist.some((p) => p.id === id),
      toggleWishlist,
      removeFromWishlist,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      placeOrder,
      completeCardCheckout,
      findOrder,
    };
  }, [
    user,
    authReady,
    loginPromptOpen,
    wishlist,
    cart,
    orders,
    lastOrder,
    signup,
    login,
    logout,
    requireAuth,
    openLoginPrompt,
    closeLoginPrompt,
    toggleWishlist,
    removeFromWishlist,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    placeOrder,
    completeCardCheckout,
    findOrder,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
