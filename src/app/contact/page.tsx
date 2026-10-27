import React from "react";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getPublicSettings } from "@/lib/settings";
import { buildWhatsAppInquiryUrl } from "@/lib/utils";
import ContactFormClient from "@/components/contact/ContactFormClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  return {
    title: "Contact Us — Store Address, Phone & Quote Request",
    description: `Contact ${settings.companyName} in ${settings.city} for PVC duct hoses, copper-coated steel wire hoses, canvas & hydraulic hoses, silicone rubber sheets, rubber mats, Teflon tapes, and asbestos cloth.`,
    alternates: {
      canonical: "/contact",
    },
  };
}

export default async function ContactPage() {
  const settings = await getPublicSettings();

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber: settings.whatsappNumber,
    companyName: settings.companyName,
    customMessage: settings.whatsappDefaultMsg,
  });

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] pb-20">
      {/* Full-Width Header */}
      <div className="w-full border-b border-[#E5E0D5] bg-[#14171F] py-14 text-white">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <span className="inline-block rounded-lg bg-[#E05A2B]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">
            Get in Touch With Us
          </span>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Contact {settings.companyName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#D5D8DF] sm:text-base">
            Have a question about hose sizes, rubber sheet thickness, or bulk
            pricing? Reach out via WhatsApp, Phone, Email, or visit our store in{" "}
            {settings.city}.
          </p>
        </div>
      </div>

      {/* Full-Width Contact Content */}
      <div className="mt-10 w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 5 Cols: Store Address & Direct Contact Cards */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-xs sm:p-8">
              <h2 className="font-display text-xl font-bold text-[#14171F]">
                Store & Contact Information
              </h2>
              <p className="mt-1 text-xs text-[#6B7280]">
                Direct contact details for retail, commercial, and bulk orders.
              </p>

              <div className="mt-6 space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E05A2B]/10 text-[#E05A2B]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                      Store Address
                    </p>
                    <p className="mt-0.5 font-semibold text-[#14171F]">
                      {settings.addressLine1}
                      {settings.addressLine2 ? `, ${settings.addressLine2}` : ""}
                    </p>
                    <p className="text-[#4B5563]">
                      {settings.city}, {settings.state} - {settings.postalCode},{" "}
                      {settings.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E05A2B]/10 text-[#E05A2B]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                      Phone Numbers
                    </p>
                    <p className="mt-0.5 font-bold text-[#14171F]">
                      <a
                        href={`tel:${settings.salesPhone}`}
                        className="hover:text-[#E05A2B]"
                      >
                        {settings.salesPhone}
                      </a>
                    </p>
                    {settings.supportPhone && (
                      <p className="text-xs text-[#4B5563]">
                        Store Line: {settings.supportPhone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16A34A]/10 text-[#16A34A]">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                      WhatsApp Inquiry
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-block font-bold text-[#16A34A] hover:underline"
                    >
                      {settings.whatsappNumber} (Click to Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E05A2B]/10 text-[#E05A2B]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${settings.adminEmail}`}
                      className="mt-0.5 inline-block font-bold text-[#14171F] hover:text-[#E05A2B]"
                    >
                      {settings.adminEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#374151]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                      Working Hours
                    </p>
                    <p className="mt-0.5 font-semibold text-[#14171F]">
                      {settings.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {settings.googleMapsEmbedUrl && (
              <div className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white p-2 shadow-xs">
                <iframe
                  src={settings.googleMapsEmbedUrl}
                  title={`${settings.companyName} Location`}
                  className="h-64 w-full rounded-xl border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Right 7 Cols: Contact Form */}
          <div className="lg:col-span-7">
            <ContactFormClient
              companyName={settings.companyName}
              whatsappNumber={settings.whatsappNumber}
              adminEmail={settings.adminEmail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
