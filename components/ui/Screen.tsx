import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";

type ScreenProps = ViewProps & { className?: string; edges?: Edge[] };

export function Screen({
  edges = ["top"],
  className,
  style,
  ...props
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const inset = (edge: Edge) => (edges.includes(edge) ? insets[edge] : 0);

  return (
    <View
      className={`flex-1 bg-kashi-bg ${className ?? ""}`}
      style={[
        {
          paddingTop: inset("top") + 16,
          paddingBottom: inset("bottom") + 16,
          paddingLeft: inset("left") + 16,
          paddingRight: inset("right") + 16,
        },
        style,
      ]}
      {...props}
    />
  );
}
