import { MUTATION_KEYS, queryClient } from "@/lib/query-client";
import { fetchTransaction, fetchTransactionsByMonth } from "@/lib/transactions";
import type { Transaction } from "@/types/transaction";
import { useMutation, useQuery } from "@tanstack/react-query";

export const toMonthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const useTransactions = (month: Date) => {
  const key = toMonthKey(month);
  return useQuery({
    queryKey: ["transactions", key],
    queryFn: () => fetchTransactionsByMonth(key),
  });
};

export const useTransaction = (id: string) =>
  useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      return fetchTransaction(id);
    },
    // Show instantly from any cached month list while it refreshes.
    initialData: () =>
      queryClient
        .getQueriesData<Transaction[]>({ queryKey: ["transactions"] })
        .flatMap(([, d]) => d ?? [])
        .find((t) => t.id === id),
  });

export const useUpsertTransaction = () =>
  useMutation<void, Error, Transaction>({ mutationKey: MUTATION_KEYS.upsert });

export const useDeleteTransaction = () =>
  useMutation<void, Error, string>({ mutationKey: MUTATION_KEYS.remove });
