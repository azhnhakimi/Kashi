import { useTransaction } from "@/hooks/useTransactions";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EditTransactionHeader from "@/components/transactions/EditTransactionHeader";
import TransactionForm from "@/components/transactions/TransactionForm";

const EditTransaction = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { data: transaction, isPending, isError } = useTransaction(id);

  return (
    <SafeAreaView
      className="flex-1 bg-kashi-bg p-4 gap-2"
      edges={["top", "bottom"]}
    >
      <EditTransactionHeader />

      {isPending ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : isError ? (
        <Text className="text-kashi-text-secondary">
          Failed to load transaction.
        </Text>
      ) : transaction ? (
        <TransactionForm key={transaction.id} transaction={transaction} />
      ) : (
        <Text className="text-kashi-text-secondary">
          Transaction not found.
        </Text>
      )}
    </SafeAreaView>
  );
};

export default EditTransaction;
