import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const DeleteTransactionBtn = ({ onPress }: { onPress: () => void }) => {
  const router = useRouter();

  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(pressed.value ? "#B93636" : "#DC4545", {
      duration: 150,
    }),
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (pressed.value = true)}
      onPressOut={() => (pressed.value = false)}
    >
      <Animated.View
        style={animatedStyle}
        className="flex flex-row justify-center items-center p-3 rounded-xl gap-2"
      >
        <AntDesign
          name="delete"
          size={20}
          className="text-[#7F1D1D] font-bold"
        />
        <Text className="text-[#7F1D1D] font-grotesk-semibold">
          DELETE TRANSACTION
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default DeleteTransactionBtn;
