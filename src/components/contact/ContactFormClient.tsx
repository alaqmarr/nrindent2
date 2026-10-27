"use client";

import React, { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  Mail,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { buildWhatsAppInquiryUrl } from "@/lib/utils";

export default function ContactFormClient({
  companyName,
  whatsappNumber,
  adminEmail,
}: {
  companyName: string;
  whatsappNumber: string;
  adminEmail: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState(`Product Inquiry — ${companyName}`);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT_FORM",
          name,
          email,
          phone,
          company,
          subject,
          quantity,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
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

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber,
    companyName,
    customMessage: `Hello ${companyName}, my name is ${
      name || "a customer"
    }. ${message || "I would like to enquire about your products."}`,
  });

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#E5E0D5] bg-white p-10 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h3 className="font-display text-2xl font-bold text-[#14171F]">
          Thank You! We Have Received Your Message
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#4B5563]">
          Thank you, <strong>{name}</strong>. Your inquiry has been sent to our
          team at <strong>{adminEmail}</strong>. We will contact you shortly.
        </p>
        {emailNotice && (
          <p className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            {emailNotice}
          </p>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-3.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 text-xs font-semibold text-white hover:bg-[#15803D]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setMessage("");
            }}
            className="rounded-xl border border-[#D5CFC2] bg-white px-6 py-3 text-xs font-semibold text-[#14171F] hover:bg-[#FAF8F5]"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-xs sm:p-8"
    >
      <div className="flex items-center gap-3 border-b border-[#F0ECE1] pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E05A2B]/10 text-[#E05A2B]">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[#14171F]">
            Send Us an Inquiry or Get a Quote
          </h2>
          <p className="text-xs text-[#6B7280]">
            Fill out the form below and our team will get back to you with
            pricing and availability.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
              Company / Business Name (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company or shop name"
              className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
              Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
              Quantity Needed (Optional)
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 30 Meters / 5 Rolls"
              className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
            Your Message / Product Requirement *
          </label>
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Let us know which hose pipe, rubber sheet, mat, or sealing product you need, along with size and quantity..."
            className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] p-4 text-sm leading-relaxed text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#F0ECE1] pt-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3.5 text-xs font-semibold text-white transition hover:bg-[#15803D]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Or Chat on WhatsApp</span>
          </a>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#E05A2B] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14171F] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
