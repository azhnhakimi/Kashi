import { SafeAreaView } from "react-native-safe-area-context";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MonthlySpendingCard from "@/components/dashboard/MonthlySpendingCard";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-6" edges={["top"]}>
      <DashboardHeader />
      <MonthlySpendingCard />
    </SafeAreaView>
  );
}
