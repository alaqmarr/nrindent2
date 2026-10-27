import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FolderKanban } from "lucide-react";
import prisma from "@/lib/prisma";
import { getPublicSettings } from "@/lib/settings";
import ProductCard from "@/components/products/ProductCard";

export const revalidate = 60;

async function findCategoryByIdOrSlug(idOrSlug: string) {
  return prisma.category.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      products: {
        where: { isActive: true },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      },
    },
  });
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, slug: true },
  });

  const params: Array<{ id: string }> = [];
  for (const c of categories) {
    params.push({ id: c.slug });
    params.push({ id: c.id });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [category, settings] = await Promise.all([
    findCategoryByIdOrSlug(id),
    getPublicSettings(),
  ]);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = category.metaTitle || `${category.name} Products`;
  const description =
    category.metaDescription ||
    category.shortDescription ||
    category.description ||
    `Explore ${category.name} supplied by ${settings.companyName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: category.image ? [{ url: category.image }] : undefined,
    },
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [category, settings, allCategories] = await Promise.all([
    findCategoryByIdOrSlug(id),
    getPublicSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] pb-20">
      {/* Full-Width Category Header */}
      <div className="relative w-full overflow-hidden border-b border-[#E5E0D5] bg-[#14171F] py-14 text-white">
        {(category.bannerImage || category.image) && (
          <div className="absolute inset-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(category.bannerImage || category.image) as string}
              alt={category.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="relative w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#9CA3AF]">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-[#F59E0B]">{category.name}</span>
          </div>

          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#D5D8DF] sm:text-base">
            {category.description || category.shortDescription}
          </p>
        </div>
      </div>

      {/* Category Switcher & Products Grid */}
      <div className="mt-8 w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-[#E5E0D5] bg-white p-3">
          <span className="mr-2 text-xs font-semibold text-[#6B7280]">
            Browse Category:
          </span>
          {allCategories.map((c) => {
            const active = c.id === category.id;
            return (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-[#E05A2B] text-white"
                    : "bg-[#FAF8F5] text-[#374151] hover:bg-[#F0ECE1]"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>

        {category.products.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-12 text-center">
            <FolderKanban className="mx-auto h-12 w-12 text-[#6B7280]" />
            <h3 className="font-display mt-3 text-lg font-bold text-[#14171F]">
              No products listed in this category yet
            </h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Contact us directly for availability in {category.name}.
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsappNumber}
                adminEmail={settings.adminEmail}
                companyName={settings.companyName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
