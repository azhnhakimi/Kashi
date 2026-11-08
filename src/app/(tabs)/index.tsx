import { SafeAreaView } from "react-native-safe-area-context";

import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg px-4 py-2" edges={["top"]}>
      <DashboardHeader />
    </SafeAreaView>
  );
}
