import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Link2,
  RefreshCw,
  ShieldAlert,
  Webhook,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", to: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Payment Links", to: "/dashboard/links", icon: Link2 },
  { label: "Subscriptions", to: "/dashboard/subscriptions", icon: RefreshCw },
  { label: "Fraud", to: "/dashboard/fraud", icon: ShieldAlert },
  { label: "Webhooks", to: "/dashboard/webhooks", icon: Webhook },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-[hsl(var(--card))]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))]">
          <span className="text-sm font-bold text-[hsl(var(--primary-foreground))]">PV</span>
        </div>
        <span className="text-lg font-semibold tracking-tight">PayVault</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.to === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
