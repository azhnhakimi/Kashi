import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AddTransactionBtn = () => {
  const router = useRouter();

  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(pressed.value ? "#5025D5" : "#6331FB", {
      duration: 150,
    }),
  }));

  return (
    <Pressable
      onPress={() => router.push("/transaction/create")}
      onPressIn={() => (pressed.value = true)}
      onPressOut={() => (pressed.value = false)}
    >
      <Animated.View
        style={animatedStyle}
        className="flex flex-row justify-center items-center p-3 rounded-xl gap-1"
      >
        <Entypo
          name="plus"
          size={24}
          className="text-kashi-text-onAccent font-bold"
        />
        <Text className="text-kashi-text-onAccent font-grotesk-semibold">
          ADD TRANSACTION
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default AddTransactionBtn;
