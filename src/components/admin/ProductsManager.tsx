"use client";

import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Check,
  Loader2,
  Star,
  Package,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import ImageUploadCropper from "./ImageUploadCropper";
import { safeJsonParse, slugify } from "@/lib/utils";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string | null;
  description: string;
  image?: string | null;
  gallery: string;
  specifications: string;
  features: string;
  applications: string;
  priceLabel?: string | null;
  minOrderQty?: string | null;
  unit?: string | null;
  inStock: boolean;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
}

interface ProductsManagerProps {
  initialProducts: AdminProduct[];
  categories: Array<{ id: string; name: string; slug: string }>;
  onRefresh: () => Promise<void>;
}

export default function ProductsManager({
  initialProducts,
  categories,
  onRefresh,
}: ProductsManagerProps) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [galleryList, setGalleryList] = useState<string[]>([]);
  const [newGalleryImage, setNewGalleryImage] = useState("");
  const [specs, setSpecs] = useState<Array<{ label: string; value: string }>>([
    { label: "Material Grade", value: "SS 316 / ASTM A105" },
    { label: "Standard", value: "ASME / API Certified" },
  ]);
  const [featuresText, setFeaturesText] = useState("");
  const [applicationsText, setApplicationsText] = useState("");
  const [priceLabel, setPriceLabel] = useState("Request a Quote");
  const [minOrderQty, setMinOrderQty] = useState("1 Unit");
  const [unit, setUnit] = useState("Unit");
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSku(`NR-IND-${Math.floor(1000 + Math.random() * 9000)}`);
    setCategoryId(categories[0]?.id || "");
    setShortDescription("");
    setDescription("");
    setImage("");
    setGalleryList([]);
    setNewGalleryImage("");
    setSpecs([
      { label: "Material Grade", value: "ASTM A105 / SS 316L" },
      { label: "Pressure Rating", value: "Class 150 - Class 600" },
    ]);
    setFeaturesText(
      "100% Hydrostatic & Pneumatic Tested\nISO 9001:2015 Certified Manufacturing"
    );
    setApplicationsText("Oil & Gas Refineries\nChemical Processing Plants");
    setPriceLabel("Request a Quote");
    setMinOrderQty("1 Unit");
    setUnit("Unit");
    setInStock(true);
    setFeatured(false);
    setIsActive(true);
    setSortOrder(0);
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: AdminProduct) => {
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setSku(p.sku || "");
    setCategoryId(p.categoryId);
    setShortDescription(p.shortDescription || "");
    setDescription(p.description);
    setImage(p.image || "");
    setGalleryList(safeJsonParse<string[]>(p.gallery, []));
    setNewGalleryImage("");
    setSpecs(
      safeJsonParse<Array<{ label: string; value: string }>>(p.specifications, [
        { label: "", value: "" },
      ])
    );
    setFeaturesText(safeJsonParse<string[]>(p.features, []).join("\n"));
    setApplicationsText(safeJsonParse<string[]>(p.applications, []).join("\n"));
    setPriceLabel(p.priceLabel || "Request a Quote");
    setMinOrderQty(p.minOrderQty || "1 Unit");
    setUnit(p.unit || "Unit");
    setInStock(p.inStock);
    setFeatured(p.featured);
    setIsActive(p.isActive);
    setSortOrder(p.sortOrder || 0);
    setMetaTitle(p.metaTitle || "");
    setMetaDescription(p.metaDescription || "");
    setMetaKeywords(p.metaKeywords || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name,
        slug: slug || slugify(name),
        sku,
        categoryId,
        shortDescription,
        description,
        image,
        gallery: galleryList.filter(Boolean),
        specifications: specs.filter((s) => s.label.trim() && s.value.trim()),
        features: featuresText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        applications: applicationsText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        priceLabel,
        minOrderQty,
        unit,
        inStock,
        featured,
        isActive,
        sortOrder: Number(sortOrder) || 0,
        metaTitle,
        metaDescription,
        metaKeywords,
      };

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setIsModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!window.confirm(`Delete product "${prodName}" permanently?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      await onRefresh();
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Products Management ({products.length})
          </h2>
          <p className="text-xs text-slate-500">
            Create, edit, crop images for Cloudflare R2, and manage technical
            specifications & SEO.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-500"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter products by name, SKU, or category..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-900 text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-3.5">Product</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-11 w-14 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Package className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{p.name}</p>
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] text-orange-600 hover:underline"
                        >
                          <span>/products/{p.slug}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                    {p.sku || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">
                    {p.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {p.isActive ? "Active" : "Draft"}
                      </span>
                      {p.featured && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-700">
                          <Star className="h-2.5 w-2.5 fill-orange-500" />
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
              <h3 className="text-base font-bold">
                {editingId ? "Edit Industrial Product" : "Create New Industrial Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex-1 space-y-6 overflow-y-auto p-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Primary Details */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="sm:col-span-6">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingId) setSlug(slugify(e.target.value));
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    SKU / Part Number
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 font-mono text-xs text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Price Label
                  </label>
                  <input
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    MOQ
                  </label>
                  <input
                    type="text"
                    value={minOrderQty}
                    onChange={(e) => setMinOrderQty(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Primary Image Upload with Crop Window (4:3 Client Display Size) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <ImageUploadCropper
                  value={image}
                  onChange={setImage}
                  folder="products"
                  defaultAspect={4 / 3}
                  label="Primary Product Image (4:3 Client Card & Detail Display)"
                  helperText="Drop an image to launch the 4:3 (1000×750px) client display crop window and upload to Cloudflare R2."
                />
              </div>

              {/* Additional Gallery Images */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  Additional Gallery Images ({galleryList.length})
                </p>
                {galleryList.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-3">
                    {galleryList.map((gUrl, idx) => (
                      <div
                        key={idx}
                        className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-300 bg-white"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={gUrl}
                          alt="Gallery"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setGalleryList((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute right-1 top-1 rounded bg-red-600 p-1 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <ImageUploadCropper
                  value={newGalleryImage}
                  onChange={(url) => {
                    if (url) {
                      setGalleryList((prev) => [...prev, url]);
                      setNewGalleryImage("");
                    }
                  }}
                  folder="products"
                  defaultAspect={4 / 3}
                  label="Add Image to Product Gallery (4:3 Crop + R2 Upload)"
                />
              </div>

              {/* Short & Full Description */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Short Summary (Displayed on Product Cards)
                  </label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Concise 1-2 sentence overview..."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Detailed Engineering Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3.5 text-sm"
                  />
                </div>
              </div>

              {/* Dynamic Technical Specifications Table Builder */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Technical Specifications Table
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSpecs((prev) => [...prev, { label: "", value: "" }])
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-orange-600"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Parameter Row
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => {
                          const next = [...specs];
                          next[idx].label = e.target.value;
                          setSpecs(next);
                        }}
                        placeholder="Parameter (e.g. Pressure Rating)"
                        className="w-2/5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => {
                          const next = [...specs];
                          next[idx].value = e.target.value;
                          setSpecs(next);
                        }}
                        placeholder="Value (e.g. ASME Class 150 - 600)"
                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSpecs((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features & Applications */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Key Features (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Industrial Applications (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={applicationsText}
                    onChange={(e) => setApplicationsText(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs"
                  />
                </div>
              </div>

              {/* Toggles & SEO */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-4 w-4 accent-orange-600"
                  />
                  In Stock / Ready Supply
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 accent-orange-600"
                  />
                  Featured on Home Page
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 accent-orange-600"
                  />
                  Published (Visible on Site)
                </label>
              </div>

              {/* SEO Metadata */}
              <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Search Engine Optimization (SEO Metadata)
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Custom Meta Title
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Defaults to Product Name + SKU"
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Meta Keywords (comma separated)
                    </label>
                    <input
                      type="text"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Custom Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-500 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving & Revalidating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {editingId ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
