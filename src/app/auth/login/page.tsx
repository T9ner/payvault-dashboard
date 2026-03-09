"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/api";
import { CreditCard, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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
      const res = await auth.login({ email, password });
      auth.setToken(res.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--primary))]">
          <CreditCard className="h-6 w-6 text-[hsl(var(--primary-foreground))]" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Sign in to your PayVault dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="merchant@example.com"
            required
            className="flex h-10 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="flex h-10 w-full rounded-lg border bg-transparent px-3 py-2 pr-10 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus:ring-2 focus:ring-[hsl(var(--ring))]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-full items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
