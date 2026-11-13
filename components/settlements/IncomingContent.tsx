import { Pressable, ScrollView, Text, View } from "react-native";

import useSettlements from "@/hooks/useSettlements";

import SettlementsSkeleton from "../skeletons/SettlementsSkeleton";
import CreateRecordBtn from "./CreateRecordBtn";
import RecordItem from "./RecordItem";

const IncomingContent = () => {
  const { records, loading, error, refetch } = useSettlements("incoming");

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 18,
          flexGrow: 1,
        }}
      >
        {loading ? (
          <SettlementsSkeleton />
        ) : error ? (
          <Pressable onPress={() => refetch()}>
            <Text className="text-kashi-text-secondary font-grotesk text-center mt-6">
              {error}
            </Text>
            <Text className="text-kashi-accent font-grotesk-medium text-center mt-2">
              Tap to retry
            </Text>
          </Pressable>
        ) : records.length === 0 ? (
          <Text className="text-kashi-text-muted font-grotesk text-center mt-6">
            No incoming records yet.
          </Text>
        ) : (
          records.map((record) => (
            <RecordItem record={record} key={record.id} mode="incoming" />
          ))
        )}
      </ScrollView>

      <CreateRecordBtn mode="incoming" />
    </View>
  );
};

export default IncomingContent;
