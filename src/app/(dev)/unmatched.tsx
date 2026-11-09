import { SafeAreaView } from "react-native-safe-area-context";

import UnmatchedHeader from "@/components/unmatched/UnmatchedHeader";

const Unmatched = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <UnmatchedHeader />
    </SafeAreaView>
  );
};

export default Unmatched;
