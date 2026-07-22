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
