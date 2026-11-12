import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const CreateMappingBtn = () => {
  const route = useRouter();

  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(pressed.value ? "#5025D5" : "#6331FB", {
      duration: 150,
    }),
  }));

  return (
    <Pressable
      onPress={() => {
        route.push("/mapping/create");
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

export default CreateMappingBtn;
