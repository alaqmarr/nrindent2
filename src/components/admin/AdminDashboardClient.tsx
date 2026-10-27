"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  MessageSquareText,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Mail,
  Cloud,
  Plus,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import ProductsManager, { AdminProduct } from "./ProductsManager";
import CategoriesManager, { AdminCategory } from "./CategoriesManager";
import InquiriesManager, { AdminInquiry } from "./InquiriesManager";
import UsersManager, { AdminUser } from "./UsersManager";
import SettingsManager, { FullSiteSettings } from "./SettingsManager";

interface AdminDashboardClientProps {
  initialProducts: AdminProduct[];
  initialCategories: AdminCategory[];
  initialInquiries: AdminInquiry[];
  initialUsers: AdminUser[];
  initialSettings: FullSiteSettings;
  currentUser: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function AdminDashboardClient({
  initialProducts,
  initialCategories,
  initialInquiries,
  initialUsers,
  initialSettings,
  currentUser,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "inquiries" | "users" | "settings"
  >("overview");

  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [categories, setCategories] =
    useState<AdminCategory[]>(initialCategories);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(initialInquiries);
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [settings, setSettings] = useState<FullSiteSettings>(initialSettings);
  const [revalidating, setRevalidating] = useState(false);
  const [revalidatedMsg, setRevalidatedMsg] = useState<string | null>(null);

  const refreshAll = useCallback(async () => {
    try {
      const [prodRes, catRes, inqRes, usrRes, setRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/inquiries"),
        fetch("/api/users"),
        fetch("/api/settings"),
      ]);

      if (prodRes.ok) {
        const d = await prodRes.json();
        setProducts(d.products);
      }
      if (catRes.ok) {
        const d = await catRes.json();
        setCategories(d.categories);
      }
      if (inqRes.ok) {
        const d = await inqRes.json();
        setInquiries(d.inquiries);
      }
      if (usrRes.ok) {
        const d = await usrRes.json();
        setUsers(d.users);
      }
      if (setRes.ok) {
        const d = await setRes.json();
        setSettings(d.settings);
      }
    } catch (e) {
      console.error("Failed to refresh admin data", e);
    }
  }, []);

  const handleManualRevalidate = async () => {
    setRevalidating(true);
    setRevalidatedMsg(null);
    try {
      const res = await fetch("/api/revalidate", { method: "POST" });
      if (res.ok) {
        setRevalidatedMsg("All SSG/SSR routes & sitemap cache revalidated!");
        setTimeout(() => setRevalidatedMsg(null), 4000);
      }
    } finally {
      setRevalidating(false);
    }
  };

  const newInquiriesCount = inquiries.filter((i) => i.status === "NEW").length;
  const isSmtpReady = Boolean(settings.smtpUser && settings.smtpPass);
  const isR2Ready = Boolean(
    settings.r2AccountId && settings.r2AccessKeyId && settings.r2SecretAccessKey
  );

  const navItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      badge: products.length,
    },
    {
      id: "categories",
      label: "Categories",
      icon: FolderKanban,
      badge: categories.length,
    },
    {
      id: "inquiries",
      label: "Customer Inquiries",
      icon: MessageSquareText,
      badge: newInquiriesCount > 0 ? `${newInquiriesCount} New` : inquiries.length,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      badge: users.length,
    },
    {
      id: "settings",
      label: "Website Settings",
      icon: Settings,
      badge: null,
    },
  ] as const;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Left Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-300 lg:flex">
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
            <div className="rounded-xl bg-white p-1.5 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.logoUrl || "/logo.png"}
                alt={settings.companyName}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-white">
                {settings.companyName}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
                Admin Dashboard
              </p>
            </div>
          </div>

          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-bold transition ${
                    active
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== null && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 rounded-xl bg-slate-900 p-3">
            <p className="truncate text-xs font-bold text-white">
              {currentUser.name || "Administrator"}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {currentUser.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Site
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600/20 py-2 text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-slate-900">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            {revalidatedMsg && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {revalidatedMsg}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={revalidating}
              onClick={handleManualRevalidate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${revalidating ? "animate-spin" : ""}`}
              />
              <span>Refresh Website Cache</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600"
            >
              <span>View Public Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Tab Bar */}
          <div className="flex w-full gap-1.5 overflow-x-auto pt-2 lg:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  activeTab === item.id
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Active View Content */}
        <div className="flex-1 p-6 lg:p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div
                  onClick={() => setActiveTab("products")}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Products
                    </span>
                    <Package className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">
                    {products.length}
                  </p>
                  <p className="mt-1 text-xs font-medium text-orange-600">
                    Manage Products & Tech Specs →
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("categories")}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Categories
                    </span>
                    <FolderKanban className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">
                    {categories.length}
                  </p>
                  <p className="mt-1 text-xs font-medium text-orange-600">
                    Manage Industrial Divisions →
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("inquiries")}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer Inquiries
                    </span>
                    <MessageSquareText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">
                    {inquiries.length}
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    {newInquiriesCount} New Unread Inquiries →
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("users")}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Admin & Staff Users
                    </span>
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">
                    {users.length}
                  </p>
                  <p className="mt-1 text-xs font-medium text-blue-600">
                    Manage Accounts & Roles →
                  </p>
                </div>
              </div>

              {/* System Integration Status Cards */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <WhatsAppIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        WhatsApp Inquiry Integration
                      </h3>
                      <p className="text-xs text-slate-500">
                        Active Number: <strong>{settings.whatsappNumber}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className="mt-4 text-xs font-bold text-orange-600 hover:underline"
                  >
                    Configure WhatsApp Number & Message →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Gmail SMTP + Nodemailer
                      </h3>
                      <p className="text-xs text-slate-500">
                        Admin Email: <strong>{settings.adminEmail}</strong> (
                        {isSmtpReady ? "Credentials Set" : "Configure App Password"}
                        )
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className="mt-4 text-xs font-bold text-orange-600 hover:underline"
                  >
                    Configure Gmail SMTP & Test Email →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                      <Cloud className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Cloudflare R2 + Image Cropper
                      </h3>
                      <p className="text-xs text-slate-500">
                        Bucket: <strong>{settings.r2BucketName}</strong> (
                        {isR2Ready ? "Cloudflare R2 Connected" : "Local Fallback Active"}
                        )
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className="mt-4 text-xs font-bold text-orange-600 hover:underline"
                  >
                    Configure Cloudflare R2 Keys →
                  </button>
                </div>
              </div>

              {/* Quick Actions & Latest Inquiries */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">
                      Recent Customer Inquiries
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("inquiries")}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      View All ({inquiries.length})
                    </button>
                  </div>

                  <div className="mt-4 divide-y divide-slate-100">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div key={inq.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">
                            {inq.name}{" "}
                            <span className="font-normal text-slate-500">
                              ({inq.company || inq.email})
                            </span>
                          </p>
                          <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                            {inq.status}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-medium text-slate-700">
                          {inq.subject}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm lg:col-span-5">
                  <h3 className="text-base font-extrabold">
                    Quick Administrative Actions
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Jump directly to any CRUD workflow or system configuration.
                  </p>
                  <div className="mt-5 grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("products")}
                      className="flex items-center justify-between rounded-xl bg-orange-600 px-4 py-3 text-xs font-bold text-white hover:bg-orange-500"
                    >
                      <span>Add / Edit Industrial Products</span>
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("categories")}
                      className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700"
                    >
                      <span>Manage Product Categories</span>
                      <FolderKanban className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("settings")}
                      className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700"
                    >
                      <span>Configure SMTP, WhatsApp & Cloudflare R2</span>
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("users")}
                      className="flex items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700"
                    >
                      <span>Manage Admin Users & Passwords</span>
                      <Users className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <ProductsManager
              initialProducts={products}
              categories={categories}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === "categories" && (
            <CategoriesManager
              initialCategories={categories}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === "inquiries" && (
            <InquiriesManager
              initialInquiries={inquiries}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === "users" && (
            <UsersManager initialUsers={users} onRefresh={refreshAll} />
          )}

          {activeTab === "settings" && (
            <SettingsManager
              initialSettings={settings}
              onRefresh={refreshAll}
            />
          )}
        </div>
      </div>
    </div>
  );
}
