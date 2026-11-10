import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDb } from "../../../db";
import { reprocessUnmatched } from "../../../ingest";
import {
  matchNotification,
  suggestTemplate,
  validateTemplate,
} from "../../../matcher";

type Row = {
  id: number;
  app: string;
  title: string | null;
  body: string;
  posted_at: number;
};

type Action = "expense" | "ignore";

export default function CreatePatternScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [source, setSource] = useState<Row | null>(null);
  const [others, setOthers] = useState<Row[]>([]);
  const [template, setTemplate] = useState("");
  const [action, setAction] = useState<Action>("expense");
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  useEffect(() => {
    (async () => {
      const db = await getDb();
      const rows = (await db.getAllAsync(
        "SELECT id, app, title, body, posted_at FROM notifications WHERE status = 'unmatched'",
      )) as Row[];
      const row = rows.find((r) => String(r.id) === String(id)) ?? null;
      setSource(row);
      setOthers(rows.filter((r) => String(r.id) !== String(id)));
      if (row) setTemplate(suggestTemplate(row.body));
    })();
  }, [id]);

  const error = useMemo(
    () => validateTemplate(template, action),
    [template, action],
  );

  const draft = useMemo(
    () =>
      source
        ? [{ id: "draft", app: source.app, template, action, enabled: 1 }]
        : [],
    [source, template, action],
  );

  const preview = useMemo(
    () => (source && !error ? matchNotification(draft, source) : null),
    [source, error, draft],
  );

  const alsoMatches = useMemo(
    () => (error ? [] : others.filter((r) => matchNotification(draft, r))),
    [error, others, draft],
  );

  const insert = (token: string) => {
    const { start, end } = selection;
    setTemplate(template.slice(0, start) + token + template.slice(end));
  };

  const ok = !error && !!preview;

  let status = "";
  if (error) status = error;
  else if (!preview)
    status = "This template does not match the notification above";
  else if (action === "ignore")
    status = "Matches. Matching notifications will be ignored";
  else
    status = `Matches. Amount RM${((preview.amountSen ?? 0) / 100).toFixed(2)}, merchant: ${preview.merchant ?? "(none)"}`;

  const save = async () => {
    if (!source) return;
    const db = await getDb();
    await db.runAsync(
      "INSERT INTO patterns (id, app, template, action, enabled, built_in, created_at) VALUES (?, ?, ?, ?, 1, 0, ?)",
      [`user-${Date.now()}`, source.app, template.trim(), action, Date.now()],
    );
    const n = await reprocessUnmatched();
    Alert.alert(
      "Pattern saved",
      `${n} notification${n === 1 ? "" : "s"} matched`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  if (!source) {
    return (
      <SafeAreaView
        className="bg-kashi-bg flex-1 justify-center items-center"
        edges={["top"]}
      >
        <Text className="text-kashi-text-primary font-grotesk">
          Notification not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      className="bg-kashi-bg p-2 py-6 flex-1"
    >
      <Text
        style={styles.label}
        className="text-kashi-text-secondary font-grotesk"
      >
        Original notification
      </Text>
      <View style={styles.card} className="bg-kashi-card">
        <Text className="text-kashi-text-primary font-grotesk-medium">
          {source.body}
        </Text>
      </View>

      <Text style={styles.label} className="text-kashi-text-muted font-grotesk">
        Template
      </Text>
      <TextInput
        style={styles.input}
        value={template}
        onChangeText={setTemplate}
        onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        className="text-kashi-text-primary font-grotesk"
      />
      <Text
        style={styles.hint}
        className="text-kashi-text-muted font-grotesk mt-8"
      >
        Select the part that changes (merchant name, account digits) and tap a
        placeholder to replace it.
      </Text>
      <View style={styles.row}>
        <Pressable
          className="bg-kashi-surface justify-center items-center py-2 px-6 rounded-lg"
          onPress={() => insert("{amount}")}
        >
          <Text className="text-kashi-text-primary font-grotesk">
            {"{amount}"}
          </Text>
        </Pressable>
        <Pressable
          className="bg-kashi-surface justify-center items-center py-2 px-6 rounded-lg"
          onPress={() => insert("{merchant}")}
        >
          <Text className="text-kashi-text-primary font-grotesk">
            {"{merchant}"}
          </Text>
        </Pressable>
        <Pressable
          className="bg-kashi-surface justify-center items-center py-2 px-6 rounded-lg"
          onPress={() => insert("{*}")}
        >
          <Text className="text-kashi-text-primary font-grotesk">{"{*}"}</Text>
        </Pressable>
      </View>

      <Text
        style={styles.label}
        className="text-kashi-text-secondary font-grotesk"
      >
        What to do with matches
      </Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => setAction("expense")}
          className="bg-kashi-card rounded-lg py-2 px-6 justify-center items-center"
        >
          <Text className="text-kashi-text-primary font-grotesk">{`${action === "expense" ? "✓ " : ""}Record as expense`}</Text>
        </Pressable>
        <Pressable
          onPress={() => setAction("ignore")}
          className="bg-kashi-card rounded-lg py-2 px-6 justify-center items-center"
        >
          <Text className="text-kashi-text-primary font-grotesk">{`${action === "ignore" ? "✓ " : ""}Ignore`}</Text>
        </Pressable>
      </View>

      <Text
        style={[styles.status, ok ? styles.ok : styles.bad]}
        className="font-grotesk-medium"
      >
        {status}
      </Text>
      {ok && alsoMatches.length > 0 ? (
        <Text
          style={styles.hint}
          className="text-kashi-text-muted font-grotesk"
        >
          Will also match {alsoMatches.length} other unmatched notification
          {alsoMatches.length === 1 ? "" : "s"}
        </Text>
      ) : null}

      <Pressable
        className="bg-kashi-accent py-3 justify-center items-center rounded-lg mt-8 disabled:bg-kashi-accent/20"
        onPress={save}
        disabled={!ok}
      >
        <Text className="font-grotesk-semibold text-kashi-text-onAccent">
          Save Pattern
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  label: { fontSize: 12, marginTop: 16, marginBottom: 4 },
  card: { padding: 12, borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
  },
  hint: { fontSize: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  status: { marginVertical: 16, fontWeight: "600" },
  ok: { color: "#2e7d32" },
  bad: { color: "#c62828" },
});
