import React from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Control Center | NR Industrial Enterprises",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    redirect("/setup");
  }

  const session = await getAdminSession();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const [products, categories, inquiries, users, settings] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    getSiteSettings(),
  ]);

  const serializedInquiries = inquiries.map((i) => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
    updatedAt: i.updatedAt.toISOString(),
  }));

  const serializedUsers = users.map((u) => ({
    ...u,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <AdminDashboardClient
      initialProducts={products}
      initialCategories={categories}
      initialInquiries={serializedInquiries}
      initialUsers={serializedUsers}
      initialSettings={settings}
      currentUser={session.user}
    />
  );
}
