import type { SettlementRecord } from "@/types/settlements";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const RecordItem = ({
  record,
  mode,
}: {
  record: SettlementRecord;
  mode: string;
}) => {
  const router = useRouter();

  return (
    <Pressable
      className="bg-kashi-card p-4 border rounded-lg flex flex-row items-center"
      onPress={() => {
        router.push({
          pathname: "/settlements/template",
          params: { mode: "Edit", source: mode, id: record.id },
        });
      }}
    >
      <View className="flex-1">
        <Text className="text-kashi-text-primary font-grotesk-bold">
          {record.title}
        </Text>
        <Text className="text-kashi-text-muted font-grotesk">
          {formatDate(record.date)}
        </Text>
        <Text className="text-kashi-text-secondary font-grotesk-medium">
          {record.name}
        </Text>
      </View>
      <Text className="text-kashi-text-primary font-grotesk-semibold text-lg">
        RM {record.amount.toFixed(2)}
      </Text>
    </Pressable>
  );
};

export default RecordItem;
