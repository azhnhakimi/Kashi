import { SafeAreaView } from "react-native-safe-area-context";

import PatternsHeader from "@/components/patterns/PatternsHeader";

const Patterns = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <PatternsHeader />
    </SafeAreaView>
  );
};

export default Patterns;
