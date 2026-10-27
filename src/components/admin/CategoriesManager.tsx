"use client";

import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  FolderKanban,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import ImageUploadCropper from "./ImageUploadCropper";
import { slugify } from "@/lib/utils";

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  image?: string | null;
  bannerImage?: string | null;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  _count?: { products: number };
}

export default function CategoriesManager({
  initialCategories,
  onRefresh,
}: {
  initialCategories: AdminCategory[];
  onRefresh: () => Promise<void>;
}) {
  const [categories, setCategories] =
    useState<AdminCategory[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [featured, setFeatured] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setShortDescription("");
    setDescription("");
    setImage("");
    setBannerImage("");
    setFeatured(true);
    setIsActive(true);
    setSortOrder(categories.length + 1);
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: AdminCategory) => {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setShortDescription(c.shortDescription || "");
    setDescription(c.description || "");
    setImage(c.image || "");
    setBannerImage(c.bannerImage || "");
    setFeatured(c.featured);
    setIsActive(c.isActive);
    setSortOrder(c.sortOrder || 0);
    setMetaTitle(c.metaTitle || "");
    setMetaDescription(c.metaDescription || "");
    setMetaKeywords(c.metaKeywords || "");
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
        shortDescription,
        description,
        image,
        bannerImage: bannerImage || image,
        featured,
        isActive,
        sortOrder: Number(sortOrder) || 0,
        metaTitle,
        metaDescription,
        metaKeywords,
      };

      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setIsModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (
      !window.confirm(
        `Delete category "${catName}" and all associated products?`
      )
    )
      return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      await onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Categories Management ({categories.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage industrial product divisions, 16:9 cropped Cloudflare R2
            banners, and category SEO.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-500"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-900">
                {cat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <FolderKanban className="h-10 w-10 opacity-40" />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded bg-slate-900/85 px-2.5 py-1 text-[10px] font-bold text-white">
                  {cat._count?.products ?? 0} Products
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-slate-900">
                  {cat.name}
                </h3>
                <Link
                  href={`/categories/${cat.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-600 hover:underline"
                >
                  <span>/categories/{cat.slug}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </Link>
                <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                  {cat.shortDescription || cat.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-[11px] font-semibold text-slate-500">
                Order: #{cat.sortOrder}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
              <h3 className="text-base font-bold">
                {editingId ? "Edit Category" : "Create New Category"}
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
              className="flex-1 space-y-4 overflow-y-auto p-6"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingId) setSlug(slugify(e.target.value));
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 font-mono text-xs"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <ImageUploadCropper
                  value={image}
                  onChange={setImage}
                  folder="categories"
                  defaultAspect={16 / 9}
                  label="Category Image (16:9 Client Display Crop + R2 Upload)"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Short Summary
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Full Category Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                />
              </div>

              <div className="flex gap-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
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
                  Active / Published
                </label>
              </div>

              {/* SEO */}
              <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase text-slate-700">
                  Category SEO Metadata
                </p>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Custom Meta Title"
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                />
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Custom Meta Description"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-500"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {editingId ? "Update Category" : "Create Category"}
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
