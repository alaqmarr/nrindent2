import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getPublicSettings } from "@/lib/settings";
import ProductsCatalogClient from "@/components/products/ProductsCatalogClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return {
    title: "All Products — Hose Pipes, Rubber Sheets & Sealing Supplies",
    description: `Browse the complete catalog of PVC duct hoses, copper-coated steel wire hoses, canvas hoses, hydraulic hoses, silicone rubber sheets, rubber mats, Teflon tapes, and asbestos cloth by ${settings.companyName}.`,
    alternates: {
      canonical: "/products",
    },
  };
}

export default async function ProductsPage() {
  const [settings, products, categories] = await Promise.all([
    getPublicSettings(),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] pb-20">
      {/* Full-Width Page Header */}
      <div className="w-full border-b border-[#E5E0D5] bg-[#14171F] py-14 text-white">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <span className="inline-block rounded-lg bg-[#E05A2B]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">
            Complete Product Catalog
          </span>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Hose Pipes, Rubber Sheets & Sealing Products
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#D5D8DF] sm:text-base">
            Supplying residential, commercial, and heavy industrial customers
            with durable hoses, rubber sheets, mats, Teflon tapes, and thermal
            insulation textiles.
          </p>
        </div>
      </div>

      {/* Full-Width Catalog Content */}
      <div className="mt-10 w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <ProductsCatalogClient
          products={products}
          categories={categories}
          whatsappNumber={settings.whatsappNumber}
          adminEmail={settings.adminEmail}
          companyName={settings.companyName}
        />
      </div>
    </div>
  );
}
