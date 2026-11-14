import { useDashboardData } from "@/hooks/useDashboardData";
import { ScrollView, View } from "react-native";

import CategoriesSpendingList from "@/components/dashboard/CategoriesSpendingList";
import DailySpendingChart from "@/components/dashboard/DailySpendingChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LatestMonthStatsChart from "@/components/dashboard/LatestMonthsStatsChart";
import MonthlySpendingCard from "@/components/dashboard/MonthlySpendingCard";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { Screen } from "@/components/ui/Screen";

export default function Index() {
  const { comparison, categories, daily, monthly, isPending } =
    useDashboardData();

  return (
    <Screen>
      <ScrollView
        className="flex-1"
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
    </Screen>
  );
}
