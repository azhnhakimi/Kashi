import { Text, View } from "react-native";

const TotalSpentCard = ({ value }: { value: number }) => {
  return (
    <View className="bg-kashi-card rounded-xl px-4 py-3">
      <Text className="text-kashi-text-secondary text-xs font-grotesk-medium">
        TOTAL SPENT
      </Text>
      <Text className="text-kashi-text-primary text-lg font-grotesk-semibold">
        RM {value.toFixed(2)}
      </Text>
    </View>
  );
};

export default TotalSpentCard;
