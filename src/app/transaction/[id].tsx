import { type Category } from "@/constants/category";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DeleteTransactionBtn from "@/components/transactions/DeleteTransactionBtn";
import EditTransactionBtn from "@/components/transactions/EditTransactionBtn";
import TransactionDetailsDisplayCard from "@/components/transactions/TransactionDetailsDisplayCard";
import TransactionDetailsHeader from "@/components/transactions/TransactionDetailsHeader";
import TransactionDetailsInfoCard from "@/components/transactions/TransactionDetailsInfoCard";

const TransactionDetails = () => {
  const { id, amount, title, category, date } = useLocalSearchParams<{
    id: string;
    amount: string;
    title: string;
    category: Category;
    date: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-kashi-bg p-4 gap-2" edges={["top"]}>
      <TransactionDetailsHeader />
      <TransactionDetailsDisplayCard
        category={category}
        title={title}
        amount={amount}
      />
      <TransactionDetailsInfoCard
        title={title}
        category={category}
        date={date}
      />
      <View className="mt-auto gap-2 mb-2">
        <EditTransactionBtn id={id}/>
        <DeleteTransactionBtn onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
};

export default TransactionDetails;
