"use client";

import React, { useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  Mail,
  Cloud,
  Globe,
  Building2,
  Send,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import ImageUploadCropper from "./ImageUploadCropper";

export interface FullSiteSettings {
  id: string;
  companyName: string;
  tagline: string;
  logoUrl?: string | null;
  aboutTitle: string;
  aboutDescription: string;
  aboutExtended: string;
  aboutMission: string;
  aboutVision: string;
  aboutImage?: string | null;
  establishedYear: string;
  isoCertification: string;
  statsJson: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string | null;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  whatsappNumber: string;
  whatsappDefaultMsg: string;
  adminEmail: string;
  supportEmail: string;
  salesPhone: string;
  supportPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  workingHours: string;
  googleMapsEmbedUrl: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  smtpFromEmail: string;
  smtpFromName: string;
  r2AccountId: string;
  r2AccessKeyId: string;
  r2SecretAccessKey: string;
  r2BucketName: string;
  r2PublicUrl: string;
  seoDefaultTitle: string;
  seoTitleTemplate: string;
  seoDefaultDescription: string;
  seoDefaultKeywords: string;
  footerText: string;
}

export default function SettingsManager({
  initialSettings,
  onRefresh,
}: {
  initialSettings: FullSiteSettings;
  onRefresh: () => Promise<void>;
}) {
  const [form, setForm] = useState<FullSiteSettings>(initialSettings);
  const [activeSubTab, setActiveSubTab] = useState<
    "brand" | "contact" | "smtp" | "r2" | "seo"
  >("brand");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestMessage, setSmtpTestMessage] = useState<string | null>(null);

  const updateField = <K extends keyof FullSiteSettings>(
    key: K,
    value: FullSiteSettings[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setForm(data.settings);
      setSavedSuccess(true);
      await onRefresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setSmtpTestMessage(null);
    try {
      // Save current settings first so test uses the latest values
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const res = await fetch("/api/settings/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toEmail: form.adminEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "SMTP test failed");
      }
      setSmtpTestMessage(`✅ ${data.message}`);
    } catch (err: unknown) {
      setSmtpTestMessage(
        `❌ ${err instanceof Error ? err.message : "SMTP Test failed"}`
      );
    } finally {
      setTestingSmtp(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Site, Contact, WhatsApp, SMTP, R2 & SEO Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Manage all dynamic content, inquiry endpoints, Gmail SMTP
            credentials, and Cloudflare R2 storage keys.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving & Revalidating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save All Settings
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          All settings saved and SSR/SSG pages revalidated!
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
          {error}
        </div>
      )}

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab("brand")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeSubTab === "brand"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building2 className="h-4 w-4 text-orange-500" />
          Brand, Hero & About NR Industrial
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("contact")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeSubTab === "contact"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <WhatsAppIcon className="h-4 w-4 text-emerald-500" />
          Contact, WhatsApp & Admin Email
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("smtp")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeSubTab === "smtp"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Mail className="h-4 w-4 text-orange-500" />
          Gmail SMTP & Nodemailer
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("r2")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeSubTab === "r2"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Cloud className="h-4 w-4 text-sky-500" />
          Cloudflare R2 Storage
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("seo")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeSubTab === "seo"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Globe className="h-4 w-4 text-purple-500" />
          Global SEO & Footer
        </button>
      </div>

      {/* TAB 1: BRAND, HERO & ABOUT NR INDUSTRIAL */}
      {activeSubTab === "brand" && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900">
            Company Profile, Hero Banner & About NR Industrial Enterprises
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Company Name
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                ISO / Quality Certification Badge
              </label>
              <input
                type="text"
                value={form.isoCertification}
                onChange={(e) => updateField("isoCertification", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Established Year
              </label>
              <input
                type="text"
                value={form.establishedYear}
                onChange={(e) => updateField("establishedYear", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <ImageUploadCropper
                value={form.logoUrl || "/logo.png"}
                onChange={(url) => updateField("logoUrl", url)}
                folder="site"
                defaultAspect={2 / 1}
                label="Official Company Logo (Navbar, Footer & Metadata)"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h4 className="mb-3 text-sm font-extrabold text-slate-900">
              About NR Industrial Enterprises Content
            </h4>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  About Heading
                </label>
                <input
                  type="text"
                  value={form.aboutTitle}
                  onChange={(e) => updateField("aboutTitle", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Primary About Description
                </label>
                <textarea
                  rows={3}
                  value={form.aboutDescription}
                  onChange={(e) =>
                    updateField("aboutDescription", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Extended Manufacturing Capabilities Text
                </label>
                <textarea
                  rows={3}
                  value={form.aboutExtended}
                  onChange={(e) => updateField("aboutExtended", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Mission Statement
                  </label>
                  <textarea
                    rows={3}
                    value={form.aboutMission}
                    onChange={(e) =>
                      updateField("aboutMission", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                    Vision Statement
                  </label>
                  <textarea
                    rows={3}
                    value={form.aboutVision}
                    onChange={(e) => updateField("aboutVision", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <ImageUploadCropper
                  value={form.aboutImage || ""}
                  onChange={(url) => updateField("aboutImage", url)}
                  folder="site"
                  defaultAspect={3 / 2}
                  label="About Section Showcase Image (3:2 Client Crop + Cloudflare R2)"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h4 className="mb-3 text-sm font-extrabold text-slate-900">
              Home Page Hero Banner
            </h4>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Hero Top Badge
                </label>
                <input
                  type="text"
                  value={form.heroBadge}
                  onChange={(e) => updateField("heroBadge", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={form.heroTitle}
                  onChange={(e) => updateField("heroTitle", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Hero Subtitle
                </label>
                <textarea
                  rows={3}
                  value={form.heroSubtitle}
                  onChange={(e) => updateField("heroSubtitle", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <ImageUploadCropper
                  value={form.heroImage || ""}
                  onChange={(url) => updateField("heroImage", url)}
                  folder="site"
                  defaultAspect={16 / 9}
                  label="Hero Banner Image (16:9 Client Display Crop + Cloudflare R2)"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT, WHATSAPP & ADMIN EMAIL */}
      {activeSubTab === "contact" && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900">
            WhatsApp Inquiry Number, Admin Email & Plant Contact Details
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-emerald-700">
                WhatsApp Number (With Country Code, e.g. +919876543210) *
              </label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => updateField("whatsappNumber", e.target.value)}
                className="w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3.5 py-2 font-mono text-sm font-bold text-slate-900"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Used automatically on all Product Cards, Product Detail Pages,
                Navbar, and Contact WhatsApp buttons.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-orange-700">
                Primary Admin / Sales Email (Receives All Inquiries) *
              </label>
              <input
                type="email"
                value={form.adminEmail}
                onChange={(e) => updateField("adminEmail", e.target.value)}
                className="w-full rounded-xl border border-orange-300 bg-orange-50/40 px-3.5 py-2 text-sm font-bold text-slate-900"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                All pre-filled Product Email Inquiries and Contact Form messages
                are sent to this email.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Default General WhatsApp Greeting Message
              </label>
              <input
                type="text"
                value={form.whatsappDefaultMsg}
                onChange={(e) =>
                  updateField("whatsappDefaultMsg", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Sales Phone Number
              </label>
              <input
                type="text"
                value={form.salesPhone}
                onChange={(e) => updateField("salesPhone", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Support / Landline Phone
              </label>
              <input
                type="text"
                value={form.supportPhone}
                onChange={(e) => updateField("supportPhone", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Secondary / Info Email
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => updateField("supportEmail", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Working Hours
              </label>
              <input
                type="text"
                value={form.workingHours}
                onChange={(e) => updateField("workingHours", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Address Line 1 (Plot / Industrial Area)
              </label>
              <input
                type="text"
                value={form.addressLine1}
                onChange={(e) => updateField("addressLine1", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Address Line 2
              </label>
              <input
                type="text"
                value={form.addressLine2}
                onChange={(e) => updateField("addressLine2", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                State / Province
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Postal / PIN Code
              </label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Google Maps Embed Iframe URL
              </label>
              <input
                type="text"
                value={form.googleMapsEmbedUrl}
                onChange={(e) =>
                  updateField("googleMapsEmbedUrl", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GMAIL SMTP & NODEMAILER */}
      {activeSubTab === "smtp" && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Nodemailer + Gmail SMTP Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Used to dispatch product inquiries & contact messages to{" "}
                <strong>{form.adminEmail}</strong> and send customer
                acknowledgments.
              </p>
            </div>

            <button
              type="button"
              disabled={testingSmtp}
              onClick={handleTestSmtp}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {testingSmtp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Test Email...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send Test Email to {form.adminEmail}
                </>
              )}
            </button>
          </div>

          {smtpTestMessage && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-800">
              {smtpTestMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                SMTP Host
              </label>
              <input
                type="text"
                value={form.smtpHost}
                onChange={(e) => updateField("smtpHost", e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                SMTP Port (587 TLS or 465 SSL)
              </label>
              <input
                type="number"
                value={form.smtpPort}
                onChange={(e) =>
                  updateField("smtpPort", Number(e.target.value))
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Gmail Address (SMTP Username)
              </label>
              <input
                type="email"
                value={form.smtpUser}
                onChange={(e) => updateField("smtpUser", e.target.value)}
                placeholder="your-account@gmail.com"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Gmail App Password (16-Character App Password)
              </label>
              <input
                type="password"
                value={form.smtpPass}
                onChange={(e) => updateField("smtpPass", e.target.value)}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Sender Display Name
              </label>
              <input
                type="text"
                value={form.smtpFromName}
                onChange={(e) => updateField("smtpFromName", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Sender Email Address
              </label>
              <input
                type="email"
                value={form.smtpFromEmail}
                onChange={(e) => updateField("smtpFromEmail", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLOUDFLARE R2 STORAGE */}
      {activeSubTab === "r2" && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Cloudflare R2 Object Storage Configuration
            </h3>
            <p className="text-xs text-slate-500">
              All images cropped in the Admin Dropzone Crop Window are uploaded
              directly to your Cloudflare R2 bucket. (If left blank, cropped
              images are automatically saved to local storage so uploads never
              fail.)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Cloudflare Account ID
              </label>
              <input
                type="text"
                value={form.r2AccountId}
                onChange={(e) => updateField("r2AccountId", e.target.value)}
                placeholder="e.g. 8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                R2 Bucket Name
              </label>
              <input
                type="text"
                value={form.r2BucketName}
                onChange={(e) => updateField("r2BucketName", e.target.value)}
                placeholder="nr-industrial-assets"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                R2 S3 Access Key ID
              </label>
              <input
                type="text"
                value={form.r2AccessKeyId}
                onChange={(e) => updateField("r2AccessKeyId", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                R2 S3 Secret Access Key
              </label>
              <input
                type="password"
                value={form.r2SecretAccessKey}
                onChange={(e) =>
                  updateField("r2SecretAccessKey", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                R2 Public Bucket URL / Custom Domain (e.g.
                https://pub-xxxx.r2.dev or https://cdn.nrindustrial.com)
              </label>
              <input
                type="text"
                value={form.r2PublicUrl}
                onChange={(e) => updateField("r2PublicUrl", e.target.value)}
                placeholder="https://pub-xxxxxxxx.r2.dev"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GLOBAL SEO & FOOTER */}
      {activeSubTab === "seo" && (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900">
            Global Search Engine Optimization (SEO) & Footer
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Default Site Meta Title
                </label>
                <input
                  type="text"
                  value={form.seoDefaultTitle}
                  onChange={(e) =>
                    updateField("seoDefaultTitle", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                  Page Title Template
                </label>
                <input
                  type="text"
                  value={form.seoTitleTemplate}
                  onChange={(e) =>
                    updateField("seoTitleTemplate", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={form.seoDefaultDescription}
                onChange={(e) =>
                  updateField("seoDefaultDescription", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 p-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Default Meta Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={form.seoDefaultKeywords}
                onChange={(e) =>
                  updateField("seoDefaultKeywords", e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-slate-700">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={form.footerText}
                onChange={(e) => updateField("footerText", e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
