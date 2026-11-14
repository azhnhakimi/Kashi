import type { TobBarSelection } from "@/components/settlements/TopBar";
import { useState } from "react";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

import IncomingContent from "@/components/settlements/IncomingContent";
import OutgoingContent from "@/components/settlements/OutgoingContent";
import SettlementsHeader from "@/components/settlements/SettlementsHeader";
import TopBar from "@/components/settlements/TopBar";
import { Screen } from "@/components/ui/Screen";

const Settlements = () => {
  const [content, setContent] = useState<TobBarSelection>("incoming");

  return (
    <Screen className="gap-4">
      <SettlementsHeader />
      <TopBar content={content} setContent={setContent} />
      <Animated.View
        key={content}
        className="flex-1 overflow-hidden"
        entering={
          content === "incoming"
            ? SlideInLeft.duration(150)
            : SlideInRight.duration(150)
        }
        exiting={
          content === "incoming"
            ? SlideOutLeft.duration(150)
            : SlideOutRight.duration(150)
        }
      >
        {content === "incoming" ? <IncomingContent /> : <OutgoingContent />}
      </Animated.View>
    </Screen>
  );
};

export default Settlements;
