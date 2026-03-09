"use client";

import { CreditCard, Shield, Zap, BarChart3 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-12 text-white relative overflow-hidden">
        {/* Gradient accent blobs */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold tracking-tight">PayVault</span>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              Payment infrastructure
              <br />
              <span className="text-emerald-400">built for Africa.</span>
            </h2>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-md">
              Accept payments, manage subscriptions, and prevent fraud — all from a single, developer-first platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 backdrop-blur-sm px-4 py-3">
              <Zap className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-zinc-300">Go live in under 10 minutes</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 backdrop-blur-sm px-4 py-3">
              <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-zinc-300">Built-in fraud detection and velocity checks</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 backdrop-blur-sm px-4 py-3">
              <BarChart3 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-zinc-300">Real-time analytics and webhook logs</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-xs text-zinc-500">
            &copy; 2025 PayVault. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 p-6 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
            <CreditCard className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight">PayVault</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
