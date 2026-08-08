import type { Product } from "@/types/product";

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface CartLine extends Product {
  qty: number;
}

export type FulfillmentStatus =
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface PlacedOrder {
  id: string;
  items: CartLine[];
  subtotal: number;
  taxes: number;
  total: number;
  discount?: number;
  promoCode?: string | null;
  shipping: ShippingInfo;
  deliveryFrom: string;
  deliveryTo: string;
  placedAt?: string;
  paymentMethod?: "cod" | "card";
  paymentStatus?: string;
  status?: FulfillmentStatus;
  statusLabel?: string;
}
