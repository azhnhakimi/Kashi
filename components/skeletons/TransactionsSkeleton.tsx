import { colors } from "@/constants/colors";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

const TransactionsSkeleton = () => {
  return (
    <View className="flex-1 gap-2">
      <Skeleton
        width="100%"
        height={94}
        borderRadius={8}
        backgroundColor={colors.card}
      />
      <Skeleton
        width="100%"
        height={94}
        borderRadius={8}
        backgroundColor={colors.card}
      />
      <Skeleton
        width="100%"
        height={94}
        borderRadius={8}
        backgroundColor={colors.card}
      />
      <Skeleton
        width="100%"
        height={94}
        borderRadius={8}
        backgroundColor={colors.card}
      />
      <Skeleton
        width="100%"
        height={94}
        borderRadius={8}
        backgroundColor={colors.card}
      />
      <Skeleton
        width="100%"
        height={94}
        borderRadius={8}
        backgroundColor={colors.card}
      />
    </View>
  );
};

export default TransactionsSkeleton;
