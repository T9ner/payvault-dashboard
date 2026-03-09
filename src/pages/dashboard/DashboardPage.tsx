import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { dashboard, payments } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Transaction, DashboardStats } from "@/lib/types";
import {
  DollarSign,
  ArrowLeftRight,
  TrendingUp,
  Link2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
}

function KPICard({ title, value, icon, subtitle }: KPICardProps) {
  return (
    <div className="rounded-xl border bg-[hsl(var(--card))] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</p>
        <div className="rounded-lg bg-[hsl(var(--accent))] p-2 text-[hsl(var(--muted-foreground))]">
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{subtitle}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    refunded: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || colors.pending}`}
    >
      {status}
    </span>
  );
}

const chartData = [
  { name: "Mon", volume: 4200 },
  { name: "Tue", volume: 6800 },
  { name: "Wed", volume: 5100 },
  { name: "Thu", volume: 8900 },
  { name: "Fri", volume: 7200 },
  { name: "Sat", volume: 3400 },
  { name: "Sun", volume: 2100 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function load() {
      const results = await Promise.allSettled([
        dashboard.listPaymentLinks(),
        payments.listTransactions({ limit: 5 }),
      ]);

      const links = results[0].status === "fulfilled" ? results[0].value : [];
      const txns = results[1].status === "fulfilled" ? results[1].value : [];

      const txArray = Array.isArray(txns) ? txns : [];
      const linksArray = Array.isArray(links) ? links : [];

      const totalVolume = txArray.reduce((sum, t) => sum + (t.status === "success" ? t.amount : 0), 0);
      const successCount = txArray.filter((t) => t.status === "success").length;

      setStats({
        total_volume: totalVolume,
        total_transactions: txArray.length,
        success_rate: txArray.length > 0 ? (successCount / txArray.length) * 100 : 0,
        active_links: linksArray.filter((l: { active: boolean }) => l.active).length,
        recent_transactions: txArray.slice(0, 5),
      });
      setTransactions(txArray.slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Overview of your payment activity
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Volume"
          value={formatCurrency(stats?.total_volume ?? 0)}
          icon={<DollarSign size={18} />}
        />
        <KPICard
          title="Transactions"
          value={String(stats?.total_transactions ?? 0)}
          icon={<ArrowLeftRight size={18} />}
        />
        <KPICard
          title="Success Rate"
          value={`${(stats?.success_rate ?? 0).toFixed(1)}%`}
          icon={<TrendingUp size={18} />}
        />
        <KPICard
          title="Active Links"
          value={String(stats?.active_links ?? 0)}
          icon={<Link2 size={18} />}
        />
      </div>

      {/* Chart */}
      <div className="rounded-xl border bg-[hsl(var(--card))] p-6">
        <h3 className="mb-4 text-sm font-medium">Weekly Volume</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(160, 84%, 39%)"
              fill="url(#volumeGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border bg-[hsl(var(--card))]">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-sm font-medium">Recent Transactions</h3>
          <Link
            to="/dashboard/transactions"
            className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--primary))] hover:underline"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
              <ArrowLeftRight size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="px-6 py-3 text-sm font-mono">
                      {tx.reference.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-3 text-sm">{tx.customer_email}</td>
                    <td className="px-6 py-3 text-sm font-medium">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-6 py-3 text-sm text-[hsl(var(--muted-foreground))]">
                      {formatDate(tx.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
