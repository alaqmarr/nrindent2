import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers } from "lucide-react";
import ProductEnquireButtons from "@/components/inquiry/ProductEnquireButtons";
import { safeJsonParse } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  shortDescription?: string | null;
  description: string;
  image?: string | null;
  specifications?: string | null;
  priceLabel?: string | null;
  minOrderQty?: string | null;
  unit?: string | null;
  inStock: boolean;
  featured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductCardProps {
  product: ProductCardData;
  whatsappNumber: string;
  adminEmail: string;
  companyName?: string;
}

export default function ProductCard({
  product,
  whatsappNumber,
  adminEmail,
  companyName = "NR Industrial Enterprises",
}: ProductCardProps) {
  const specs = safeJsonParse<Array<{ label: string; value: string }>>(
    product.specifications,
    []
  ).slice(0, 2);

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E05A2B] hover:shadow-xl">
      <div>
        {/* 4:3 Image Frame */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-[#14171F]"
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#6B7280]">
              <Layers className="h-12 w-12 opacity-40" />
            </div>
          )}

          {/* Top Category & Stock Badges */}
          <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2">
            {product.category ? (
              <span className="rounded-lg bg-[#14171F]/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                {product.category.name}
              </span>
            ) : (
              <span />
            )}

            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#14171F] shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
              {product.inStock ? "In Stock" : "Available on Order"}
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-5">
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-display line-clamp-2 text-lg font-bold leading-snug text-[#14171F] transition-colors group-hover:text-[#E05A2B]">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#4B5563]">
            {product.shortDescription || product.description}
          </p>

          {/* Key Specs Preview */}
          {specs.length > 0 && (
            <div className="mt-4 space-y-1.5 rounded-xl bg-[#FAF8F5] p-3 text-xs">
              {specs.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-[#6B7280]">{s.label}:</span>
                  <span className="truncate font-semibold text-[#14171F]">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-[#F0ECE1] bg-[#FAF8F5]/60 px-5 pb-5 pt-3.5">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-[#6B7280]">
            Min. Order:{" "}
            <strong className="text-[#14171F]">
              {product.minOrderQty || "1 Unit"}
            </strong>
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-[#E05A2B] hover:underline"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ProductEnquireButtons
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            categoryName: product.category?.name,
            minOrderQty: product.minOrderQty,
            image: product.image,
          }}
          whatsappNumber={whatsappNumber}
          adminEmail={adminEmail}
          companyName={companyName}
          variant="card"
        />
      </div>
    </article>
  );
}
