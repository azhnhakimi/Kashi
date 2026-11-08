import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

type MonthlyNavigatorProps = {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onNow: () => void;
};

const MonthlyNavigator = ({
  date,
  onPrev,
  onNext,
  onNow,
}: MonthlyNavigatorProps) => {
  const label = date.toLocaleDateString("en-MY", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth =
    date.getMonth() === new Date().getMonth() &&
    date.getFullYear() === new Date().getFullYear();

  return (
    <View className="bg-kashi-card flex flex-row justify-between items-center p-4 rounded-xl">
      <Pressable onPress={onPrev}>
        <Ionicons
          name="chevron-back"
          size={24}
          className="text-kashi-text-primary"
        />
      </Pressable>

      <View className="flex-1 items-center gap-1">
        <Text className="font-grotesk-bold text-lg text-kashi-text-primary uppercase">
          {label}
        </Text>
        {!isCurrentMonth && (
          <Pressable onPress={onNow}>
            <Text className="font-grotesk-semibold text-xs text-kashi-text-secondary uppercase">
              back to now
            </Text>
          </Pressable>
        )}
      </View>

      <Pressable onPress={onNext}>
        <Ionicons
          name="chevron-forward"
          size={24}
          className="text-kashi-text-primary"
        />
      </Pressable>
    </View>
  );
};

export default MonthlyNavigator;
