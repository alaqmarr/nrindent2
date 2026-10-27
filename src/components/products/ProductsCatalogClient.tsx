"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, LayoutGrid, List, ArrowRight } from "lucide-react";
import ProductCard, { ProductCardData } from "./ProductCard";
import ProductEnquireButtons from "@/components/inquiry/ProductEnquireButtons";

interface ProductsCatalogClientProps {
  products: ProductCardData[];
  categories: Array<{ id: string; name: string; slug: string }>;
  whatsappNumber: string;
  adminEmail: string;
  companyName: string;
  initialCategorySlug?: string;
}

export default function ProductsCatalogClient({
  products,
  categories,
  whatsappNumber,
  adminEmail,
  companyName,
  initialCategorySlug = "all",
}: ProductsCatalogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlug);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "all" && p.category?.slug !== selectedCategory) {
        return false;
      }
      if (onlyInStock && !p.inStock) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = (p.sku || "").toLowerCase().includes(q);
        const matchDesc = (p.shortDescription || p.description)
          .toLowerCase()
          .includes(q);
        const matchCat = (p.category?.name || "").toLowerCase().includes(q);
        return matchName || matchSku || matchDesc || matchCat;
      }
      return true;
    });
  }, [products, selectedCategory, onlyInStock, search]);

  return (
    <div className="w-full space-y-8">
      {/* Search & Category Filter Bar */}
      <div className="w-full rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-xs">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-12">
          {/* Search Box */}
          <div className="relative lg:col-span-6">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for PVC duct hose, silicone sheet, rubber mat, Teflon tape..."
              className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] py-3 pl-11 pr-10 text-sm text-[#14171F] placeholder:text-[#6B7280] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 rounded-md p-1 text-[#6B7280] hover:bg-black/5 hover:text-[#14171F]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* In-Stock Filter */}
          <div className="flex items-center lg:col-span-3">
            <label className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-xs font-semibold text-[#14171F] hover:bg-[#F3EFE6]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="h-4 w-4 rounded accent-[#E05A2B]"
              />
              <span>Show In-Stock Items Only</span>
            </label>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center gap-2 lg:col-span-3">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-xs font-semibold transition ${
                viewMode === "grid"
                  ? "border-[#14171F] bg-[#14171F] text-white"
                  : "border-[#D5CFC2] bg-[#FAF8F5] text-[#374151] hover:bg-[#F3EFE6]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Card View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border py-3 text-xs font-semibold transition ${
                viewMode === "list"
                  ? "border-[#14171F] bg-[#14171F] text-white"
                  : "border-[#D5CFC2] bg-[#FAF8F5] text-[#374151] hover:bg-[#F3EFE6]"
              }`}
            >
              <List className="h-4 w-4" />
              <span>Table View</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#F0ECE1] pt-4">
          <span className="mr-1 text-xs font-semibold text-[#6B7280]">
            Categories:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
              selectedCategory === "all"
                ? "bg-[#E05A2B] text-white"
                : "bg-[#FAF8F5] text-[#374151] hover:bg-[#F0ECE1]"
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === cat.slug
                  ? "bg-[#14171F] text-white"
                  : "bg-[#FAF8F5] text-[#374151] hover:bg-[#F0ECE1]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#6B7280]">
        <p>
          Showing{" "}
          <strong className="text-[#14171F]">{filteredProducts.length}</strong>{" "}
          of <strong className="text-[#14171F]">{products.length}</strong>{" "}
          products
        </p>
        {(search || selectedCategory !== "all" || onlyInStock) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setOnlyInStock(false);
            }}
            className="font-semibold text-[#E05A2B] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Cards or Table */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E0D5] bg-white p-12 text-center">
          <p className="font-display text-lg font-bold text-[#14171F]">
            No matching products found
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">
            Try clearing your search filter or contact us directly on WhatsApp
            for custom sizes.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={whatsappNumber}
              adminEmail={adminEmail}
              companyName={companyName}
            />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-[#E5E0D5] bg-white shadow-xs">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5E0D5] bg-[#14171F] text-xs font-semibold uppercase tracking-wider text-white">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Min. Order</th>
                <th className="px-5 py-4">Availability</th>
                <th className="px-5 py-4 text-right">Quick Enquire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE1]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      {p.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-16 shrink-0 rounded-lg border border-[#E5E0D5] object-cover"
                        />
                      )}
                      <div>
                        <Link
                          href={`/products/${p.slug}`}
                          className="font-display inline-flex items-center gap-1 font-bold text-[#14171F] hover:text-[#E05A2B]"
                        >
                          <span>{p.name}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs text-[#6B7280]">
                          {p.shortDescription || p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#374151]">
                    {p.category?.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#14171F]">
                    {p.minOrderQty || "1 Unit"}
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {p.inStock ? "In Stock" : "Available on Order"}
                    </span>
                  </td>
                  <td className="w-64 px-5 py-4">
                    <ProductEnquireButtons
                      product={{
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        sku: p.sku,
                        categoryName: p.category?.name,
                        minOrderQty: p.minOrderQty,
                        image: p.image,
                      }}
                      whatsappNumber={whatsappNumber}
                      adminEmail={adminEmail}
                      companyName={companyName}
                      variant="card"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
