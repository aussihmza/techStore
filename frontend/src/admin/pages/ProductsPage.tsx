import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createAdminProductApi,
  deleteAdminProductApi,
  getAdminProductsApi,
  updateAdminProductApi,
} from "@/admin/api/admin";
import AdminSuccessModal from "@/admin/components/AdminSuccessModal";
import ConfirmModal from "@/admin/components/ConfirmModal";
import { getCategoriesApi, type ApiCategory } from "@/user/api/categories";
import type { ApiProduct } from "@/user/api/products";
import { ApiError } from "@/lib/api/client";
import {
  formatStorageOptionsInput,
  normalizeStorageOptions,
} from "@/user/lib/storageOptions";

type FormState = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  quantity: string;
  image: string;
  gallery: string;
  description: string;
  storageOptions: string;
  isShop: boolean;
  isFeatured: boolean;
};

const emptyForm: FormState = {
  slug: "",
  name: "",
  category: "",
  brand: "",
  price: "",
  quantity: "",
  image: "",
  gallery: "",
  description: "",
  storageOptions: "",
  isShop: true,
  isFeatured: false,
};

function parseImageUrls(text: string) {
  return [
    ...new Set(
      text
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

function buildGallery(mainImage: string, galleryText: string) {
  const main = mainImage.trim();
  const extras = parseImageUrls(galleryText).filter((url) => url !== main);
  return main ? [main, ...extras] : extras;
}

/** Known catalog brands (seed + common store brands). */
const KNOWN_BRANDS = [
  "Apple",
  "Samsung",
  "Sony",
  "Canon",
  "Fujifilm",
  "Logitech",
  "Keychron",
  "Google",
  "Microsoft",
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "Bose",
  "JBL",
  "Anker",
];

const BRAND_OTHER = "__other__";

function uniqueSorted(values: string[]) {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [brandOther, setBrandOther] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(
    null,
  );

  const categoryOptions = useMemo(() => {
    const fromApi = categories.flatMap((c) => c.productCategories || []);
    const fromProducts = products.map((p) => p.category);
    return uniqueSorted([...fromApi, ...fromProducts, form.category]);
  }, [categories, products, form.category]);

  const brandOptions = useMemo(() => {
    const fromProducts = products.map((p) => p.brand);
    return uniqueSorted([...KNOWN_BRANDS, ...fromProducts]);
  }, [products]);

  const load = async () => {
    const data = await getAdminProductsApi();
    setProducts(data.products);
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAdminProductsApi(),
          getCategoriesApi(),
        ]);
        if (!active) return;
        setProducts(productsData.products);
        setCategories(categoriesData.categories);
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : "Load failed.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const startEdit = (product: ApiProduct) => {
    setEditingId(product.id);
    const priced = normalizeStorageOptions(product.storageOptions, product.price);
    const extraGallery = (product.gallery || []).filter(
      (url) => url && url !== product.image,
    );
    const knownBrands = uniqueSorted([
      ...KNOWN_BRANDS,
      ...products.map((p) => p.brand),
    ]);
    const isKnown = knownBrands.includes(product.brand);
    setBrandOther(!isKnown);
    setCustomBrand(isKnown ? "" : product.brand);
    setForm({
      slug: product.id,
      name: product.name,
      category: product.category,
      brand: isKnown ? product.brand : "",
      price: String(product.price),
      quantity: String(product.quantity ?? 100),
      image: product.image,
      gallery: extraGallery.join("\n"),
      description: product.description || "",
      storageOptions: formatStorageOptionsInput(priced),
      isShop: Boolean(product.isShop),
      isFeatured: Boolean(product.isFeatured),
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setBrandOther(false);
    setCustomBrand("");
    setForm(emptyForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const brand = brandOther ? customBrand.trim() : form.brand.trim();
    if (!brand) {
      setError(
        brandOther
          ? "Please enter a new brand name."
          : "Please select a brand.",
      );
      setSaving(false);
      return;
    }
    const quantity = Number(form.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a whole number (0 or more).");
      setSaving(false);
      return;
    }
    const gallery = buildGallery(form.image, form.gallery);
    const body = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      brand,
      price: Number(form.price),
      quantity,
      image: form.image.trim() || gallery[0] || "",
      description: form.description.trim(),
      storageOptions: form.storageOptions.trim(),
      isShop: form.isShop,
      isFeatured: form.isFeatured,
      gallery,
    };

    try {
      if (editingId) {
        await updateAdminProductApi(editingId, body);
        setSuccess({
          title: "Successfully updated",
          message: `${body.name} has been saved.`,
        });
      } else {
        await createAdminProductApi(body);
        setSuccess({
          title: "Successfully created",
          message: `${body.name} has been added to the catalog.`,
        });
      }
      await load();
      resetForm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    try {
      await deleteAdminProductApi(pendingDeleteId);
      await load();
      if (editingId === pendingDeleteId) resetForm();
      setPendingDeleteId(null);
      setSuccess({
        title: "Successfully deleted",
        message: "The product has been removed from the catalog.",
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading products...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Products</h2>
        <p className="mt-1 text-slate-500">Create, edit, or remove catalog items.</p>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2"
      >
        <h3 className="font-display text-lg font-bold sm:col-span-2">
          {editingId ? "Edit product" : "Add product"}
        </h3>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Slug (id)</span>
          <input
            required
            type="text"
            value={form.slug}
            disabled={Boolean(editingId)}
            placeholder="e.g. shop-pixel-9-pro"
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Name</span>
          <input
            required
            type="text"
            value={form.name}
            placeholder="e.g. Google Pixel 9 Pro"
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Category</span>
          <select
            required
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="" disabled>
              e.g. Smartphones
            </option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Brand</span>
          <select
            required
            value={brandOther ? BRAND_OTHER : form.brand}
            onChange={(e) => {
              const value = e.target.value;
              if (value === BRAND_OTHER) {
                setBrandOther(true);
                setForm((prev) => ({ ...prev, brand: "" }));
                return;
              }
              setBrandOther(false);
              setCustomBrand("");
              setForm((prev) => ({ ...prev, brand: value }));
            }}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="" disabled>
              e.g. Google
            </option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
            <option value={BRAND_OTHER}>Other</option>
          </select>
        </label>
        {brandOther ? (
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-slate-600">
              New brand name
            </span>
            <input
              required
              type="text"
              value={customBrand}
              placeholder="e.g. Nothing, OnePlus, Xiaomi"
              onChange={(e) => setCustomBrand(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        ) : null}
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Price</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
              $
            </span>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              placeholder="999"
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 py-2 pl-7 pr-3"
            />
          </div>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">Quantity</span>
          <input
            required
            type="number"
            step="1"
            min="0"
            value={form.quantity}
            placeholder="e.g. 25"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, quantity: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-slate-400">
            Available stock units. Use 0 for out of stock.
          </span>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-600">
            Main image URL
          </span>
          <input
            required
            type="text"
            value={form.image}
            placeholder=".jpg, .jpeg, .png, .webp, .gif, .svg"
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-slate-600">
            Gallery images (optional)
          </span>
          <textarea
            value={form.gallery}
            placeholder=".jpg, .jpeg, .png, .webp, .gif, .svg — one per line"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, gallery: e.target.value }))
            }
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs sm:text-sm"
          />
          <span className="mt-1 block text-xs text-slate-400">
            Add extra product photos — one URL per line (or comma-separated). Main
            image is included automatically.
          </span>
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-slate-600">Description</span>
          <textarea
            value={form.description}
            placeholder="e.g. Flagship Android phone with advanced camera and AI features."
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-slate-600">
            Storage / size SKUs
          </span>
          <input
            type="text"
            value={form.storageOptions}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, storageOptions: e.target.value }))
            }
            placeholder="e.g. 128GB:999, 256GB:1099, 512GB:1299"
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
          <span className="mt-1 block text-xs text-slate-400">
            Format: Label:Price, comma-separated. Leave empty for no variants.
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isShop}
            onChange={(e) => setForm((prev) => ({ ...prev, isShop: e.target.checked }))}
          />
          Show in shop
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
            }
          />
          Featured
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-semibold">{product.name}</td>
                <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3">{product.quantity ?? 100}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-sm font-semibold text-brand"
                      onClick={() => startEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-sm font-semibold text-rose-600"
                      onClick={() => setPendingDeleteId(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Delete this product?"
        message="This product will be removed from the shop catalog. This cannot be undone."
        confirmLabel="Delete product"
        busy={deleting}
        onCancel={() => {
          if (!deleting) setPendingDeleteId(null);
        }}
        onConfirm={() => void handleConfirmDelete()}
      />

      <AdminSuccessModal
        open={Boolean(success)}
        title={success?.title || ""}
        message={success?.message}
        onClose={() => setSuccess(null)}
      />
    </div>
  );
}
