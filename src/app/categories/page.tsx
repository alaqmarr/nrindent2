import React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getPublicSettings } from "@/lib/settings";
import CategoryCard from "@/components/categories/CategoryCard";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return {
    title: "Product Categories — Hose Pipes, Rubber Sheets & Sealing Supplies",
    description: `Browse our product categories including Hose Pipes & Ducts, Industrial Linings & Rubber Sheets, and Sealing & Textiles by ${settings.companyName}.`,
    alternates: {
      canonical: "/categories",
    },
  };
}

export default async function CategoriesPage() {
  const [settings, categories] = await Promise.all([
    getPublicSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] pb-20">
      <div className="w-full border-b border-[#E5E0D5] bg-[#14171F] py-14 text-white">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <span className="inline-block rounded-lg bg-[#E05A2B]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">
            {settings.companyName}
          </span>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Product Categories
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#D5D8DF] sm:text-base">
            Choose a category below to browse available sizes, specifications,
            and send a quick inquiry via WhatsApp or Email.
          </p>
        </div>
      </div>

      <div className="mt-10 w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
