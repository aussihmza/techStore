import type { CartLine } from "@/context/StoreContext";

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
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
}
