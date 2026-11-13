import { queryClient } from "@/lib/query-client";
import { upsertTransaction } from "@/lib/transactions";
import { randomUUID } from "expo-crypto";
import { useEffect } from "react";
import { AppState } from "react-native";
import { getDb, initDb } from "./db";
import { CATEGORY_META, type Category } from '@/constants/category';
import { categoryFor, listMerchantCategories } from './merchantCategories';

const toCategory = (value: string): Category =>
  value in CATEGORY_META ? (value as Category) : 'miscellaneous';

type Pending = {
  id: number;
  remote_id: string | null;
  amount_sen: number;
  merchant: string | null;
  occurred_at: number;
  app: string;
};

const BANK_NAMES: Record<string, string> = {
  "com.cimb.cimbocto": "CIMB",
  "com.bankislam.bimbmobile": "Bank Islam",
};

const pad = (n: number) => String(n).padStart(2, "0");

const toLocalDate = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

let running: Promise<number> | null = null;

export function syncPendingTransactions(): Promise<number> {
  if (!running) {
    running = run().finally(() => {
      running = null;
    });
  }
  return running;
}

async function run(): Promise<number> {
  await initDb();
  const db = await getDb();
  const rows = (await db.getAllAsync(
    `SELECT t.id, t.remote_id, t.amount_sen, t.merchant, t.occurred_at, n.app
     FROM transactions t
     JOIN notifications n ON n.id = t.notification_id
     WHERE t.source = 'auto' AND t.synced_at IS NULL
     ORDER BY t.occurred_at`,
  )) as Pending[];

  let sent = 0;
  const entries = await listMerchantCategories();
  for (const row of rows) {
    const remoteId = row.remote_id ?? randomUUID();
    if (!row.remote_id) {
      await db.runAsync("UPDATE transactions SET remote_id = ? WHERE id = ?", [
        remoteId,
        row.id,
      ]);
    }
    try {
      await upsertTransaction({
        id: remoteId,
        title: row.merchant || BANK_NAMES[row.app] || "Bank transaction",
        amount: row.amount_sen / 100,
        category: toCategory(categoryFor(row.merchant, entries)),
        date: toLocalDate(row.occurred_at),
      });
    } catch (e) {
      console.warn("Sync stopped", e);
      break;
    }
    await db.runAsync("UPDATE transactions SET synced_at = ? WHERE id = ?", [
      Date.now(),
      row.id,
    ]);
    sent++;
  }

  if (sent > 0) queryClient.invalidateQueries({ queryKey: ["transactions"] });
  return sent;
}

export function useSyncCapturedTransactions() {
  useEffect(() => {
    syncPendingTransactions();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") syncPendingTransactions();
    });
    return () => sub.remove();
  }, []);
}
