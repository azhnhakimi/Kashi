import { SafeAreaView } from "react-native-safe-area-context";

import ArchiveHeader from "@/components/archive/ArchiveHeader";

const Archive = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <ArchiveHeader />
    </SafeAreaView>
  );
};

export default Archive;
