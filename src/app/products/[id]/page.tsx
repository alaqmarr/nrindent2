import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getPublicSettings } from "@/lib/settings";
import { safeJsonParse } from "@/lib/utils";
import ProductEnquireButtons from "@/components/inquiry/ProductEnquireButtons";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/products/ProductCard";

export const revalidate = 60;

async function findProductByIdOrSlug(idOrSlug: string) {
  return prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: true,
    },
  });
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, slug: true },
  });

  const params: Array<{ id: string }> = [];
  for (const p of products) {
    params.push({ id: p.slug });
    params.push({ id: p.id });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    findProductByIdOrSlug(id),
    getPublicSettings(),
  ]);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = product.metaTitle || product.name;
  const description =
    product.metaDescription || product.shortDescription || product.description;

  return {
    title,
    description,
    keywords: product.metaKeywords
      ? product.metaKeywords.split(",").map((k) => k.trim())
      : [
          product.name,
          product.sku || "",
          product.category.name,
          settings.companyName,
        ],
    openGraph: {
      title,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    findProductByIdOrSlug(id),
    getPublicSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
    take: 4,
  });

  const gallery = safeJsonParse<string[]>(product.gallery, []);
  const specifications = safeJsonParse<Array<{ label: string; value: string }>>(
    product.specifications,
    []
  );
  const features = safeJsonParse<string[]>(product.features, []);
  const applications = safeJsonParse<string[]>(product.applications, []);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku || product.id,
    description: product.shortDescription || product.description,
    image: product.image ? [product.image, ...gallery] : undefined,
    brand: {
      "@type": "Brand",
      name: settings.companyName,
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: {
        "@type": "Organization",
        name: settings.companyName,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Full-Width Breadcrumb Bar */}
      <div className="w-full border-b border-[#E5E0D5] bg-white">
        <div className="flex w-full flex-wrap items-center gap-2 px-5 py-3.5 text-xs text-[#6B7280] sm:px-8 lg:px-12 xl:px-16">
          <Link href="/" className="hover:text-[#14171F]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:text-[#14171F]">
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-[#14171F]"
          >
            {product.category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[#14171F]">{product.name}</span>
        </div>
      </div>

      {/* Full-Width Main Product Section */}
      <div className="mt-8 w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left 6 Cols: Image Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery
              primaryImage={product.image}
              gallery={gallery}
              name={product.name}
              sku={product.sku}
            />
          </div>

          {/* Right 6 Cols: Product Info & Pre-Filled Inquiry Buttons */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-xs sm:p-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="rounded-lg bg-[#E05A2B]/10 px-3 py-1 text-xs font-semibold text-[#E05A2B] hover:bg-[#E05A2B] hover:text-white"
                >
                  {product.category.name}
                </Link>
                {product.sku && (
                  <span className="rounded-lg bg-[#FAF8F5] px-3 py-1 font-mono text-xs font-medium text-[#4B5563]">
                    Code: {product.sku}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {product.inStock ? "In Stock & Ready to Ship" : "Available on Order"}
                </span>
              </div>

              <h1 className="font-display mt-4 text-2xl font-bold text-[#14171F] sm:text-4xl">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563] sm:text-base">
                  {product.shortDescription}
                </p>
              )}

              {/* Key Order Details */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] p-4">
                <div>
                  <span className="block text-[11px] text-[#6B7280]">
                    Price
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-[#14171F]">
                    {product.priceLabel || "Get Latest Price"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-[#6B7280]">
                    Minimum Order
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-[#E05A2B]">
                    {product.minOrderQty || "1 Roll / Unit"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-[#6B7280]">
                    Supply Unit
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-[#14171F]">
                    {product.unit || "Meter / Roll"}
                  </span>
                </div>
              </div>

              {/* Dual Pre-Filled Enquire Box */}
              <div className="mt-6 rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-5">
                <p className="mb-3 text-xs font-semibold text-[#374151]">
                  Interested in this product? Click below to enquire with
                  details pre-filled:
                </p>
                <ProductEnquireButtons
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    categoryName: product.category.name,
                    minOrderQty: product.minOrderQty,
                    image: product.image,
                  }}
                  whatsappNumber={settings.whatsappNumber}
                  adminEmail={settings.adminEmail}
                  companyName={settings.companyName}
                  variant="detail"
                />
              </div>

              {/* Store Assurances */}
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#F0ECE1] pt-5 text-xs text-[#4B5563] sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#E05A2B]" />
                  <span>Quality Tested Industrial & Commercial Grade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#16A34A]" />
                  <span>Bulk & Retail Dispatch from Secunderabad</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications, Description, Features & Common Uses */}
        <div className="mt-10 grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 7 Cols: Specifications Table & Full Description */}
          <div className="space-y-8 lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white shadow-xs">
              <div className="border-b border-[#E5E0D5] bg-[#14171F] px-6 py-4 text-white">
                <h2 className="font-display text-base font-bold">
                  Product Specifications & Available Sizes
                </h2>
              </div>

              {specifications.length > 0 ? (
                <table className="w-full border-collapse text-left text-sm">
                  <tbody className="divide-y divide-[#F0ECE1]">
                    {specifications.map((spec, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]"}
                      >
                        <th className="w-2/5 px-6 py-3.5 font-semibold text-[#4B5563]">
                          {spec.label}
                        </th>
                        <td className="px-6 py-3.5 font-semibold text-[#14171F]">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-sm text-[#6B7280]">
                  Multiple sizes and roll lengths available in stock. Contact us
                  for specific sizes.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-display text-xl font-bold text-[#14171F]">
                Product Overview & Details
              </h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#374151] sm:text-base">
                {product.description}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Key Features & Common Uses */}
          <div className="space-y-6 lg:col-span-5">
            {features.length > 0 && (
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 text-lg font-bold text-[#14171F]">
                  <Sparkles className="h-5 w-5 text-[#E05A2B]" />
                  <h3 className="font-display">Key Highlights</h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-[#374151]"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {applications.length > 0 && (
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 text-lg font-bold text-[#14171F]">
                  <Layers className="h-5 w-5 text-[#E05A2B]" />
                  <h3 className="font-display">Where It Is Used</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {applications.map((app, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#14171F]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products in Same Category */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-[#E5E0D5] pt-12">
            <h2 className="font-display text-2xl font-bold text-[#14171F] sm:text-3xl">
              More Products in {product.category.name}
            </h2>
            <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  whatsappNumber={settings.whatsappNumber}
                  adminEmail={settings.adminEmail}
                  companyName={settings.companyName}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
