import { colors } from "@/constants/colors";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

const TransactionDetailsSkeleton = () => {
  return (
    <View className="flex-1 gap-2">
      <Skeleton
        width="100%"
        height={235}
        borderRadius={16}
        backgroundColor={colors.card}
      />
      <Skeleton
        width="100%"
        height={160}
        borderRadius={16}
        backgroundColor={colors.card}
      />
      <View className="mt-auto gap-2">
        <Skeleton
          width="100%"
          height={50}
          borderRadius={8}
          backgroundColor={colors.card}
        />
        <Skeleton
          width="100%"
          height={50}
          borderRadius={8}
          backgroundColor={colors.card}
        />
      </View>
    </View>
  );
};

export default TransactionDetailsSkeleton;
