import React from "react";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  image?: string | null;
  featured?: boolean;
  _count?: {
    products: number;
  };
}

export default function CategoryCard({
  category,
}: {
  category: CategoryCardData;
  index?: number;
}) {
  const productCount = category._count?.products ?? 0;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E05A2B] hover:shadow-xl"
    >
      <div>
        {/* 16:9 Category Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#14171F]">
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.image}
              alt={category.name}
              className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#6B7280]">
              <FolderKanban className="h-12 w-12 opacity-40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14171F]/80 via-transparent to-transparent" />

          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between">
            <span className="rounded-lg bg-[#E05A2B] px-3 py-1 text-xs font-semibold text-white shadow-xs">
              {productCount} {productCount === 1 ? "Product" : "Products"}
            </span>
          </div>
        </div>

        {/* Category Text */}
        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-[#14171F] transition-colors group-hover:text-[#E05A2B]">
            {category.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4B5563]">
            {category.shortDescription ||
              category.description ||
              "Explore our range of durable hoses, sheets, and industrial supplies."}
          </p>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="flex items-center justify-between border-t border-[#F0ECE1] bg-[#FAF8F5] px-6 py-4 text-xs font-semibold text-[#14171F] transition-colors group-hover:bg-[#14171F] group-hover:text-white">
        <span>Explore {category.name}</span>
        <ArrowRight className="h-4 w-4 text-[#E05A2B] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
