import NotificationAccessBanner from "@/components/unmatched/NotificationAccessBanner";
import UnmatchedContent from "@/components/unmatched/UnmatchedContent";
import UnmatchedHeader from "@/components/unmatched/UnmatchedHeader";

import { Screen } from "@/components/ui/Screen";

const Unmatched = () => {
  return (
    <Screen>
      <UnmatchedHeader />
      <NotificationAccessBanner />
      <UnmatchedContent />
    </Screen>
  );
};

export default Unmatched;
