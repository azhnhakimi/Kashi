import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import MonthlyNavigator from "@/components/transactions/MonthlyNavigator";
import TransactionsHeader from "@/components/transactions/TransactionsHeader";

const Transactions = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPrev = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const goToNext = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const goToNow = () => {
    setCurrentDate(new Date());
  };

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-6" edges={["top"]}>
      <TransactionsHeader />
      <MonthlyNavigator
        date={currentDate}
        onPrev={goToPrev}
        onNext={goToNext}
        onNow={goToNow}
      />
    </SafeAreaView>
  );
};

export default Transactions;
