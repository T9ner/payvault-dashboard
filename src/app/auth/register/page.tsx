"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/api";
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock, Building2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await auth.register({
        business_name: businessName,
        email,
        password,
      });
      auth.setToken(res.token);
      // Small delay to ensure cookie is persisted before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Start accepting payments in under 10 minutes
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="businessName">
            Business name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Acme Inc."
              required
              className="flex h-11 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-10 pr-3.5 py-2 text-sm outline-none transition-all placeholder:text-[hsl(var(--muted-foreground))]/50 hover:border-[hsl(var(--muted-foreground))]/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">
            Work email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              required
              className="flex h-11 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-10 pr-3.5 py-2 text-sm outline-none transition-all placeholder:text-[hsl(var(--muted-foreground))]/50 hover:border-[hsl(var(--muted-foreground))]/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
              className="flex h-11 w-full rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] pl-10 pr-10 py-2 text-sm outline-none transition-all placeholder:text-[hsl(var(--muted-foreground))]/50 hover:border-[hsl(var(--muted-foreground))]/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Must contain at least 8 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Get started
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">
          By creating an account, you agree to our{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-2 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors">
            Privacy Policy
          </span>
        </p>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[hsl(var(--border))]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[hsl(var(--background))] px-3 text-[hsl(var(--muted-foreground))]">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Sign in CTA */}
      <Link
        href="/auth/login"
        className="flex h-11 w-full items-center justify-center rounded-lg border-2 border-emerald-600/20 bg-emerald-50 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-100 hover:border-emerald-600/30 active:scale-[0.98] dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-950/50"
      >
        Sign in instead
      </Link>
    </div>
  );
}
