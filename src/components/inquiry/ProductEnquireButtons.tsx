"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { buildWhatsAppInquiryUrl } from "@/lib/utils";
import EmailInquiryModal, { InquiryProductInfo } from "./EmailInquiryModal";

interface ProductEnquireButtonsProps {
  product: InquiryProductInfo;
  whatsappNumber: string;
  adminEmail: string;
  companyName?: string;
  variant?: "card" | "detail";
}

export default function ProductEnquireButtons({
  product,
  whatsappNumber,
  adminEmail,
  companyName = "NR Industrial Enterprises",
  variant = "card",
}: ProductEnquireButtonsProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber,
    companyName,
    productName: product.name,
    productSku: product.sku,
    categoryName: product.categoryName,
    productUrl: `${siteUrl}/products/${product.slug}`,
  });

  if (variant === "detail") {
    return (
      <>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#16A34A] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15803D]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span>Enquire on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#14171F] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E05A2B]"
          >
            <Mail className="h-5 w-5" />
            <span>Enquire via Email</span>
          </button>
        </div>

        <EmailInquiryModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          product={product}
          companyName={companyName}
          adminEmail={adminEmail}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Enquire about ${product.name} on WhatsApp`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#16A34A] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#15803D]"
        >
          <WhatsAppIcon className="h-4 w-4 shrink-0" />
          <span>WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={() => setIsEmailModalOpen(true)}
          title={`Enquire about ${product.name} via Email`}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#14171F] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E05A2B]"
        >
          <Mail className="h-4 w-4 shrink-0" />
          <span>Email Quote</span>
        </button>
      </div>

      <EmailInquiryModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        product={product}
        companyName={companyName}
        adminEmail={adminEmail}
      />
    </>
  );
}
