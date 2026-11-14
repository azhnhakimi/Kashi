import { useDashboardData } from "@/hooks/useDashboardData";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoriesSpendingList from "@/components/dashboard/CategoriesSpendingList";
import DailySpendingChart from "@/components/dashboard/DailySpendingChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LatestMonthStatsChart from "@/components/dashboard/LatestMonthsStatsChart";
import MonthlySpendingCard from "@/components/dashboard/MonthlySpendingCard";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function Index() {
  const { comparison, categories, daily, monthly, isPending } =
    useDashboardData();

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg" edges={["top"]}>
      <ScrollView
        className="flex-1 p-4"
        contentContainerClassName="grow gap-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader />
        {isPending ? (
          <View className="flex-1">
            <DashboardSkeleton />
          </View>
        ) : (
          <>
            <MonthlySpendingCard {...comparison} />
            <CategoriesSpendingList data={categories} />
            <DailySpendingChart data={daily} />
            <LatestMonthStatsChart data={monthly} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
