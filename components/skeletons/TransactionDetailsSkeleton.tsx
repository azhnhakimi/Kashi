import { colors } from "@/constants/colors";
import SkeletonLoading from "expo-skeleton-loading";
import { useState } from "react";
import { View } from "react-native";

const TransactionDetailsSkeleton = () => {
  const [h, setH] = useState(0);

  return (
    <View
      key={h}
      className="flex-1"
      onLayout={(e) => setH(e.nativeEvent.layout.height)}
    >
      {h > 0 && (
        <SkeletonLoading background={colors.card} highlight={colors.text.muted}>
          <View
            style={{
              flexDirection: "column",
              gap: 6,
              height: h,
            }}
          >
            <View
              style={{
                borderRadius: 10,
                backgroundColor: colors.bg,
                height: 250,
              }}
            />
            <View
              style={{
                borderRadius: 10,
                backgroundColor: colors.bg,
                height: 180,
              }}
            />
            <View
              style={{
                borderRadius: 10,
                flex: 1,
              }}
            />
            <View
              style={{
                borderRadius: 10,
                backgroundColor: colors.bg,
                height: 90,
              }}
            />
          </View>
        </SkeletonLoading>
      )}
    </View>
  );
};

export default TransactionDetailsSkeleton;
