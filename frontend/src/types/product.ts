export type ProductBadge = "SALE" | "NEW" | "BEST SELLER" | "EDITOR'S CHOICE";

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: ProductBadge;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  tone: "light" | "dark" | "accent" | "media";
  icon?: "chip" | "shield" | "island" | "camera" | "battery" | "sound" | "display" | "speed";
}

export interface ProductDetail {
  description: string;
  colors: ProductColor[];
  storageOptions: string[];
  gallery: string[];
  features: ProductFeature[];
}

export interface FilterOption {
  label: string;
  count: number;
}

export interface Collection {
  tag: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}
