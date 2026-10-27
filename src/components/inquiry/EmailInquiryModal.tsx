"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  Loader2,
  ExternalLink,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { buildEmailPrefillData } from "@/lib/utils";

export interface InquiryProductInfo {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  categoryName?: string;
  minOrderQty?: string | null;
  image?: string | null;
}

interface EmailInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: InquiryProductInfo;
  companyName?: string;
  adminEmail?: string;
}

export default function EmailInquiryModal({
  isOpen,
  onClose,
  product,
  companyName = "NR Industrial Enterprises",
  adminEmail = "sales@nrindustrial.com",
}: EmailInquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState(product?.minOrderQty || "1 Roll / Unit");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const productUrl = product ? `${origin}/products/${product.slug}` : origin;

      const prefill = buildEmailPrefillData({
        companyName,
        productName: product?.name,
        productSku: product?.sku,
        categoryName: product?.categoryName,
        minOrderQty: product?.minOrderQty,
        productUrl,
      });

      setSubject(prefill.subject);
      setMessage(prefill.message);
      setQuantity(product?.minOrderQty || "1 Roll / Unit");
      setSubmitted(false);
      setError(null);
      setEmailNotice(null);
    }
  }, [isOpen, product, companyName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const productUrl = product ? `${origin}/products/${product.slug}` : origin;

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PRODUCT_EMAIL",
          name,
          email,
          phone,
          company,
          quantity,
          subject,
          message,
          productId: product?.id,
          productName: product?.name,
          productSku: product?.sku,
          productUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send inquiry");
      }

      setSubmitted(true);
      if (data.emailNotice) {
        setEmailNotice(data.emailNotice);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoHref = `mailto:${adminEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(
    `${message}\n\nName: ${name}\nCompany: ${company}\nPhone: ${phone}\nRequired Qty: ${quantity}`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#14171F]/75 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E5E0D5] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D5] bg-[#14171F] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E05A2B] text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold">
                Enquire via Email
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Pre-filled with product details • Sends directly to {companyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Product Summary */}
        {product && (
          <div className="flex items-center gap-4 border-b border-[#E5E0D5] bg-[#FAF8F5] px-6 py-3.5">
            {product.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-12 w-16 rounded-lg border border-[#E5E0D5] object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-display truncate text-sm font-bold text-[#14171F]">
                {product.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                {product.categoryName && <span>{product.categoryName}</span>}
                {product.sku && (
                  <span className="font-mono text-[11px] text-[#E05A2B]">
                    • Code: {product.sku}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="font-display text-2xl font-bold text-[#14171F]">
              Thank You! Your Inquiry Has Been Sent
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#4B5563]">
              We have received your inquiry for{" "}
              <strong>{product?.name || subject}</strong> and will get back to
              you shortly with the best quotation.
            </p>
            {emailNotice && (
              <p className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                {emailNotice}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E0D5] bg-white px-4 py-2.5 text-xs font-semibold text-[#14171F] hover:bg-[#FAF8F5]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in Email App
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#14171F] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#E05A2B]"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-[#D5CFC2] bg-white px-3.5 py-2.5 text-sm text-[#14171F] focus:border-[#E05A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#D5CFC2] bg-white px-3.5 py-2.5 text-sm text-[#14171F] focus:border-[#E05A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-[#D5CFC2] bg-white px-3.5 py-2.5 text-sm text-[#14171F] focus:border-[#E05A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  Company / Business Name (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your business or site name"
                  className="w-full rounded-xl border border-[#D5CFC2] bg-white px-3.5 py-2.5 text-sm text-[#14171F] focus:border-[#E05A2B] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-medium text-[#14171F] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#374151]">
                  Quantity Required
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 20 Meters / 2 Rolls"
                  className="w-full rounded-xl border border-[#D5CFC2] bg-white px-3.5 py-2.5 text-sm text-[#14171F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-[#374151]">
                Message & Requirement Details *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] p-3.5 text-sm leading-relaxed text-[#14171F] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E0D5] pt-4">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#14171F]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in default Email App
              </a>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#D5CFC2] bg-white px-4 py-2.5 text-xs font-semibold text-[#374151] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#E05A2B] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#14171F] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email Inquiry
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
