import SettlementForm from "@/components/settlements/SettlementForm";
import { fetchSettlement } from "@/lib/settlements";
import type { SettlementRecord, SettlementSource } from "@/types/settlements";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HeaderProps = {
  mode: string;
  source: string;
};

const Header = ({ mode, source }: HeaderProps) => {
  const route = useRouter();

  return (
    <View className="flex flex-row gap-3 items-center mb-4">
      <Pressable onPress={() => route.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          className="text-kashi-text-primary mr-4"
        />
      </Pressable>
      <View className="bg-kashi-accent p-2 rounded-lg">
        <Ionicons name="cash" size={18} color="white" />
      </View>
      <Text className="text-kashi-text-primary font-grotesk-semibold text-xl capitalize">
        {mode} {source}
      </Text>
    </View>
  );
};

const SettlementTemplate = () => {
  const { mode, source, id } = useLocalSearchParams<{
    mode: string;
    source: SettlementSource;
    id: string;
  }>();

  const [record, setRecord] = useState<SettlementRecord>();
  const [loading, setLoading] = useState(mode === "Edit");
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "Edit";

  useEffect(() => {
    if (!isEdit) return;

    let isMounted = true;

    const loadSettlement = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchSettlement(id);

        if (isMounted) setRecord(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load settlement.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadSettlement();

    return () => {
      isMounted = false;
    };
  }, [id, isEdit]);

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top", "bottom"]}>
      <Header mode={mode} source={source} />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-kashi-text-secondary font-grotesk text-center">
            {error}
          </Text>
        </View>
      ) : (
        <SettlementForm source={record?.source ?? source} settlement={record} />
      )}
    </SafeAreaView>
  );
};

export default SettlementTemplate;
