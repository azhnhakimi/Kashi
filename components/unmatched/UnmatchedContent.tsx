import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getDb, initDb } from "../../db";

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
  const router = useRouter();
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
    <View className="flex-1">
      <Text style={styles.heading} className="text-kashi-text-primary">
        Unmatched ({rows.length})
      </Text>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text
            style={styles.empty}
            className="text-kashi-text-muted font-grotesk"
          >
            Nothing unmatched
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card} className="bg-kashi-card">
            <Text
              style={styles.meta}
              className="text-kashi-text-secondary font-grotesk"
            >
              {BANK_NAMES[item.app] ?? item.app} ·{" "}
              {new Date(item.posted_at).toLocaleString()}
            </Text>
            {item.title ? (
              <Text
                style={styles.title}
                className="text-kashi-text-primary font-grotesk"
              >
                {item.title}
              </Text>
            ) : null}
            <Text className="text-kashi-text-secondary font-grotesk">
              {item.body}
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(dev)/create",
                  params: { id: String(item.id) },
                })
              }
              className="bg-kashi-accent p-2 justify-center items-center rounded-lg mt-8 mb-2"
            >
              <Text className="text-kashi-text-onAccent font-grotesk-semibold">
                Create Pattern
              </Text>
            </Pressable>
            <Pressable
              onPress={() => dismiss(item.id)}
              className="bg-kashi-negative/20 p-2 justify-center items-center rounded-lg mb-2"
            >
              <Text className="text-kashi-negative font-grotesk-medium">
                Dismiss
              </Text>
            </Pressable>
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
  empty: { marginTop: 24, textAlign: "center" },
  card: {
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  meta: { fontSize: 12 },
  title: { fontWeight: "600", marginVertical: 2 },
});
