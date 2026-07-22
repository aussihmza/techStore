import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";
import type { PlacedOrder } from "@/types/order";
import { generateOrderId, getEstimatedDelivery } from "@/lib/order";
export interface CartLine extends Product {
  qty: number;
}

interface StoreContextValue {
  wishlist: Product[];
  cart: CartLine[];
  lastOrder: PlacedOrder | null;
  wishlistCount: number;
  cartCount: number;
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  addToCart: (product: Product) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<PlacedOrder, "id" | "deliveryFrom" | "deliveryTo">) => PlacedOrder;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

  const placeOrder = useCallback(
    (order: Omit<PlacedOrder, "id" | "deliveryFrom" | "deliveryTo">) => {
      const delivery = getEstimatedDelivery();
      const placed: PlacedOrder = {
        ...order,
        id: generateOrderId(),
        deliveryFrom: delivery.from,
        deliveryTo: delivery.to,
      };
      setLastOrder(placed);
      setCart([]);
      return placed;
    },
    [],
  );

  const value = useMemo<StoreContextValue>(() => {
    return {
      wishlist,
      cart,
      lastOrder,
      wishlistCount: wishlist.length,
      cartCount: cart.reduce((sum, line) => sum + line.qty, 0),
      isWishlisted: (id) => wishlist.some((p) => p.id === id),
      toggleWishlist: (product) =>
        setWishlist((prev) =>
          prev.some((p) => p.id === product.id)
            ? prev.filter((p) => p.id !== product.id)
            : [...prev, product],
        ),
      removeFromWishlist: (id) => setWishlist((prev) => prev.filter((p) => p.id !== id)),
      addToCart: (product) =>
        setCart((prev) => {
          const existing = prev.find((line) => line.id === product.id);
          if (existing) {
            return prev.map((line) =>
              line.id === product.id ? { ...line, qty: line.qty + 1 } : line,
            );
          }
          return [...prev, { ...product, qty: 1 }];
        }),
      updateQty: (id, qty) =>
        setCart((prev) => prev.map((line) => (line.id === id ? { ...line, qty } : line))),
      removeFromCart: (id) => setCart((prev) => prev.filter((line) => line.id !== id)),
      clearCart: () => setCart([]),
      placeOrder,
    };
  }, [wishlist, cart, lastOrder, placeOrder]);

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
