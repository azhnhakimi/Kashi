import type { Category } from "@/constants/category";
import type { Transaction } from "@/types/transaction";
import { ensureSession, supabase } from "./supabase";

type Row = {
  id: string;
  title: string;
  amount: number | string;
  category: Category;
  date: string;
};

const COLUMNS = "id, title, amount, category, date";

const fromRow = (r: Row): Transaction => ({
  id: r.id,
  title: r.title,
  amount: Number(r.amount),
  category: r.category,
  date: r.date,
});

// "2026-11" -> { start: "2026-11-01", end: "2026-12-01" }
const monthRange = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  const end =
    m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return { start: `${month}-01`, end };
};

export const fetchTransactionsByMonth = async (
  month: string,
): Promise<Transaction[]> => {
  await ensureSession();
  const { start, end } = monthRange(month);

  const { data, error } = await supabase
    .from("transactions")
    .select(COLUMNS)
    .gte("date", start)
    .lt("date", end)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Row[]).map(fromRow);
};

export const fetchTransaction = async (id: string): Promise<Transaction> => {
  await ensureSession();
  const { data, error } = await supabase
    .from("transactions")
    .select(COLUMNS)
    .eq("id", id)
    .single();

  if (error) throw error;
  return fromRow(data as Row);
};

// Create and update are the same call. The client generates the id, so
// retrying (e.g. after coming back online) can never create duplicates.
export const upsertTransaction = async (t: Transaction): Promise<void> => {
  await ensureSession();
  const { error } = await supabase.from("transactions").upsert({
    id: t.id,
    title: t.title,
    amount: t.amount,
    category: t.category,
    date: t.date,
  });

  if (error) throw error;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await ensureSession();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
};
