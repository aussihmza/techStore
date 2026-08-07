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
import type { CartLine, PlacedOrder } from "@/types/order";
import { generateOrderId, getEstimatedDelivery } from "@/lib/order";
import {
  authenticateUser,
  findOrderForUser,
  getUser,
  loadSessionEmail,
  registerUser,
  saveSessionEmail,
  updateUserData,
} from "@/lib/storage";

export type { CartLine };

export interface AuthUser {
  name: string;
  email: string;
}

interface StoreContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
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
  }) => { ok: true } | { ok: false; error: string };
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  requireAuth: () => boolean;
  openLoginPrompt: () => void;
  closeLoginPrompt: () => void;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  addToCart: (product: Product) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<PlacedOrder, "id" | "deliveryFrom" | "deliveryTo" | "placedAt">) => PlacedOrder;
  findOrder: (orderId: string) => PlacedOrder | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function toAuthUser(u: { name: string; email: string }): AuthUser {
  return { name: u.name, email: u.email };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore session + per-user data on first mount
  useEffect(() => {
    const email = loadSessionEmail();
    if (email) {
      const stored = getUser(email);
      if (stored) {
        setUser(toAuthUser(stored));
        setWishlist(stored.wishlist ?? []);
        setCart(stored.cart ?? []);
        setOrders(stored.orders ?? []);
      } else {
        saveSessionEmail(null);
      }
    }
    setHydrated(true);
  }, []);

  // Persist cart / wishlist / orders whenever they change for the logged-in user
  useEffect(() => {
    if (!hydrated || !user) return;
    updateUserData(user.email, { wishlist, cart, orders });
  }, [hydrated, user, wishlist, cart, orders]);

  const openLoginPrompt = useCallback(() => setLoginPromptOpen(true), []);
  const closeLoginPrompt = useCallback(() => setLoginPromptOpen(false), []);

  const requireAuth = useCallback(() => {
    if (user) return true;
    setLoginPromptOpen(true);
    return false;
  }, [user]);

  const applyUserData = useCallback((email: string) => {
    const stored = getUser(email);
    if (!stored) return;
    setUser(toAuthUser(stored));
    setWishlist(stored.wishlist ?? []);
    setCart(stored.cart ?? []);
    setOrders(stored.orders ?? []);
    setLoginPromptOpen(false);
  }, []);

  const signup = useCallback(
    (input: { name: string; email: string; password: string }) => {
      const result = registerUser(input);
      if (!result.ok) return result;
      applyUserData(result.user.email);
      return { ok: true as const };
    },
    [applyUserData],
  );

  const login = useCallback(
    (email: string, password: string) => {
      const result = authenticateUser(email, password);
      if (!result.ok) return result;
      applyUserData(result.user.email);
      return { ok: true as const };
    },
    [applyUserData],
  );

  const logout = useCallback(() => {
    saveSessionEmail(null);
    setUser(null);
    setWishlist([]);
    setCart([]);
    setOrders([]);
  }, []);

  const placeOrder = useCallback(
    (order: Omit<PlacedOrder, "id" | "deliveryFrom" | "deliveryTo" | "placedAt">) => {
      const delivery = getEstimatedDelivery();
      const placed: PlacedOrder = {
        ...order,
        id: generateOrderId(),
        deliveryFrom: delivery.from,
        deliveryTo: delivery.to,
        placedAt: new Date().toISOString(),
      };
      setOrders((prev) => [placed, ...prev]);
      setCart([]);
      return placed;
    },
    [],
  );

  const findOrder = useCallback(
    (orderId: string) => {
      if (!user) return null;
      return findOrderForUser(user.email, orderId);
    },
    [user],
  );

  const lastOrder = orders[0] ?? null;

  const value = useMemo<StoreContextValue>(() => {
    return {
      user,
      isLoggedIn: Boolean(user),
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
      toggleWishlist: (product) => {
        if (!user) {
          setLoginPromptOpen(true);
          return;
        }
        setWishlist((prev) =>
          prev.some((p) => p.id === product.id)
            ? prev.filter((p) => p.id !== product.id)
            : [...prev, product],
        );
      },
      removeFromWishlist: (id) => {
        if (!user) {
          setLoginPromptOpen(true);
          return;
        }
        setWishlist((prev) => prev.filter((p) => p.id !== id));
      },
      addToCart: (product) => {
        if (!user) {
          setLoginPromptOpen(true);
          return;
        }
        setCart((prev) => {
          const existing = prev.find((line) => line.id === product.id);
          if (existing) {
            return prev.map((line) =>
              line.id === product.id ? { ...line, qty: line.qty + 1 } : line,
            );
          }
          return [...prev, { ...product, qty: 1 }];
        });
      },
      updateQty: (id, qty) => {
        if (!user) {
          setLoginPromptOpen(true);
          return;
        }
        setCart((prev) => {
          if (qty < 1) return prev.filter((line) => line.id !== id);
          return prev.map((line) => (line.id === id ? { ...line, qty } : line));
        });
      },
      removeFromCart: (id) => {
        if (!user) {
          setLoginPromptOpen(true);
          return;
        }
        setCart((prev) => prev.filter((line) => line.id !== id));
      },
      clearCart: () => setCart([]),
      placeOrder,
      findOrder,
    };
  }, [
    user,
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
    placeOrder,
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
