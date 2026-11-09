import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { MOCK_TRANSACTIONS } from "@/mock_data/transactions";

import EditTransactionHeader from "@/components/transactions/EditTransactionHeader";
import TransactionForm from "@/components/transactions/TransactionForm";

const EditTransaction = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const transaction = MOCK_TRANSACTIONS.find((t) => t.id === id);

  if (!transaction) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-2" edges={["top"]}>
      <EditTransactionHeader />
      <TransactionForm key={transaction.id} transaction={transaction} />
    </SafeAreaView>
  );
};

export default EditTransaction;
