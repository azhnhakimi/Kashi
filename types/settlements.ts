export type SettlementSource = "incoming" | "outgoing";

export type SettlementRecord = {
  id: string;
  name: string;
  amount: number;
  date: string;
  title: string;
  source: SettlementSource;
};
