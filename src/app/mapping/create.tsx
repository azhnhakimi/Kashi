import { SafeAreaView } from "react-native-safe-area-context";

import MappingCreateHeader from "@/components/mapping/MappingCreateHeader";

const MappingCreate = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <MappingCreateHeader />
    </SafeAreaView>
  );
};

export default MappingCreate;
