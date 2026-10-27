import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { getPublicSettings } from "@/lib/settings";
import SetupFormClient from "@/components/admin/SetupFormClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create First Admin Account | NR Industrial Enterprises",
  robots: { index: false, follow: false },
};

export default async function SetupPage() {
  const [userCount, settings] = await Promise.all([
    prisma.user.count(),
    getPublicSettings(),
  ]);

  const isLocked = userCount > 0;

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-[#FAF8F5] px-5 py-12">
      <div className="mx-auto w-full max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#14171F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {settings.companyName}</span>
        </Link>

        <SetupFormClient
          initialLocked={isLocked}
          companyName={settings.companyName}
        />
      </div>
    </div>
  );
}
