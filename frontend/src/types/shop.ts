export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export interface ShopFilters {
  categories: string[];
  brands: string[];
  maxPrice: number;
  minRating: number;
  sort: SortOption;
}

export interface ShopCategory {
  slug: string;
  label: string;
  filterKey: string;
  productCategories: string[];
}
