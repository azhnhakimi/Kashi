import { ScrollView, View } from "react-native";

import { outgoingRecords } from "@/mock_data/settlement_records";

import CreateRecordBtn from "./CreateRecordBtn";
import RecordItem from "./RecordItem";

const OutgoingContent = () => {
  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 18,
        }}
      >
        {outgoingRecords.map((record, idx) => (
          <RecordItem record={record} key={idx} mode="outgoing" />
        ))}
      </ScrollView>
      <CreateRecordBtn mode="outgoing" />
    </View>
  );
};

export default OutgoingContent;
