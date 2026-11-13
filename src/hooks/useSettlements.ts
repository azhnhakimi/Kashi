import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { fetchSettlements } from "@/lib/settlements";
import type { SettlementRecord, SettlementSource } from "@/types/settlements";

const useSettlements = (source: SettlementSource) => {
  const [records, setRecords] = useState<SettlementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchSettlements(source);
      setRecords(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch settlements.",
      );
    } finally {
      setLoading(false);
    }
  }, [source]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  return { records, loading, error, refetch };
};

export default useSettlements;
