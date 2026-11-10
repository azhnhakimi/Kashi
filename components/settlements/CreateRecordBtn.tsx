import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type mode = "incoming" | "outgoing";

type CreateRecordBtnProps = {
  mode: mode;
};

const CreateRecordBtn = ({ mode }: CreateRecordBtnProps) => {
  const router = useRouter();

  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(pressed.value ? "#5025D5" : "#6331FB", {
      duration: 150,
    }),
  }));

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/settlements/template",
          params: { mode: "create", source: mode },
        });
      }}
      onPressIn={() => (pressed.value = true)}
      onPressOut={() => (pressed.value = false)}
      className="mt-auto"
    >
      <Animated.View
        style={animatedStyle}
        className="p-3 rounded-xl justify-center items-center"
      >
        <Text className="text-kashi-text-onAccent font-grotesk-semibold text-lg uppercase">
          create
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default CreateRecordBtn;
