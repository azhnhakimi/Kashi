import { SafeAreaView } from "react-native-safe-area-context";

import TransactionsHeader from "@/components/transactions/TransactionsHeader";

const Transactions = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4" edges={["top"]}>
      <TransactionsHeader />
    </SafeAreaView>
  );
};

export default Transactions;
