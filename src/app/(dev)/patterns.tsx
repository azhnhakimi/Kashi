import { SafeAreaView } from "react-native-safe-area-context";

import PatternsContent from "@/components/patterns/PatternsContent";
import PatternsHeader from "@/components/patterns/PatternsHeader";

const Patterns = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <PatternsHeader />
      <PatternsContent />
    </SafeAreaView>
  );
};

export default Patterns;
