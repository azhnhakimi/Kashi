import { SafeAreaView } from "react-native-safe-area-context";

import UnmatchedContent from "@/components/unmatched/UnmatchedContent";
import UnmatchedHeader from "@/components/unmatched/UnmatchedHeader";

const Unmatched = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-accent p-4" edges={["top"]}>
      <UnmatchedHeader />
      <UnmatchedContent />
    </SafeAreaView>
  );
};

export default Unmatched;
