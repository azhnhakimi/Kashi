import { ScrollView, View } from "react-native";

import { incomingRecords } from "@/mock_data/settlement_records";

import CreateRecordBtn from "./CreateRecordBtn";
import RecordItem from "./RecordItem";

const IncomingContent = () => {
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
        {incomingRecords.map((record, idx) => (
          <RecordItem record={record} key={idx} mode="incoming"/>
        ))}
      </ScrollView>

      <CreateRecordBtn mode="incoming" />
    </View>
  );
};

export default IncomingContent;
