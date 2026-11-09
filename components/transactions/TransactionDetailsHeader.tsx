import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const TransactionDetailsHeader = () => {
  const route = useRouter();

  return (
    <View className="flex flex-row gap-3 items-center mb-4">
      <Pressable onPress={() => route.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          className="text-kashi-text-primary mr-4"
        />
      </Pressable>
      <View className="bg-kashi-accent p-2 rounded-lg">
        <Ionicons name="receipt" size={18} color="white" />
      </View>
      <Text className="text-kashi-text-primary font-grotesk-semibold text-xl">
        Transaction Details
      </Text>
    </View>
  );
};

export default TransactionDetailsHeader;
