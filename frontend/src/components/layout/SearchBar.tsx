import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Product } from "@/types/product";
import { getProductsApi, toProductCard } from "@/lib/api/products";
import { searchProducts } from "@/utils/shopFilters";
import ProductImage from "@/components/ui/ProductImage";
import { SearchIcon } from "@/components/ui/icons";

interface SearchBarProps {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export default function SearchBar({
  className = "",
  inputClassName = "w-36 md:w-44 xl:w-64",
  autoFocus = false,
  onNavigate,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    getProductsApi()
      .then((data) => {
        if (active) setProducts(data.products.map(toProductCard));
      })
      .catch(() => {
        if (active) setProducts([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const suggestions = useMemo(() => {
    if (query.trim().length < 1) return [];
    return searchProducts(products, query).slice(0, 6);
  }, [products, query]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const goToResults = (value: string) => {
    const q = value.trim();
    setOpen(false);
    onNavigate?.();
    if (!q) {
      navigate("/shop");
      return;
    }
    navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goToResults(query);
        }}
        className={`flex items-center border border-slate-200/90 bg-white/80 shadow-sm shadow-slate-900/5 transition-shadow focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/15 ${
          className.includes("w-full")
            ? "w-full rounded-xl px-4 py-3"
            : "rounded-full px-4 py-2.5"
        }`}
      >
        <button type="submit" aria-label="Search" className="text-slate-400 hover:text-brand">
          <SearchIcon className="h-5 w-5" />
        </button>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Search products..."
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open && suggestions.length > 0}
          className={`bg-transparent px-2 text-base text-slate-700 outline-none placeholder:text-slate-400 ${inputClassName}`}
        />
      </form>

      {open && query.trim().length > 0 && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-xl animate-fade-in sm:left-auto sm:right-0 sm:w-[min(100vw-2rem,22rem)]"
        >
          {suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-2">
              {suggestions.map((product) => (
                <li key={product.id} role="option">
                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100 p-1">
                      <ProductImage
                        src={product.image}
                        alt=""
                        fit="contain"
                        className="h-full w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
                      <p className="text-xs text-slate-400">
                        {product.brand} · {product.category}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-brand">
                      $
                      {product.price.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              No products match “{query.trim()}”
            </p>
          )}

          <button
            type="button"
            onClick={() => goToResults(query)}
            className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
          >
            <SearchIcon className="h-4 w-4" />
            {suggestions.length > 0
              ? `View all results for “${query.trim()}”`
              : "Search in shop"}
          </button>
        </div>
      )}
    </div>
  );
}
