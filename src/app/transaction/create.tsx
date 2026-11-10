import { SafeAreaView } from "react-native-safe-area-context";

import NewTransactionHeader from "@/components/transactions/NewTransactionHeader";
import TransactionForm from "@/components/transactions/TransactionForm";

const TransactionCreate = () => {
  return (
    <SafeAreaView className="flex-1 p-4 gap-2" edges={["top", "bottom"]}>
      <NewTransactionHeader />
      <TransactionForm />
    </SafeAreaView>
  );
};

export default TransactionCreate;
