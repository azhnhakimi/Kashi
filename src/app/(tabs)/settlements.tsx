import type { TobBarSelection } from "@/components/settlements/TopBar";
import { useState } from "react";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import IncomingContent from "@/components/settlements/IncomingContent";
import OutgoingContent from "@/components/settlements/OutgoingContent";
import TopBar from "@/components/settlements/TopBar";

const Settlements = () => {
  const [content, setContent] = useState<TobBarSelection>("incoming");

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-2" edges={["top"]}>
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
    </SafeAreaView>
  );
};

export default Settlements;
