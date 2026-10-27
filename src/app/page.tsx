import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Building2,
  Factory,
  Truck,
  ShieldCheck,
  Sparkles,
  Phone,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import prisma from "@/lib/prisma";
import { getPublicSettings } from "@/lib/settings";
import { buildWhatsAppInquiryUrl, safeJsonParse } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import CategoryCard from "@/components/categories/CategoryCard";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, featuredCategories, featuredProducts] = await Promise.all([
    getPublicSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      take: 8,
    }),
  ]);

  const stats = safeJsonParse<Array<{ label: string; value: string }>>(
    settings.statsJson,
    [
      { label: "Product Varieties", value: "250+" },
      { label: "Happy Clients", value: "1,500+" },
      { label: "Sectors Served", value: "Residential, Commercial & Industrial" },
      { label: "Stock Availability", value: "Ready Dispatch" },
    ]
  );

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber: settings.whatsappNumber,
    companyName: settings.companyName,
    customMessage: settings.whatsappDefaultMsg,
  });

  return (
    <div className="w-full bg-[#FAF8F5] text-[#14171F]">
      {/* FULL-WIDTH HERO SECTION */}
      <section className="relative w-full overflow-hidden border-b border-[#E5E0D5] bg-[#14171F] text-white">
        <div className="w-full px-5 py-14 sm:px-8 lg:px-12 lg:py-20 xl:px-16">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left 7 Columns: Headline & CTAs */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#F59E0B]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{settings.heroBadge}</span>
              </div>

              <h1 className="font-display mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {settings.heroTitle}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#D5D8DF] sm:text-lg">
                {settings.heroSubtitle}
              </p>

              {/* Core Product Highlights Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Heavy-Duty PVC Duct Hoses",
                  "Copper-Coated Steel Wire Hoses",
                  "Canvas & Hydraulic Hoses",
                  "Silicone Rubber Sheets",
                  "Durable Rubber Mats",
                  "Teflon Tapes & Asbestos Cloth",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#E5E7EB]"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>

              {/* Primary Human-Friendly Action Buttons */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#E05A2B] px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#c94b1f]"
                >
                  <span>Browse All Products</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[#16A34A] px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#15803D]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <Phone className="h-4 w-4 text-[#F59E0B]" />
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Visual Showcase & Stats */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#1C202B] p-5 shadow-2xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#14171F]">
                  {settings.heroImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.heroImage}
                      alt={settings.companyName}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14171F]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-lg bg-[#E05A2B] px-3 py-1 text-xs font-semibold text-white">
                      Wholesale & Retail Supply
                    </span>
                    <span className="rounded-lg bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-xs">
                      Ranigunj, Secunderabad
                    </span>
                  </div>
                </div>

                {/* 4 Key Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3.5">
                  {stats.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-white/10 bg-[#14171F] p-4"
                    >
                      <p className="font-display text-xl font-bold text-[#F59E0B] sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH SECTORS WE SERVE STRIP (RESIDENTIAL, COMMERCIAL, INDUSTRIAL) */}
      <section className="w-full border-b border-[#E5E0D5] bg-white py-12">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4 rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E05A2B]/10 text-[#E05A2B]">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#14171F]">
                  Residential Solutions
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">
                  PTFE Teflon thread seal tapes for leak-free plumbing, garden &
                  water delivery hoses, ventilation ducts, and anti-slip rubber
                  door & garage mats.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E05A2B]/10 text-[#E05A2B]">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#14171F]">
                  Commercial & Building Needs
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">
                  Heavy-duty PVC air conditioning & exhaust duct hoses, fire
                  safety canvas hoses, gym & commercial kitchen rubber mats, and
                  food-grade silicone sheets.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E05A2B]/10 text-[#E05A2B]">
                <Factory className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#14171F]">
                  Heavy Industrial Supply
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4B5563]">
                  High-pressure hydraulic hoses, copper-coated steel wire suction
                  hoses, carbon-free furnace hoses, electrical safety mats, and
                  heat-resistant asbestos cloth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH PRODUCT CATEGORIES SECTION */}
      <section className="w-full border-b border-[#E5E0D5] bg-[#FAF8F5] py-16">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E05A2B]">
                Our Product Categories
              </span>
              <h2 className="font-display mt-1.5 text-3xl font-bold text-[#14171F] sm:text-4xl">
                Explore What We Offer
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#4B5563] sm:text-base">
                Browse our three core product divisions covering flexible hoses
                & ducts, rubber sheets & mats, and industrial sealing supplies.
              </p>
            </div>

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D5CFC2] bg-white px-5 py-3 text-sm font-semibold text-[#14171F] transition hover:border-[#14171F]"
            >
              <span>View All Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* FULL-WIDTH FEATURED PRODUCTS CATALOG (4-COLUMN EXPANSIVE GRID) */}
      <section className="w-full border-b border-[#E5E0D5] bg-white py-16">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E05A2B]">
                Most Popular Products
              </span>
              <h2 className="font-display mt-1.5 text-3xl font-bold text-[#14171F] sm:text-4xl">
                Our Product Catalog
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#4B5563] sm:text-base">
                Click <strong>WhatsApp</strong> or <strong>Email Quote</strong>{" "}
                on any product below to send a ready-made inquiry with all
                product details pre-filled.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#14171F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#E05A2B]"
            >
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsappNumber}
                adminEmail={settings.adminEmail}
                companyName={settings.companyName}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FULL-WIDTH ABOUT NR INDUSTRIAL ENTERPRISES SECTION */}
      <section className="w-full border-b border-[#E5E0D5] bg-[#FAF8F5] py-20">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left 5 Columns: Showcase Image & Highlights */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white p-3 shadow-md">
                <div className="aspect-[3/2] w-full overflow-hidden rounded-xl bg-[#14171F]">
                  {settings.aboutImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={settings.aboutImage}
                      alt={settings.aboutTitle}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] p-3.5">
                    <ShieldCheck className="h-7 w-7 shrink-0 text-[#E05A2B]" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Quality Assured</p>
                      <p className="text-sm font-bold text-[#14171F]">
                        Tested & Durable
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] p-3.5">
                    <Truck className="h-7 w-7 shrink-0 text-[#16A34A]" />
                    <div>
                      <p className="text-xs text-[#6B7280]">Fast Delivery</p>
                      <p className="text-sm font-bold text-[#14171F]">
                        Ready Stock
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: About Text & Mission/Vision */}
            <div className="lg:col-span-7">
              <span className="inline-block rounded-lg bg-[#E05A2B]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E05A2B]">
                Who We Are
              </span>

              <h2 className="font-display mt-3 text-3xl font-bold text-[#14171F] sm:text-4xl">
                {settings.aboutTitle}
              </h2>

              <p className="mt-5 text-base font-medium leading-relaxed text-[#14171F] sm:text-lg">
                {settings.aboutDescription}
              </p>

              {settings.aboutExtended && (
                <p className="mt-4 text-sm leading-relaxed text-[#4B5563] sm:text-base">
                  {settings.aboutExtended}
                </p>
              )}

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#14171F]">
                    <CheckCircle2 className="h-4 w-4 text-[#E05A2B]" />
                    <span>Our Mission</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#4B5563] sm:text-sm">
                    {settings.aboutMission}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#14171F]">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                    <span>Our Vision</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#4B5563] sm:text-sm">
                    {settings.aboutVision}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E05A2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14171F]"
                >
                  <span>Explore Our Products</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D5CFC2] bg-white px-6 py-3.5 text-sm font-semibold text-[#14171F] transition hover:bg-[#F3EFE6]"
                >
                  <span>Visit or Contact Our Store</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
