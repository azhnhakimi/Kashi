import { CATEGORY_META, type Category } from "@/constants/category";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDb, initDb } from "../../../db";
import {
  addMerchantCategory,
  categoryFor,
  listMerchantCategories,
  removeMerchantCategory,
} from "../../../merchantCategories";
import { MIN_FRAGMENT_LENGTH, isValidFragment } from "../../../ownTransfers";

import MappingHeader from "@/components/mapping/MappingHeader";
import MappingItem from "@/components/mapping/MappingItem";

type Entry = { id: number; fragment: string; category: string };

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

const hexToRgba = (hex: string, opacity: number) => {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const Mapping = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Category | null>(null);

  const load = useCallback(async () => {
    await initDb();
    const db = await getDb();
    const list = (await listMerchantCategories()) as Entry[];
    setEntries(list);
    const rows = (await db.getAllAsync(
      "SELECT merchant FROM transactions WHERE source = 'auto' AND merchant IS NOT NULL GROUP BY merchant ORDER BY MAX(occurred_at) DESC LIMIT 15",
    )) as { merchant: string }[];
    setSuggestions(
      rows
        .map((r) => r.merchant)
        .filter((m) => categoryFor(m, list) === "miscellaneous"),
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const add = async () => {
    if (!isValidFragment(input)) {
      Alert.alert(
        "Too short",
        `Use at least ${MIN_FRAGMENT_LENGTH} characters.`,
      );
      return;
    }
    if (!selected) {
      Alert.alert("Pick a category");
      return;
    }
    await addMerchantCategory(input, selected);
    setInput("");
    setSelected(null);
    await load();
  };

  const remove = async (id: number) => {
    await removeMerchantCategory(id);
    await load();
  };

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <MappingHeader />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 18,
        }}
      >
        {suggestions.length > 0 ? (
          <>
            <Text className="text-kashi-text-muted font-grotesk leading-tight tracking-tighter">
              Recent merchants without a category (tap to fill)
            </Text>
            {suggestions.map((m) => (
              <Pressable
                key={m}
                onPress={() => setInput(m)}
                className="bg-kashi-accent py-3 px-4 rounded-lg justify-center items-start"
              >
                <Text className="text-kashi-text-primary font-grotesk">
                  {m}
                </Text>
              </Pressable>
            ))}
          </>
        ) : null}

        <View className="gap-1">
          <Text className="text-kashi-text-muted text-sm font-grotesk-semibold mt-4">
            Merchant text
          </Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="e.g. GRAB"
            autoCapitalize="none"
            autoCorrect={false}
            className="bg-kashi-surface px-4 py-5 rounded-lg text-kashi-text-primary font-grotesk"
          />
        </View>

        <View className="gap-1">
          <Text className="text-kashi-text-muted text-sm font-grotesk-semibold mt-4">
            Category
          </Text>
          <View className="gap-2">
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setSelected(c)}
                style={[
                  {
                    borderColor:
                      selected === c ? CATEGORY_META[c].color : "transparent",
                    backgroundColor: hexToRgba(CATEGORY_META[c].color, 0.1),
                  },
                ]}
                className="p-2 px-4 rounded-lg border-2"
              >
                <Text
                  className="font-grotesk"
                  style={[{ color: CATEGORY_META[c].color }]}
                >
                  {CATEGORY_META[c].label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          className="bg-kashi-accent p-4 rounded-lg justify-center items-center mt-2"
          onPress={add}
        >
          <Text className="uppercase font-grotesk-semibold text-kashi-text-primary">
            Add
          </Text>
        </Pressable>

        <Text className="font-grotesk text-kashi-text-muted mt-6">
          Your entries ({entries.length})
        </Text>
        {entries.length === 0 ? (
          <Text className="text-kashi-text-muted font-grotesk">
            None yet...
          </Text>
        ) : null}

        {entries.map((e) => (
          <MappingItem
            key={e.id}
            fragment={e.fragment}
            category={e.category as Category}
            onPress={() => remove(e.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Mapping;
