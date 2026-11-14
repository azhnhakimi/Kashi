import { Skeleton } from "@/components/ui/skeleton";
import { colors } from "@/constants/colors";
import { View } from "react-native";

const SettlementsSkeleton = () => {
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

export default SettlementsSkeleton;
