import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_CATEGORY_SPENDING } from "@/mock_data/category_spending";

import CategoriesSpendingList from "@/components/dashboard/CategoriesSpendingList";
import DailySpendingChart from "@/components/dashboard/DailySpendingChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MonthlySpendingCard from "@/components/dashboard/MonthlySpendingCard";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg" edges={["top"]}>
      <ScrollView
        className="flex-1 p-4"
        contentContainerClassName="gap-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader />
        <MonthlySpendingCard />
        <CategoriesSpendingList data={MOCK_CATEGORY_SPENDING} />
        <DailySpendingChart />
      </ScrollView>
    </SafeAreaView>
  );
}
