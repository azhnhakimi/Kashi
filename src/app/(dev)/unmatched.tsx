import { SafeAreaView } from "react-native-safe-area-context";

import NotificationAccessBanner from "@/components/unmatched/NotificationAccessBanner";
import UnmatchedContent from "@/components/unmatched/UnmatchedContent";
import UnmatchedHeader from "@/components/unmatched/UnmatchedHeader";

const Unmatched = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <UnmatchedHeader />
      <NotificationAccessBanner />
      <UnmatchedContent />
    </SafeAreaView>
  );
};

export default Unmatched;
