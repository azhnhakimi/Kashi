import type { SettlementRecord, SettlementSource } from "@/types/settlements";
import { ensureSession, supabase } from "./supabase";

type Row = {
  id: string;
  source: SettlementSource;
  title: string;
  name: string;
  amount: number | string;
  date: string;
};

const COLUMNS = "id, source, title, name, amount, date";

const fromRow = (r: Row): SettlementRecord => ({
  id: r.id,
  source: r.source,
  title: r.title,
  name: r.name,
  amount: Number(r.amount),
  date: r.date,
});

export const fetchSettlements = async (
  source: SettlementSource,
): Promise<SettlementRecord[]> => {
  await ensureSession();

  const { data, error } = await supabase
    .from("settlements")
    .select(COLUMNS)
    .eq("source", source)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data as Row[]).map(fromRow);
};

export const fetchSettlement = async (
  id: string,
): Promise<SettlementRecord> => {
  await ensureSession();

  const { data, error } = await supabase
    .from("settlements")
    .select(COLUMNS)
    .eq("id", id)
    .single();

  if (error) throw error;

  return fromRow(data as Row);
};

export const createSettlement = async (
  settlement: Omit<SettlementRecord, "id">,
): Promise<void> => {
  await ensureSession();

  const { error } = await supabase.from("settlements").insert({
    source: settlement.source,
    title: settlement.title,
    name: settlement.name,
    amount: settlement.amount,
    date: settlement.date,
  });

  if (error) throw error;
};

export const updateSettlement = async (
  id: string,
  record: Omit<SettlementRecord, "id">,
): Promise<void> => {
  await ensureSession();

  const { error } = await supabase
    .from("settlements")
    .update({
      source: record.source,
      title: record.title,
      name: record.name,
      amount: record.amount,
      date: record.date,
    })
    .eq("id", id);

  if (error) throw error;
};

export const deleteSettlement = async (id: string): Promise<void> => {
  await ensureSession();

  const { error } = await supabase.from("settlements").delete().eq("id", id);

  if (error) throw error;
};
