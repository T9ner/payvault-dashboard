import { useEffect, useState, useRef } from "react";
import { payments } from "@/lib/api";
import { formatCurrency, formatDate, copyToClipboard } from "@/lib/formatters";
import type { Transaction } from "@/lib/types";
import {
  ArrowLeftRight,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2">
      <span className="text-sm text-[hsl(var(--muted-foreground))]">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%] break-all">{value}</span>
    </div>
  );
}

const statusColors: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  refunded: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
};

const statusTabs = ["all", "success", "pending", "failed", "refunded"];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState("");
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [refunding, setRefunding] = useState(false);
  const perPage = 20;
  const hasFetched = useRef(false);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params: { page: number; limit: number; status?: string } = {
        page,
        limit: perPage,
      };
      if (filter !== "all") params.status = filter;
      const data = await payments.listTransactions(params);
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
    }
    loadTransactions();
  }, [page, filter]);

  const handleCopy = async (text: string, id: string) => {
    await copyToClipboard(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleRefund = async () => {
    if (!selected) return;
    if (!confirm(`Refund transaction ${selected.reference}?`)) return;
    setRefunding(true);
    try {
      await payments.refund({ reference: selected.reference });
      setSelected(null);
      await loadTransactions();
    } catch {
      alert("Refund failed");
    } finally {
      setRefunding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          View and manage all payment transactions
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 rounded-lg border bg-[hsl(var(--card))] p-1">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab);
              setPage(1);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === tab
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-[hsl(var(--card))]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--muted-foreground))]" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[hsl(var(--muted-foreground))]">
            <ArrowLeftRight size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-[hsl(var(--muted-foreground))]">
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Provider</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b last:border-0 cursor-pointer hover:bg-[hsl(var(--accent))]"
                    onClick={() => setSelected(tx)}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {tx.reference.slice(0, 12)}...
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tx.reference, tx.id);
                          }}
                          className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                        >
                          {copied === tx.id ? (
                            <Check size={14} className="text-emerald-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">{tx.customer_email}</td>
                    <td className="px-6 py-3 text-sm font-medium">
                      {formatCurrency(tx.amount, tx.currency)}
                    </td>
                    <td className="px-6 py-3 text-sm capitalize">{tx.provider}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[tx.status] || statusColors.pending
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-[hsl(var(--muted-foreground))]">
                      {formatDate(tx.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between border-t px-6 py-3">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Page {page}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-md border p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={transactions.length < perPage}
                onClick={() => setPage(page + 1)}
                className="rounded-md border p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-[hsl(var(--card))] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Transaction Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md p-1 hover:bg-[hsl(var(--accent))]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="divide-y">
              <DetailRow label="Reference" value={selected.reference} />
              <DetailRow label="Customer" value={selected.customer_email} />
              <DetailRow
                label="Amount"
                value={formatCurrency(selected.amount, selected.currency)}
              />
              <DetailRow label="Provider" value={selected.provider} />
              <DetailRow label="Status" value={selected.status} />
              <DetailRow label="Created" value={formatDate(selected.created_at)} />
              <DetailRow label="Updated" value={formatDate(selected.updated_at)} />
            </div>
            {selected.status === "success" && (
              <button
                onClick={handleRefund}
                disabled={refunding}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                {refunding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RotateCcw size={14} />
                    Refund Transaction
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
