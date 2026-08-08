import { useEffect, useState, type FormEvent } from "react";
import {
  createAdminProductApi,
  deleteAdminProductApi,
  getAdminProductsApi,
  updateAdminProductApi,
} from "@/admin/api/admin";
import type { ApiProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";

type FormState = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  image: string;
  description: string;
  isShop: boolean;
  isFeatured: boolean;
};

const emptyForm: FormState = {
  slug: "",
  name: "",
  category: "",
  brand: "",
  price: "",
  image: "",
  description: "",
  isShop: true,
  isFeatured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await getAdminProductsApi();
    setProducts(data.products);
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        await load();
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
    setForm({
      slug: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: String(product.price),
      image: product.image,
      description: product.description || "",
      isShop: Boolean(product.isShop),
      isFeatured: Boolean(product.isFeatured),
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      description: form.description.trim(),
      isShop: form.isShop,
      isFeatured: form.isFeatured,
      gallery: form.image.trim() ? [form.image.trim()] : [],
    };

    try {
      if (editingId) {
        await updateAdminProductApi(editingId, body);
      } else {
        await createAdminProductApi(body);
      }
      await load();
      resetForm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteAdminProductApi(id);
      await load();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
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
        {(
          [
            ["slug", "Slug (id)"],
            ["name", "Name"],
            ["category", "Category"],
            ["brand", "Brand"],
            ["price", "Price"],
            ["image", "Image URL"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">{label}</span>
            <input
              required
              type={key === "price" ? "number" : "text"}
              step={key === "price" ? "0.01" : undefined}
              value={form[key]}
              disabled={Boolean(editingId) && key === "slug"}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        ))}
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-slate-600">Description</span>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
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
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-slate-50">
                <td className="px-4 py-3 font-semibold">{product.name}</td>
                <td className="px-4 py-3">${product.price.toFixed(2)}</td>
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
                      onClick={() => void handleDelete(product.id)}
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
    </div>
  );
}
