"use client";

import React, { useState } from "react";
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Package,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export interface AdminInquiry {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  quantity?: string | null;
  productId?: string | null;
  productName?: string | null;
  productSku?: string | null;
  status: string;
  adminNotes?: string | null;
  emailSent: boolean;
  createdAt: string;
}

export default function InquiriesManager({
  initialInquiries,
  onRefresh,
}: {
  initialInquiries: AdminInquiry[];
  onRefresh: () => Promise<void>;
}) {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(initialInquiries);
  const [statusFilter, setStatusFilter] = useState("ALL");

  React.useEffect(() => {
    setInquiries(initialInquiries);
  }, [initialInquiries]);

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this inquiry record?")) return;
    const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      await onRefresh();
    }
  };

  const filtered =
    statusFilter === "ALL"
      ? inquiries
      : inquiries.filter((i) => i.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Customer Inquiries & Quotation Requests ({inquiries.length})
          </h2>
          <p className="text-xs text-slate-500">
            Track product & contact inquiries sent via Nodemailer SMTP and reply
            directly via Email or WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          No inquiries matching this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            const cleanCustomerPhone = (inq.phone || "").replace(/[^\d]/g, "");
            const replyWhatsappUrl = cleanCustomerPhone
              ? `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(
                  `Hello ${inq.name}, regarding your inquiry to NR Industrial Enterprises for "${
                    inq.productName || inq.subject
                  }": `
                )}`
              : null;

            return (
              <div
                key={inq.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          inq.status === "NEW"
                            ? "bg-orange-100 text-orange-700"
                            : inq.status === "RESOLVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {inq.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {new Date(inq.createdAt).toLocaleString()}
                      </span>
                      {inq.emailSent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> SMTP Dispatched
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1.5 text-base font-bold text-slate-900">
                      {inq.subject || "Industrial Product Inquiry"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) =>
                        handleUpdateStatus(inq.id, e.target.value)
                      }
                      className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800"
                    >
                      <option value="NEW">NEW</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDelete(inq.id)}
                      className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Customer & Product Details */}
                <div className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">{inq.name}</p>
                    <p className="text-slate-600">{inq.email}</p>
                    {inq.phone && (
                      <p className="inline-flex items-center gap-1 text-slate-600">
                        <Phone className="h-3 w-3 text-orange-600" />
                        {inq.phone}
                      </p>
                    )}
                    {inq.company && (
                      <p className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        {inq.company}
                      </p>
                    )}
                  </div>

                  {inq.productName && (
                    <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3">
                      <p className="inline-flex items-center gap-1 font-bold text-orange-800">
                        <Package className="h-3.5 w-3.5" />
                        {inq.productName}
                      </p>
                      {inq.productSku && (
                        <p className="mt-0.5 font-mono text-[11px] text-slate-600">
                          SKU: {inq.productSku}
                        </p>
                      )}
                      {inq.quantity && (
                        <p className="mt-0.5 font-semibold text-slate-800">
                          Qty: {inq.quantity}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 sm:col-span-1">
                    <a
                      href={`mailto:${inq.email}?subject=${encodeURIComponent(
                        `Re: ${inq.subject || "Your Inquiry at NR Industrial Enterprises"}`
                      )}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-orange-600"
                    >
                      <Mail className="h-3.5 w-3.5" /> Reply Email
                    </a>
                    {replyWhatsappUrl && (
                      <a
                        href={replyWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp Customer
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {inq.message}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
