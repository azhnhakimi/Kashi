import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import AddTransactionBtn from "@/components/transactions/AddTransactionBtn";
import MonthlyNavigator from "@/components/transactions/MonthlyNavigator";
import TotalSpentCard from "@/components/transactions/TotalSpentCard";
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
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-2" edges={["top"]}>
      <TransactionsHeader />
      <MonthlyNavigator
        date={currentDate}
        onPrev={goToPrev}
        onNext={goToNext}
        onNow={goToNow}
      />
      <AddTransactionBtn />
      <TotalSpentCard value={526.7} />
    </SafeAreaView>
  );
};

export default Transactions;
