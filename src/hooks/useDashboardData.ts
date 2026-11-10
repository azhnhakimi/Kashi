import type { Category } from "@/constants/category";
import { toMonthKey } from "@/hooks/useTransactions";
import { fetchTransactionsByMonth } from "@/lib/transactions";
import type {
  DailySpending,
  MonthlySpending,
  Transaction,
} from "@/types/transaction";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

const MONTHS = 12;

const monthLabel = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

// Set to false to chart the whole month, including days that haven't happened.
const throughToday = true;

const round = (n: number) => Math.round(n * 100) / 100;
const sum = (list: Transaction[] = []) =>
  round(list.reduce((s, t) => s + t.amount, 0));

// Oldest first, current month last.
const lastMonths = (n: number) => {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return { date, key: toMonthKey(date) };
  });
};

// Defined outside the hook so its reference is stable.
const combine = (results: UseQueryResult<Transaction[]>[]) => ({
  data: results.map((r) => r.data),
  isPending: results.some((r) => r.isPending),
  isError: results.some((r) => r.isError),
});

export const useDashboardData = () => {
  const currentKey = toMonthKey(new Date());
  const months = useMemo(() => lastMonths(MONTHS), [currentKey]);

  const { data, isPending, isError } = useQueries({
    queries: months.map((m) => ({
      queryKey: ["transactions", m.key],
      queryFn: () => fetchTransactionsByMonth(m.key),
      staleTime: 60_000,
    })),
    combine,
  });

  const stats = useMemo(() => {
    const current = data[MONTHS - 1] ?? [];
    const previous = data[MONTHS - 2] ?? [];
    const [year, month] = currentKey.split("-").map(Number);

    // Monthly card
    const thisMonth = sum(current);
    const lastMonth = sum(previous);
    const comparison = {
      total: thisMonth,
      // null when there's no last month to compare against
      percentage:
        lastMonth > 0
          ? Math.round((Math.abs(thisMonth - lastMonth) / lastMonth) * 1000) /
            10
          : null,
      direction: (thisMonth > lastMonth ? "higher" : "lower") as
        "higher" | "lower",
    };

    // Categories (current month, biggest first, empty ones skipped)
    const byCategory = new Map<Category, number>();
    for (const t of current) {
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
    }
    const categories = [...byCategory.entries()]
      .map(([category, amount]) => ({ category, amount: round(amount) }))
      .sort((a, b) => b.amount - a.amount);

    // Daily (current month; zeros included for days with no spending)
    const daysInMonth = new Date(year, month, 0).getDate();
    const lastDay = throughToday ? new Date().getDate() : daysInMonth;
    const dailyTotals = Array<number>(daysInMonth).fill(0);
    for (const t of current) {
      dailyTotals[Number(t.date.slice(8, 10)) - 1] += t.amount;
    }
    const daily: DailySpending[] = dailyTotals
      .slice(0, lastDay)
      .map((amount, i) => ({
        date: `${currentKey}-${String(i + 1).padStart(2, "0")}`,
        amount: round(amount),
      }));

    // Last 12 months
    const monthly: MonthlySpending[] = months.map((m, i) => ({
      month: monthLabel.format(m.date),
      amount: sum(data[i]),
    }));

    return { comparison, categories, daily, monthly };
  }, [data, months, currentKey]);

  return { ...stats, isPending, isError };
};
