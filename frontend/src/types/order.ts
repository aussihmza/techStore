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

export interface PlacedOrder {
  id: string;
  items: CartLine[];
  subtotal: number;
  taxes: number;
  total: number;
  shipping: ShippingInfo;
  deliveryFrom: string;
  deliveryTo: string;
  placedAt?: string;
}
