import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  AppState,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getDb, initDb } from "../../db";
import { resetDemo } from "../../seed";

type Row = {
  id: number;
  app: string;
  title: string | null;
  body: string;
  posted_at: number;
};

const BANK_NAMES: Record<string, string> = {
  "com.cimb.cimbocto": "CIMB",
  "com.bankislam.bimbmobile": "Bank Islam",
};

export default function UnmatchedContent() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    await initDb();
    const db = await getDb();
    const result = await db.getAllAsync(
      "SELECT id, app, title, body, posted_at FROM notifications WHERE status = 'unmatched' ORDER BY posted_at DESC",
    );
    setRows(result as Row[]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") load();
    });
    return () => sub.remove();
  }, [load]);

  const dismiss = async (id: number) => {
    const db = await getDb();
    await db.runAsync(
      "UPDATE notifications SET status = 'ignored' WHERE id = ?",
      [id],
    );
    await load();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Unmatched ({rows.length})</Text>
      {__DEV__ && (
        <Button
          title="Reset demo data"
          onPress={async () => {
            await resetDemo();
            await load();
          }}
        />
      )}
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>Nothing unmatched</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.meta}>
              {BANK_NAMES[item.app] ?? item.app} ·{" "}
              {new Date(item.posted_at).toLocaleString()}
            </Text>
            {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
            <Text>{item.body}</Text>
            <Button title="Dismiss" onPress={() => dismiss(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  empty: { marginTop: 24, textAlign: "center", color: "#888" },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginTop: 8,
  },
  meta: { fontSize: 12, color: "#888" },
  title: { fontWeight: "600", marginVertical: 2 },
});
