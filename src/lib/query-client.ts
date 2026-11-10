import type { Transaction } from "@/types/transaction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { Alert, AppState } from "react-native";
import { upsertTransaction, deleteTransaction } from "./transactions";

const DAY = 24 * 60 * 60 * 1000;
export const CACHE_MAX_AGE = 30 * DAY;

export const MUTATION_KEYS = {
  upsert: ["transactions", "upsert"] as const,
  remove: ["transactions", "remove"] as const,
};

const TX_SCOPE = { id: "transactions" };

// Refetch only when the last queued write (create/edit/delete) finishes,
// so stale server data can't overwrite pending optimistic changes.
const settle = () => {
  const pending = queryClient.isMutating({
    predicate: (m) => m.options.scope?.id === TX_SCOPE.id,
  });
  if (pending <= 1) {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: CACHE_MAX_AGE, retry: 2 },
  },
});

export const persister = createAsyncStoragePersister({ storage: AsyncStorage });

// Tell TanStack when the device is online / app is focused.
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((s) => setOnline(!!s.isConnected)),
);
AppState.addEventListener("change", (s) =>
  focusManager.setFocused(s === "active"),
);

export const monthKeyOf = (date: string) => date.slice(0, 7); // "YYYY-MM"

// Write a transaction into every cached month list + the single-item cache.
const cacheUpsert = (t: Transaction) => {
  queryClient.setQueryData(["transaction", t.id], t);

  for (const [key, old] of queryClient.getQueriesData<Transaction[]>({
    queryKey: ["transactions"],
  })) {
    if (!old) continue;
    const month = key[1] as string;
    const without = old.filter((x) => x.id !== t.id);
    const next =
      month === monthKeyOf(t.date)
        ? [t, ...without].sort((a, b) => b.date.localeCompare(a.date))
        : without;
    queryClient.setQueryData(key, next);
  }
};

// Defaults live here (not in the hook) so queued mutations can resume
// after an app restart.
queryClient.setMutationDefaults(MUTATION_KEYS.upsert, {
  mutationFn: (t: Transaction) => upsertTransaction(t),
  scope: TX_SCOPE,
  retry: 3,
  onMutate: async (t: Transaction) => {
    await queryClient.cancelQueries({ queryKey: ["transactions"] });
    await queryClient.cancelQueries({ queryKey: ["transaction", t.id] });
    cacheUpsert(t);
  },
  onError: () => {
    Alert.alert(
      "Couldn't save transaction",
      "It failed to sync and has been reverted.",
    );
  },
  onSettled: settle,
});

queryClient.setMutationDefaults(MUTATION_KEYS.remove, {
  mutationFn: (id: string) => deleteTransaction(id),
  scope: TX_SCOPE, // same scope: a create followed by a delete runs in order
  retry: 3,
  onMutate: async (id: string) => {
    await queryClient.cancelQueries({ queryKey: ["transactions"] });

    for (const [key, old] of queryClient.getQueriesData<Transaction[]>({
      queryKey: ["transactions"],
    })) {
      if (old) {
        queryClient.setQueryData(
          key,
          old.filter((t) => t.id !== id),
        );
      }
    }
  },
  onError: () => {
    Alert.alert(
      "Couldn't delete transaction",
      "It failed to sync and has been restored.",
    );
  },
  onSettled: (_data, _error, id: string) => {
    queryClient.removeQueries({ queryKey: ["transaction", id] });
    settle();
  },
});
