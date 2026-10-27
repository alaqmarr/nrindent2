"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Settings,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import type { PublicSiteSettings } from "@/lib/settings";
import { buildWhatsAppInquiryUrl } from "@/lib/utils";

export default function Navbar({ settings }: { settings: PublicSiteSettings }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/setup")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/contact", label: "Contact Us" },
  ];

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber: settings.whatsappNumber,
    companyName: settings.companyName,
    customMessage: settings.whatsappDefaultMsg,
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E0D5] bg-white/95 backdrop-blur-md">
      {/* Full-Width Top Info Bar */}
      <div className="w-full border-b border-[#222631] bg-[#14171F] text-xs text-[#D5D8DF]">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-2.5 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#F59E0B]">
              <ShieldCheck className="h-4 w-4" />
              <span>Residential • Commercial • Heavy Industrial Supply</span>
            </span>
            <span className="hidden items-center gap-1.5 text-[#9CA3AF] md:inline-flex">
              <MapPin className="h-3.5 w-3.5 text-[#E05A2B]" />
              <span>
                {settings.addressLine1}, {settings.city}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${settings.salesPhone}`}
              className="inline-flex items-center gap-1.5 font-medium text-white transition hover:text-[#F59E0B]"
            >
              <Phone className="h-3.5 w-3.5 text-[#E05A2B]" />
              <span>{settings.salesPhone}</span>
            </a>
            <a
              href={`mailto:${settings.adminEmail}`}
              className="hidden items-center gap-1.5 font-medium text-white transition hover:text-[#F59E0B] sm:inline-flex"
            >
              <Mail className="h-3.5 w-3.5 text-[#E05A2B]" />
              <span>{settings.adminEmail}</span>
            </a>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-[#E05A2B]"
            >
              <Settings className="h-3 w-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Full-Width Main Navigation */}
      <div className="flex w-full items-center justify-between px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.logoUrl || "/logo.png"}
            alt={settings.companyName}
            className="h-12 w-auto object-contain sm:h-14"
          />
          <div className="hidden sm:block">
            <span className="font-display block text-lg font-bold tracking-tight text-[#14171F] xl:text-xl">
              {settings.companyName}
            </span>
            <span className="block text-xs font-medium text-[#6B7280]">
              Hose Pipes • Rubber Sheets • PVC Ducts • Sealing Tapes
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#14171F] text-white"
                    : "text-[#374151] hover:bg-[#F3EFE6] hover:text-[#14171F]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#15803D]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E05A2B] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#14171F]"
          >
            <span>Get a Quote</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] text-[#14171F] lg:hidden"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="w-full border-t border-[#E5E0D5] bg-white px-5 pb-6 pt-3 lg:hidden">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-[#14171F] hover:bg-[#FAF8F5]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-[#E5E0D5] pt-4 sm:grid-cols-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] py-3 text-sm font-semibold text-white"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#E05A2B] py-3 text-sm font-semibold text-white"
            >
              <span>Get a Quote</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
