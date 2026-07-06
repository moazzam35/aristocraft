"use client";

import { useEffect, useState } from "react";
import PlusIcon from "lucide-react/dist/esm/icons/plus";
import PencilIcon from "lucide-react/dist/esm/icons/pencil";
import Trash2Icon from "lucide-react/dist/esm/icons/trash-2";
import XIcon from "lucide-react/dist/esm/icons/x";

const emptyForm = {
  name: "",
  description: "",
  details: "",
  material: "",
  dimensions: "",
  weight: "",
  sku: "",
  brand: "",
  price: "",
  salePrice: "",
  stock: "",
  categoryId: "",
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  isOnSale: false,
  isActive: true,
  imageUrl: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products?showAll=true"),
        fetch("/api/categories"),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      if (productsData.success) setProducts(productsData.products);
      if (categoriesData.success) setCategories(categoriesData.categories);

      if (!productsData.success) setError(productsData.message || "Failed to load products.");
    } catch (err) {
      setError("Something went wrong loading products.");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  }

  function openEditModal(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      details: product.details || "",
      material: product.material || "",
      dimensions: product.dimensions || "",
      weight: product.weight?.toString() || "",
      sku: product.sku || "",
      brand: product.brand || "",
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || "",
      stock: product.stock.toString(),
      categoryId: product.categoryId,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isOnSale: product.isOnSale,
      isActive: product.isActive,
      imageUrl: product.images[0]?.url || "",
    });
    setFormError("");
    setShowModal(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.description || !form.price || !form.categoryId) {
      setFormError("Name, description, price, and category are required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      details: form.details || null,
      material: form.material || null,
      dimensions: form.dimensions || null,
      weight: form.weight || null,
      sku: form.sku || null,
      brand: form.brand || null,
      price: form.price,
      salePrice: form.salePrice || null,
      stock: form.stock || 0,
      categoryId: form.categoryId,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      isOnSale: form.isOnSale,
      isActive: form.isActive,
    };

    if (!editingId && form.imageUrl) {
      payload.images = [{ url: form.imageUrl, alt: form.name }];
    }

    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        setFormError(data.message || "Failed to save product.");
        setSaving(false);
        return;
      }

      setShowModal(false);
      loadData();
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (err) {
      alert("Something went wrong deleting the product.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] p-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-40 animate-pulse rounded-md bg-[#004b47]/10" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-[#004b47]/5" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-[10px] bg-[#004b47]/10" />
        </div>
        <div className="overflow-hidden rounded-[14px] border border-[#004b47]/10 bg-white">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse border-b border-[#004b47]/5 bg-white last:border-0"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] p-8 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C76F4D]">
            Aristocraft
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#1a1a1a] lg:text-4xl">
            Products
          </h1>
          <p className="mt-2 font-sans text-sm text-neutral-500">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-[10px] bg-[#004b47] px-5 py-3 font-sans text-sm font-semibold text-[#FAF6EF] shadow-[0_2px_12px_-2px_rgba(0,75,71,0.35)] transition-all duration-200 hover:bg-[#003733] hover:shadow-[0_4px_18px_-2px_rgba(0,75,71,0.45)] active:scale-[0.98]"
        >
          <PlusIcon size={16} strokeWidth={2} />
          Add Product
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-[12px] border border-[#C76F4D]/30 bg-[#C76F4D]/5 px-5 py-4 font-sans text-sm text-[#8f4a30]"
        >
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[14px] border border-[#004b47]/10 bg-white py-20 text-center shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
          <p className="font-sans text-sm text-neutral-500">
            No products yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[14px] border border-[#004b47]/10 bg-white shadow-[0_2px_20px_-4px_rgba(0,75,71,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-[#004b47]/10 bg-[#FAF6EF]/60">
                <tr>
                  <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Product
                  </th>
                  <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Category
                  </th>
                  <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Price
                  </th>
                  <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Stock
                  </th>
                  <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Status
                  </th>
                  <th className="px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#004b47]/5 transition-colors last:border-0 hover:bg-[#FAF6EF]/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-11 w-11 rounded-[8px] border border-[#004b47]/10 object-cover"
                          />
                        )}
                        <span className="font-sans text-sm font-semibold text-[#1a1a1a]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-sans text-sm text-neutral-600">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {product.salePrice ? (
                        <span className="flex flex-col">
                          <span className="font-serif text-sm font-semibold text-[#C76F4D]">
                            ${Number(product.salePrice).toFixed(2)}
                          </span>
                          <span className="font-sans text-xs text-neutral-400 line-through">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        </span>
                      ) : (
                        <span className="font-serif text-sm font-semibold text-[#1a1a1a]">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-sans text-sm text-neutral-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide ${
                          product.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-neutral-200 bg-neutral-50 text-neutral-500"
                        }`}
                      >
                        {product.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          aria-label={`Edit ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[#004b47] transition-colors duration-200 hover:bg-[#004b47]/8"
                        >
                          <PencilIcon size={15} strokeWidth={1.8} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          aria-label={`Delete ${product.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-[8px] text-neutral-500 transition-colors duration-200 hover:bg-[#C76F4D]/10 hover:text-[#C76F4D] disabled:opacity-50"
                        >
                          <Trash2Icon size={15} strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[14px] border border-[#004b47]/10 bg-white p-7 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between border-b border-[#004b47]/10 pb-5">
              <h2
                id="product-modal-title"
                className="font-serif text-xl font-semibold text-[#1a1a1a]"
              >
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 transition-colors duration-200 hover:bg-[#004b47]/8 hover:text-[#1a1a1a]"
              >
                <XIcon size={16} />
              </button>
            </div>

            {formError && (
              <div
                role="alert"
                className="mt-5 rounded-[12px] border border-[#C76F4D]/30 bg-[#C76F4D]/5 px-5 py-4 font-sans text-sm text-[#8f4a30]"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                >
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                >
                  Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  rows={2}
                  className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="price"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Price *
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                </div>
                <div>
                  <label
                    htmlFor="salePrice"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Sale Price (discount)
                  </label>
                  <input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    name="salePrice"
                    value={form.salePrice}
                    onChange={handleChange}
                    placeholder="Leave empty for no discount"
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="stock"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Stock
                  </label>
                  <input
                    id="stock"
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                </div>
                <div>
                  <label
                    htmlFor="categoryId"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Category *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="material"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Material
                  </label>
                  <input
                    id="material"
                    type="text"
                    name="material"
                    value={form.material}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                </div>
                <div>
                  <label
                    htmlFor="brand"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Brand
                  </label>
                  <input
                    id="brand"
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dimensions"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Dimensions
                  </label>
                  <input
                    id="dimensions"
                    type="text"
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleChange}
                    placeholder="e.g. 80x60x90 cm"
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                </div>
                <div>
                  <label
                    htmlFor="weight"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="sku"
                  className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                >
                  SKU
                </label>
                <input
                  id="sku"
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                />
              </div>

              {!editingId && (
                <div>
                  <label
                    htmlFor="imageUrl"
                    className="font-sans text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
                  >
                    Image URL
                  </label>
                  <input
                    id="imageUrl"
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="/images/sofa/green.jpg or full URL"
                    className="mt-2 w-full rounded-[10px] border border-[#004b47]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#1a1a1a] outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-[#004b47] focus:ring-2 focus:ring-[#004b47]/15"
                  />
                  <p className="mt-1.5 font-sans text-xs text-neutral-400">
                    Use a path from your /public/images folder, or a full image URL.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#004b47]/10 pt-5">
                <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#004b47]"
                  />
                  Featured
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={form.isNewArrival}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#004b47]"
                  />
                  New Arrival
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={form.isBestSeller}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#004b47]"
                  />
                  Best Seller
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    name="isOnSale"
                    checked={form.isOnSale}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#004b47]"
                  />
                  On Sale
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 font-sans text-sm text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#004b47]"
                  />
                  Active (visible on store)
                </label>
              </div>

              <div className="flex gap-3 border-t border-[#004b47]/10 pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[10px] bg-[#004b47] px-6 py-2.5 font-sans text-sm font-semibold text-[#FAF6EF] shadow-[0_2px_12px_-2px_rgba(0,75,71,0.35)] transition-all duration-200 hover:bg-[#003733] active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-[#004b47]"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-[10px] border border-[#004b47]/20 bg-white px-6 py-2.5 font-sans text-sm font-semibold text-[#004b47] transition-all duration-200 hover:bg-[#004b47]/5 active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}