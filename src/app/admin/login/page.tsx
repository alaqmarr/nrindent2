"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsInitialSetup, setNeedsInitialSetup] = useState(false);

  useEffect(() => {
    fetch("/api/setup")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.isLocked === false) {
          setNeedsInitialSetup(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-[#FAF8F5] px-5 py-12">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#4B5563] hover:text-[#14171F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Website</span>
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white shadow-lg">
          <div className="flex items-center gap-3.5 bg-[#14171F] px-6 py-5 text-white">
            <div className="rounded-xl bg-white p-1.5 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="NR Industrial Enterprises"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Admin Login</h1>
              <p className="text-xs text-[#9CA3AF]">
                NR Industrial Enterprises
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-sm text-[#4B5563]">
              Sign in with your email and password to manage products,
              categories, inquiries, and website settings.
            </p>

            {needsInitialSetup && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900">
                <p className="font-bold text-emerald-800">
                  No Admin Account Created Yet
                </p>
                <p className="mt-1 text-emerald-700">
                  Create your first admin account on the setup page to get
                  started.
                </p>
                <Link
                  href="/setup"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#15803D]"
                >
                  <span>Create First Admin Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nrindustrial.com"
                  className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E05A2B] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14171F] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
