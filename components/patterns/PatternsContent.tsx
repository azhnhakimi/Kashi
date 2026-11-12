import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { getDb, initDb } from "../../db";
import SelfTransferToggle from "../myaccount/SelfTransferToggle";

type Pattern = {
  id: string;
  app: string;
  template: string;
  action: string;
  enabled: number;
  built_in: number;
  matches: number;
};

const BANK_NAMES: Record<string, string> = {
  "com.cimb.cimbocto": "CIMB",
  "com.bankislam.bimbmobile": "Bank Islam",
};

export default function PatternsContent() {
  const router = useRouter();

  const [patterns, setPatterns] = useState<Pattern[]>([]);

  const load = useCallback(async () => {
    await initDb();
    const db = await getDb();
    const result = await db.getAllAsync(
      `SELECT p.id, p.app, p.template, p.action, p.enabled, p.built_in,
        (SELECT COUNT(*) FROM notifications n WHERE n.pattern_id = p.id) AS matches
       FROM patterns p
       ORDER BY p.built_in ASC, p.created_at DESC`,
    );
    setPatterns(result as Pattern[]);
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

  const toggle = async (p: Pattern, value: boolean) => {
    const db = await getDb();
    await db.runAsync("UPDATE patterns SET enabled = ? WHERE id = ?", [
      value ? 1 : 0,
      p.id,
    ]);
    await load();
  };

  const remove = (p: Pattern) => {
    const message =
      p.matches > 0
        ? `${p.matches} notification${p.matches === 1 ? "" : "s"} matched by this pattern will stay recorded.`
        : "This pattern has not matched anything yet.";
    Alert.alert("Delete pattern", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const db = await getDb();
          await db.runAsync(
            "UPDATE notifications SET pattern_id = NULL WHERE pattern_id = ?",
            [p.id],
          );
          await db.runAsync(
            "DELETE FROM patterns WHERE id = ? AND built_in = 0",
            [p.id],
          );
          await load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container} className="py-4">
      <Text
        style={styles.heading}
        className="text-kashi-text-primary font-grotesk"
      >
        Patterns ({patterns.length})
      </Text>

      <View className="bg-kashi-card p-2 rounded-xl mb-4">
        <SelfTransferToggle />
        <Pressable
          className="bg-kashi-accent p-3 justify-center items-center rounded-lg mt-2"
          onPress={() => router.push("/(dev)/myaccount")}
        >
          <Text className="text-kashi-text-onAccent font-grotesk-semibold uppercase">
            my accounts
          </Text>
        </Pressable>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={patterns}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text
            style={styles.empty}
            className="text-kashi-text-muted font-grotesk"
          >
            No patterns yet
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={[styles.card, !item.enabled && styles.disabled]}
            className="bg-kashi-card"
          >
            <View style={styles.header}>
              <Text
                style={styles.meta}
                className="text-kashi-text-secondary font-grotesk"
              >
                {BANK_NAMES[item.app] ?? item.app} ·{" "}
                {item.action === "ignore" ? "Ignore" : "Expense"}
                {item.built_in ? " · Built-in" : ""}
              </Text>
              <Switch
                value={!!item.enabled}
                onValueChange={(v) => toggle(item, v)}
                thumbColor={"#6331FB"}
                trackColor={{
                  false: "#10101D",
                  true: "#6331fb3f",
                }}
              />
            </View>
            <Text
              style={styles.template}
              className="text-kashi-text-primary font-grotesk-medium"
            >
              {item.template}
            </Text>
            <Text
              style={styles.meta}
              className="text-kashi-text-muted font-grotesk"
            >
              Matched {item.matches} notification{item.matches === 1 ? "" : "s"}
            </Text>
            {!item.built_in ? (
              <Pressable
                onPress={() => remove(item)}
                className="bg-kashi-negative/20 p-2 justify-center items-center rounded-lg mt-6"
              >
                <Text className="text-kashi-negative font-grotesk-semibold">
                  Delete
                </Text>
              </Pressable>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  empty: { marginTop: 24, textAlign: "center" },
  card: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  disabled: { opacity: 0.5 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: { fontSize: 12 },
  template: { marginVertical: 6 },
});
