import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { mockMappings } from "@/mock_data/mappings";

import CreateMappingBtn from "@/components/mapping/CreateMappingBtn";
import MappingHeader from "@/components/mapping/MappingHeader";
import MappingItem from "@/components/mapping/MappingItem";

const Mapping = () => {
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
        {mockMappings.map((item, idx) => (
          <MappingItem item={item} key={idx} />
        ))}
      </ScrollView>
      <CreateMappingBtn />
    </SafeAreaView>
  );
};

export default Mapping;
