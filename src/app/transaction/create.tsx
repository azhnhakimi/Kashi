import { SafeAreaView } from "react-native-safe-area-context";

import NewTransactionHeader from "@/components/transactions/NewTransactionHeader";

const TransactionCreate = () => {
  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-6" edges={["top"]}>
      <NewTransactionHeader />
    </SafeAreaView>
  );
};

export default TransactionCreate;
