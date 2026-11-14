import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getDb, initDb } from "../../../db";
import {
  MIN_FRAGMENT_LENGTH,
  addFragment,
  isValidFragment,
  listFragments,
  removeFragment,
} from "../../../ownTransfers";

import MyAccountHeader from "@/components/myaccount/MyAccountHeader";
import SelfTransferToggle from "@/components/myaccount/SelfTransferToggle";
import { Screen } from "@/components/ui/Screen";

type Fragment = { id: number; fragment: string };
type Suggestion = { merchant: string };
type Skipped = { id: number; body: string; posted_at: number };

export default function MyAccountsScreen() {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [skipped, setSkipped] = useState<Skipped[]>([]);
  const [input, setInput] = useState("");

  const load = useCallback(async () => {
    await initDb();
    const db = await getDb();
    setFragments((await listFragments()) as Fragment[]);
    setSuggestions(
      (await db.getAllAsync(
        "SELECT merchant FROM transactions WHERE source = 'auto' AND merchant IS NOT NULL GROUP BY merchant ORDER BY MAX(occurred_at) DESC LIMIT 8",
      )) as Suggestion[],
    );
    setSkipped(
      (await db.getAllAsync(
        "SELECT id, body, posted_at FROM notifications WHERE status = 'own_transfer' ORDER BY posted_at DESC LIMIT 10",
      )) as Skipped[],
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const add = async (text: string) => {
    if (!isValidFragment(text)) {
      Alert.alert(
        "Too short",
        `Use at least ${MIN_FRAGMENT_LENGTH} characters so it only matches your own account.`,
      );
      return;
    }
    await addFragment(text);
    setInput("");
    await load();
  };

  const remove = async (id: number) => {
    await removeFragment(id);
    await load();
  };

  const known = new Set(fragments.map((f) => f.fragment));
  const fresh = suggestions.filter((s) => !known.has(s.merchant));

  return (
    <Screen>
      <MyAccountHeader />
      <ScrollView className="" showsVerticalScrollIndicator={false}>
        <SelfTransferToggle />
        <Text
          style={styles.label}
          className="text-kashi-text-secondary font-grotesk"
        >
          Add text that identifies your own account
        </Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="e.g. ***5913"
          autoCapitalize="none"
          autoCorrect={false}
          className="text-kashi-text-primary font-grotesk-medium"
        />
        <Text
          style={styles.hint}
          className="text-kashi-text-muted font-grotesk mb-4"
        >
          A recipient containing this text counts as your own account. Pick
          something only your accounts have, like an account ending.
        </Text>
        <Pressable
          className="bg-kashi-accent justify-center items-center p-3 rounded-lg"
          onPress={() => add(input)}
        >
          <Text className="text-kashi-text-primary font-grotesk-bold uppercase">
            Add
          </Text>
        </Pressable>
        {fresh.length > 0 ? (
          <>
            <Text
              style={styles.label}
              className="text-kashi-text-secondary font-grotesk"
            >
              Recent recipients (tap one that is yours)
            </Text>
            {fresh.map((s) => (
              <View key={s.merchant} style={styles.row}>
                <Text
                  style={styles.grow}
                  className="text-kashi-text-primary font-grotesk-medium"
                >
                  {s.merchant}
                </Text>
                <Pressable
                  className="bg-kashi-accent justify-center items-center py-2 px-6 rounded-lg"
                  onPress={() => add(s.merchant)}
                >
                  <Text className="text-kashi-text-primary font-grotesk-bold uppercase">
                    Add
                  </Text>
                </Pressable>
              </View>
            ))}
          </>
        ) : null}
        <Text
          style={styles.label}
          className="text-kashi-text-secondary font-grotesk"
        >
          Your accounts ({fragments.length})
        </Text>
        {fragments.length === 0 ? (
          <Text
            style={styles.hint}
            className="text-kashi-text-muted font-grotesk"
          >
            None yet...
          </Text>
        ) : null}
        {fragments.map((f) => (
          <View key={f.id} style={styles.row}>
            <Text
              style={styles.grow}
              className="text-kashi-text-primary font-grotesk-medium"
            >
              {f.fragment}
            </Text>
            <Pressable
              className="bg-kashi-negative/10 justify-center items-center py-2 px-6 rounded-lg"
              onPress={() => remove(f.id)}
            >
              <Text className="text-kashi-negative font-grotesk-bold uppercase">
                Remove
              </Text>
            </Pressable>
          </View>
        ))}
        <Text
          style={styles.label}
          className="text-kashi-text-secondary font-grotesk"
        >
          Recently skipped
        </Text>
        {skipped.length === 0 ? (
          <Text
            style={styles.hint}
            className="text-kashi-text-muted font-grotesk"
          >
            Nothing skipped yet...
          </Text>
        ) : null}
        {skipped.map((s) => (
          <View key={s.id} style={styles.card} className="bg-kashi-card">
            <Text
              style={styles.hint}
              className="text-kashi-text-muted text-xs font-grotesk"
            >
              {new Date(s.posted_at).toLocaleString()}
            </Text>
            <Text className="text-kashi-text-primary font-grotesk-semibold">
              {s.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, marginTop: 20, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12 },
  hint: { fontSize: 12, marginVertical: 4 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
  grow: { flex: 1, paddingRight: 8 },
  card: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
});
