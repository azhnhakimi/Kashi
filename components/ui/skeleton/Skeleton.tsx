import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import {
  Animated,
  View,
  type DimensionValue,
  type LayoutChangeEvent,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { SkeletonContext } from "./SkeletonProvider";

type SkeletonProps = Omit<ViewProps, "style"> & {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  backgroundColor?: string;
  shimmerColor?: string;
  style?: ViewStyle;
  className?: string;
};

const Skeleton = ({
  width = "100%",
  height = 16,
  borderRadius = 4,
  backgroundColor = "#252525",
  shimmerColor = "#454545",
  style,
  className,
  onLayout,
  ...rest
}: SkeletonProps) => {
  const context = useContext(SkeletonContext);

  useEffect(() => {
    if (!context) return;

    context.register();

    return () => context.unregister();
  }, [context]);

  const shimmer = context?.shimmer;

  const [measuredWidth, setMeasuredWidth] = useState(0);

  const translateX = shimmer
    ? shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [-measuredWidth * 0.6, measuredWidth],
      })
    : 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    setMeasuredWidth(event.nativeEvent.layout.width);
    onLayout?.(event);
  };

  return (
    <View
      {...rest}
      className={className}
      onLayout={handleLayout}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {shimmer && measuredWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "60%",
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={["transparent", shimmerColor, "transparent"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Skeleton;
