import { Text, View } from "react-native";

const TotalSpentCard = ({ value }: { value: number }) => {
  return (
    <View className="bg-kashi-card rounded-xl px-4 py-3 flex flex-row gap-2 items-end">
      <Text className="text-kashi-text-primary text-lg font-grotesk-semibold leading-none">
        RM {value.toFixed(2)}
      </Text>

      <Text className="text-kashi-text-secondary text-xs font-grotesk-medium leading-none">
        TOTAL SPENT THIS MONTH
      </Text>
    </View>
  );
};

export default TotalSpentCard;
