"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-[hsl(var(--background))]/80 px-6 backdrop-blur-sm">
      {/* Left: Page context / breadcrumb area */}
      <div className="lg:pl-0 pl-12">
        <h2 className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Dashboard</h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))]">
          <Bell size={18} />
        </button>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--accent))]">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {/* Avatar */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xs font-semibold text-[hsl(var(--primary-foreground))]">
          PV
        </div>
      </div>
    </header>
  );
}
