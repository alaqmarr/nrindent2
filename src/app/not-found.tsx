import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center bg-[#FAF8F5] px-5 py-16 text-center">
      <div className="max-w-lg rounded-2xl border border-[#E5E0D5] bg-white p-10 shadow-sm">
        <span className="inline-block rounded-lg bg-[#E05A2B]/10 px-3 py-1 text-xs font-semibold text-[#E05A2B]">
          404 — Page Not Found
        </span>
        <h1 className="font-display mt-4 text-3xl font-bold text-[#14171F] sm:text-4xl">
          We Couldn&apos;t Find That Page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
          The page or product you are looking for might have been moved or is no
          longer available. You can browse all our products or return to the
          home page below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E05A2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14171F]"
          >
            <span>Browse All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D5CFC2] bg-white px-6 py-3.5 text-sm font-semibold text-[#14171F] transition hover:bg-[#FAF8F5]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
