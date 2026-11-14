import { colors } from "@/constants/colors";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <View className="flex-1 gap-2">
      <Skeleton
        width="100%"
        height={155}
        borderRadius={16}
        backgroundColor={colors.card}
      />
      <Skeleton
        width={100}
        height={15}
        borderRadius={16}
        backgroundColor={colors.card}
        className="mt-5"
      />
      <Skeleton
        width="100%"
        height={70}
        borderRadius={8}
        backgroundColor={colors.card}
        className="mt-3"
      />
      <Skeleton
        width="100%"
        height={70}
        borderRadius={8}
        backgroundColor={colors.card}
        className="mt-1"
      />
      <Skeleton
        width={130}
        height={15}
        borderRadius={16}
        backgroundColor={colors.card}
        className="mt-10"
      />
      <Skeleton
        width={"100%"}
        height={15}
        borderRadius={16}
        backgroundColor={colors.card}
        className="flex-1 mt-2"
      />
    </View>
  );
};

export default DashboardSkeleton;
