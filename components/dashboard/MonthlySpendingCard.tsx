import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

type ComparisonBadgeProps = {
  isHigher: boolean;
  percentage: number;
};

const ComparisonBadge = ({ isHigher, percentage }: ComparisonBadgeProps) => {
  const text = isHigher ? "more" : "less";

  return (
    <View
      className={`${isHigher ? "bg-kashi-negative/10" : "bg-kashi-positive/10"} py-1 pr-4 pl-2 rounded-2xl self-start flex flex-row gap-1 justify-center items-center`}
    >
      <Ionicons
        name={`${!isHigher ? "arrow-down" : "arrow-up"}`}
        size={20}
        className={`${isHigher ? "text-kashi-negative" : "text-kashi-positive"}`}
      />
      <Text
        className={`${isHigher ? "text-kashi-negative" : "text-kashi-positive"} font-grotesk`}
      >
        {percentage}% {text} than last month
      </Text>
    </View>
  );
};

const MonthlySpendingCard = () => {
  const getCurrentMonthYear = () => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date());
  };

  return (
    <View className="bg-kashi-card flex flex-row px-4 py-6 rounded-2xl">
      <View className="flex-1">
        <Text className="uppercase text-kashi-text-secondary font-grotesk-semibold leading-tight text-lg">
          {getCurrentMonthYear()}
        </Text>
        <Text className="text-kashi-text-secondary font-grotesk">
          Total Spent
        </Text>
        <Text className="text-kashi-text-primary font-grotesk-bold text-4xl my-4">
          RM 2,3345.80
        </Text>
        <ComparisonBadge isHigher={false} percentage={13.8} />
      </View>
      <View>
        <Ionicons
          name="calendar-clear-outline"
          size={24}
          className="text-kashi-text-muted"
        />
      </View>
    </View>
  );
};

export default MonthlySpendingCard;
