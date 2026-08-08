import type { Product } from "@/types/product";
import type { ShopCategory, ShopFilters } from "@/types/shop";
import {
  getBrandFilterCounts,
  getCategoryFilterCounts,
  getMaxCatalogPrice,
} from "@/utils/shopFilters";
import { StarIcon } from "@/components/ui/icons";

interface FilterSidebarProps {
  products: Product[];
  categories: ShopCategory[];
  filters: ShopFilters;
  categorySlug?: string;
  onCategoriesChange: (categories: string[]) => void;
  onBrandsChange: (brands: string[]) => void;
  onMaxPriceChange: (maxPrice: number) => void;
  onMinRatingChange: (minRating: number) => void;
  onClear: () => void;
}

export default function FilterSidebar({
  products,
  categories,
  filters,
  categorySlug,
  onCategoriesChange,
  onBrandsChange,
  onMaxPriceChange,
  onMinRatingChange,
  onClear,
}: FilterSidebarProps) {
  const maxCatalogPrice = getMaxCatalogPrice(products) || 1;
  const categoryOptions = getCategoryFilterCounts(
    products,
    filters,
    categories,
    categorySlug,
  );
  const brandOptions = getBrandFilterCounts(products, filters, categories, categorySlug);

  const toggleCategory = (label: string) => {
    const next = filters.categories.includes(label)
      ? filters.categories.filter((l) => l !== label)
      : [...filters.categories, label];
    onCategoriesChange(next);
  };

  const toggleBrand = (label: string) => {
    const next = filters.brands.includes(label)
      ? filters.brands.filter((l) => l !== label)
      : [...filters.brands, label];
    onBrandsChange(next);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.maxPrice < maxCatalogPrice ||
    filters.minRating > 0;

  return (
    <aside className="h-full rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.15)] backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-brand hover:text-brand-dark"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Categories">
        {categoryOptions.length > 0 ? (
          categoryOptions.map((c) => (
            <CheckboxRow
              key={c.label}
              label={c.label}
              count={c.count}
              checked={filters.categories.includes(c.label)}
              onChange={() => toggleCategory(c.label)}
            />
          ))
        ) : (
          <p className="text-sm text-slate-400">No categories match current filters.</p>
        )}
      </FilterGroup>

      <FilterGroup title="Price Range">
        <input
          type="range"
          min={0}
          max={maxCatalogPrice}
          step={50}
          value={Math.min(filters.maxPrice, maxCatalogPrice)}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="mt-2 flex justify-between text-sm text-slate-500">
          <span>$0</span>
          <span className="font-medium text-ink">${filters.maxPrice.toLocaleString()}</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Brands">
        {brandOptions.length > 0 ? (
          brandOptions.map((b) => (
            <CheckboxRow
              key={b.label}
              label={b.label}
              count={b.count}
              checked={filters.brands.includes(b.label)}
              onChange={() => toggleBrand(b.label)}
            />
          ))
        ) : (
          <p className="text-sm text-slate-400">No brands match current filters.</p>
        )}
      </FilterGroup>

      <FilterGroup title="Rating" last>
        <button
          type="button"
          onClick={() => onMinRatingChange(filters.minRating >= 4 ? 0 : 4)}
          className={`flex items-center gap-1 rounded-lg px-1 py-1 transition-colors ${
            filters.minRating >= 4 ? "text-brand" : "text-slate-500 hover:text-brand"
          }`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < 4 ? "text-amber-400" : "text-slate-200"}`}
            />
          ))}
          <span className="ml-1 text-sm">& up</span>
        </button>
      </FilterGroup>
    </aside>
  );
}

interface FilterGroupProps {
  title: string;
  last?: boolean;
  children: React.ReactNode;
}

function FilterGroup({ title, last, children }: FilterGroupProps) {
  return (
    <div className={last ? "" : "mb-6 border-b border-slate-100 pb-6"}>
      <h3 className="mb-3 text-lg font-bold text-ink">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface CheckboxRowProps {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}

function CheckboxRow({ label, count, checked, onChange }: CheckboxRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-base">
      <span className="flex items-center gap-2.5 text-slate-600">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-slate-300 accent-brand"
        />
        {label}
      </span>
      <span className="text-sm text-slate-400">{count}</span>
    </label>
  );
}
