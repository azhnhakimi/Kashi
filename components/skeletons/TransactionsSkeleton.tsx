import { colors } from "@/constants/colors";
import SkeletonLoading from "expo-skeleton-loading";
import { View } from "react-native";

const TransactionsSkeleton = () => {
  return (
    <View style={{ flex: 1, margin: 2 }}>
      <SkeletonLoading background={colors.card} highlight={colors.text.muted}>
        <View
          style={{
            borderRadius: 15,
            height: "100%",
            backgroundColor: colors.bg,
          }}
        />
      </SkeletonLoading>
    </View>
  );
};

export default TransactionsSkeleton;
