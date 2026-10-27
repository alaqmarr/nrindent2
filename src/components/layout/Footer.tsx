"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import type { PublicSiteSettings } from "@/lib/settings";
import { buildWhatsAppInquiryUrl } from "@/lib/utils";

export default function Footer({
  settings,
  categories = [],
}: {
  settings: PublicSiteSettings;
  categories?: Array<{ id: string; name: string; slug: string }>;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/setup")) {
    return null;
  }

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber: settings.whatsappNumber,
    companyName: settings.companyName,
    customMessage: settings.whatsappDefaultMsg,
  });

  return (
    <footer className="w-full bg-[#14171F] text-[#D5D8DF]">
      {/* Full-Width Call-To-Action Banner */}
      <div className="w-full border-b border-white/10 bg-[#1C202B]">
        <div className="flex w-full flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:px-12 xl:px-16">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#F59E0B]">
              Bulk Orders, Retail & Custom Lengths Available
            </span>
            <h2 className="font-display mt-2 text-2xl font-bold text-white sm:text-4xl">
              Looking for Hose Pipes, Rubber Sheets, or Sealing Supplies?
            </h2>
            <p className="mt-2 text-sm text-[#9CA3AF] sm:text-base">
              Get in touch with us on WhatsApp or Email for quick pricing, roll
              sizes, and same-day dispatch from our Secunderabad store.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#16A34A] px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#15803D]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span>Enquire on WhatsApp</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E05A2B] px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#c94b1f]"
            >
              <span>Send Email Inquiry</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-Width Footer Columns */}
      <div className="w-full px-5 py-14 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Col 1: Company Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3.5">
              <div className="rounded-xl bg-white p-2 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.logoUrl || "/logo.png"}
                  alt={settings.companyName}
                  className="h-11 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-display block text-lg font-bold text-white">
                  {settings.companyName}
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  House Of Industrial Supplies • Secunderabad
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#9CA3AF]">
              {settings.aboutDescription}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://www.indiamart.com/nrindustrial-enterprises/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                <span>IndiaMART Storefront</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#F59E0B]" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#9CA3AF]">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition hover:text-white">
                  Product Categories
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition hover:text-[#F59E0B]">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Our Product Range
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[#9CA3AF]">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="transition hover:text-white"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-[#F59E0B] hover:underline">
                  View Full Catalog →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store & Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Store & Contact Details
            </h4>
            <ul className="mt-4 space-y-3.5 text-sm text-[#9CA3AF]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E05A2B]" />
                <span>
                  {settings.addressLine1}
                  {settings.addressLine2 ? `, ${settings.addressLine2}` : ""},{" "}
                  {settings.city}, {settings.state} - {settings.postalCode}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#E05A2B]" />
                <a
                  href={`tel:${settings.salesPhone}`}
                  className="font-medium text-white hover:text-[#F59E0B]"
                >
                  {settings.salesPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#E05A2B]" />
                <a
                  href={`mailto:${settings.adminEmail}`}
                  className="hover:text-white"
                >
                  {settings.adminEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-[#E05A2B]" />
                <span>{settings.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#6B7280] sm:flex-row">
          <p>{settings.footerText}</p>
          <p>
            Supplying Residential, Commercial & Industrial Customers Across India
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enquire on WhatsApp"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition hover:scale-105 hover:bg-[#15803D]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        <span className="hidden sm:inline">WhatsApp Us</span>
      </a>
    </footer>
  );
}
