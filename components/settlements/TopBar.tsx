import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type TobBarSelection = "incoming" | "outgoing";

type TopBarProps = {
  content: TobBarSelection;
  setContent: (prop: TobBarSelection) => void;
};

const TABS: TobBarSelection[] = ["incoming", "outgoing"];

const TopBar = ({ content, setContent }: TopBarProps) => {
  const tabWidth = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(content === "outgoing" ? tabWidth.value : 0, {
      duration: 150,
    });
  }, [content]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      className="bg-kashi-card rounded-lg flex flex-row relative overflow-hidden"
      onLayout={(event) => {
        tabWidth.value = event.nativeEvent.layout.width / 2;
        translateX.value = withTiming(
          content === "outgoing" ? tabWidth.value : 0,
          { duration: 150 },
        );
      }}
    >
      <Animated.View
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-kashi-accent rounded-lg"
        style={animatedStyle}
      />

      {TABS.map((tab) => (
        <Pressable
          key={tab}
          className="flex-1 p-4 justify-center items-center"
          onPress={() => setContent(tab)}
        >
          <Text className="font-grotesk-semibold uppercase text-sm text-white">
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default TopBar;
