"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Loader2,
  ArrowRight,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

export default function SetupFormClient({
  initialLocked,
  companyName = "NR Industrial Enterprises",
}: {
  initialLocked: boolean;
  companyName?: string;
}) {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(initialLocked);
  const [justCreated, setJustCreated] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 || data.isLocked) {
          setIsLocked(true);
        }
        throw new Error(data.error || "Failed to create admin account");
      }

      setIsLocked(true);
      setJustCreated(true);

      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!signInRes?.error) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLocked) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white p-8 text-center shadow-lg">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            justCreated
              ? "bg-emerald-100 text-emerald-700"
              : "bg-[#E05A2B]/10 text-[#E05A2B]"
          }`}
        >
          {justCreated ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : (
            <Lock className="h-7 w-7" />
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] px-3 py-1 text-xs font-semibold text-[#4B5563]">
          <Lock className="h-3.5 w-3.5 text-[#E05A2B]" />
          Setup Page Locked
        </span>

        <h2 className="font-display mt-3 text-2xl font-bold text-[#14171F]">
          {justCreated
            ? "Admin Account Created Successfully!"
            : "Admin Account Already Exists"}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4B5563]">
          {justCreated
            ? "Your first admin account is ready and this setup page has now been locked for security."
            : `An admin account has already been set up for ${companyName}. For security, this page is locked. Please sign in on the Admin Login page.`}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E05A2B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14171F]"
          >
            <span>Go to Admin Login</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-[#D5CFC2] bg-white px-6 py-3 text-sm font-semibold text-[#14171F] transition hover:bg-[#FAF8F5]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white shadow-lg">
      <div className="flex items-center gap-3.5 bg-[#14171F] px-6 py-5 text-white">
        <div className="rounded-xl bg-white p-1.5 shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt={companyName}
            className="h-9 w-auto object-contain"
          />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold">
            Create First Admin Account
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            This setup page will automatically lock once your account is
            created.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
              Your Full Name *
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                Email Address *
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
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#374151]">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-[#D5CFC2] bg-[#FAF8F5] px-4 py-3 text-sm text-[#14171F] focus:border-[#E05A2B] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E05A2B] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14171F] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Admin Account</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
