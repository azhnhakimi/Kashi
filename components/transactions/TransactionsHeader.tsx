import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

const TransactionsHeader = () => {
  return (
    <View className="flex flex-row gap-3 items-center">
      <View className="bg-kashi-accent p-2 rounded-lg">
        <Ionicons name="receipt" size={18} color="white" />
      </View>
      <Text className="text-kashi-text-primary font-grotesk-semibold text-xl">
        Transactions
      </Text>
    </View>
  );
};

export default TransactionsHeader;
