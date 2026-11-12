import { useTransactions } from "@/hooks/useTransactions";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TransactionsSkeleton from "@/components/skeletons/TransactionsSkeleton";
import AddTransactionBtn from "@/components/transactions/AddTransactionBtn";
import MonthlyNavigator from "@/components/transactions/MonthlyNavigator";
import TotalSpentCard from "@/components/transactions/TotalSpentCard";
import TransactionItemsList from "@/components/transactions/TransactionItemsList";
import TransactionsHeader from "@/components/transactions/TransactionsHeader";

const Transactions = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data, isPending, isError, refetch } = useTransactions(currentDate);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const total = useMemo(
    () =>
      Math.round((data ?? []).reduce((sum, t) => sum + t.amount, 0) * 100) /
      100,
    [data],
  );

  const goToPrev = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const goToNext = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const goToNow = () => {
    setCurrentDate(new Date());
  };

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-2" edges={["top"]}>
      <TransactionsHeader />
      <MonthlyNavigator
        date={currentDate}
        onPrev={goToPrev}
        onNext={goToNext}
        onNow={goToNow}
      />
      <TotalSpentCard value={total} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, gap: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            colors={["#ffffff"]}
            progressBackgroundColor="#10101D"
          />
        }
      >
        {isPending ? (
          <TransactionsSkeleton />
        ) : isError ? (
          <View className="flex-1 justify-center items-center">
            <Text
              onPress={() => refetch()}
              className="text-kashi-text-secondary text-center font-grotesk"
            >
              Couldn't load transactions. {"\n"}Tap to retry.
            </Text>
          </View>
        ) : (
          <TransactionItemsList data={data ?? []} />
        )}
      </ScrollView>

      <AddTransactionBtn />
    </SafeAreaView>
  );
};

export default Transactions;
